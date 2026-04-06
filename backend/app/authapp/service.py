from sqlalchemy.orm import Session
from fastapi import HTTPException, status, BackgroundTasks
from datetime import timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.authapp import models, schemas
from app.core import security, config

def create_user(db: Session, user: schemas.UserCreate):
    db_user = db.query(models.User).filter(
        (models.User.email == user.email) | (models.User.username == user.username)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email or username already registered")
    
    hashed_password = security.get_password_hash(user.password)
    new_user = models.User(
        email=user.email,
        username=user.username,
        hashed_password=hashed_password,
        role=user.role
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(db: Session, username: str, password: str):
    user = db.query(models.User).filter(
        (models.User.username == username) | (models.User.email == username)
    ).first()
    
    if not user or not security.verify_password(password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username, "role": user.role, "id": user.id}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": user.role}

def send_reset_password_email(email_to: str, token: str):
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    
    server = smtplib.SMTP(config.settings.SMTP_SERVER, config.settings.SMTP_PORT)
    server.starttls()
    try:
        server.login(config.settings.SMTP_USERNAME, config.settings.SMTP_PASSWORD)
        
        message = MIMEMultipart("alternative")
        message["Subject"] = "Password Reset Request"
        message["From"] = config.settings.SENDER_EMAIL
        message["To"] = email_to
        
        text = f"Click the link below to reset your password:\n\n{reset_link}"
        html = f"<p>Click the link below to reset your password:</p><p><a href='{reset_link}'>{reset_link}</a></p>"
        
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")
        message.attach(part1)
        message.attach(part2)
        
        server.sendmail(
            config.settings.SENDER_EMAIL, email_to, message.as_string()
        )
    except Exception as e:
        print(f"Failed to send email: {e}")
    finally:
        server.quit()

def process_forgot_password(db: Session, email: str, background_tasks: BackgroundTasks):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        # Prevent email scanning by returning ok even if not found
        return {"msg": "If your email is registered, you will receive a reset link shortly."}
    
    token = security.create_password_reset_token(email=user.email)
    
    background_tasks.add_task(send_reset_password_email, user.email, token)
    return {"msg": "If your email is registered, you will receive a reset link shortly."}

def process_reset_password(db: Session, token: str, new_password: str):
    email = security.verify_password_reset_token(token)
    if not email:
        raise HTTPException(status_code=400, detail="Invalid token")
        
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    hashed_password = security.get_password_hash(new_password)
    user.hashed_password = hashed_password
    db.commit()
    return {"msg": "Password updated successfully"}
