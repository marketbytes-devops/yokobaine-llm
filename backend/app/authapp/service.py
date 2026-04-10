from fastapi import HTTPException, status, BackgroundTasks, Depends
from sqlalchemy.orm import Session
from datetime import timedelta
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.authapp import models, schemas
from app.core import security, config, database
from fastapi.security import OAuth2PasswordBearer
import jwt
import random

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")

otp_store = {}

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(database.get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, config.settings.SECRET_KEY, algorithms=[config.settings.ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except jwt.PyJWTError:
        raise credentials_exception
        
    user = db.query(models.User).filter(models.User.username == username).first()
    if user is None:
        raise credentials_exception
    return user

# --- Simple Role Management ---
def create_role(db: Session, role: schemas.RoleCreate):
    # Check if a role with this name already exists
    existing_role = db.query(models.Role).filter(models.Role.name == role.name).first()
    if existing_role:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Role with name '{role.name}' already exists"
        )
    
    db_role = models.Role(name=role.name, description=role.description)
    db.add(db_role)
    db.commit()
    db.refresh(db_role)
    return db_role

def get_roles(db: Session):
    return db.query(models.Role).all()

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
        first_name=user.first_name,
        last_name=user.last_name,
        role_id=user.role_id
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
    
    role_name = user.role.name if user.role else "User"
    
    access_token_expires = timedelta(minutes=config.settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = security.create_access_token(
        data={"sub": user.username, "role": role_name, "id": user.id}, 
        expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer", "role": role_name}

# (Existing Email logic omitted for brevity in summary, but kept in file)
def send_reset_password_email(email_to: str, otp_code: str):    
    try:
        server = smtplib.SMTP(config.settings.SMTP_SERVER, config.settings.SMTP_PORT)
        server.starttls()
        server.login(config.settings.SMTP_USERNAME, config.settings.SMTP_PASSWORD)
        message = MIMEMultipart("alternative")
        message["Subject"] = "Your Password Reset Code"
        message["From"] = config.settings.SENDER_EMAIL
        message["To"] = email_to
        text = f"Code: {otp_code}"; html = f"<h2>{otp_code}</h2>"
        message.attach(MIMEText(text, "plain")); message.attach(MIMEText(html, "html"))
        server.sendmail(config.settings.SENDER_EMAIL, email_to, message.as_string())
        server.quit()
    except Exception as e:
        print(f"Failed to send email: {e}")

def process_forgot_password(db: Session, email: str, background_tasks: BackgroundTasks):
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user: raise HTTPException(status_code=404, detail="Email not found")
    otp_code = str(random.randint(1000, 9999))
    otp_store[user.email] = otp_code
    send_reset_password_email(user.email, otp_code)
    return {"msg": "Email sent"}

def process_reset_password(db: Session, email: str, token: str, new_password: str):
    valid_otp = otp_store.get(email)
    if not valid_otp or valid_otp != token: raise HTTPException(status_code=400, detail="Invalid code")
    user = db.query(models.User).filter(models.User.email == email).first()
    if not user: raise HTTPException(status_code=404, detail="User not found")
    user.hashed_password = security.get_password_hash(new_password)
    db.commit()
    del otp_store[email]
    return {"msg": "Success"}
