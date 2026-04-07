import os
import sys


sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core import database, security
from app.authapp import models

def seed_admin():
    db = database.SessionLocal()
    
   
    ADMIN_EMAIL = "nithyapradeep047@gmail.com"
    ADMIN_PASSWORD = "nithya123"
    

    admin_user = db.query(models.User).filter(models.User.email == ADMIN_EMAIL).first()
    hashed_password = security.get_password_hash(ADMIN_PASSWORD)

    if admin_user:
      
        print(f"Updating admin user: {ADMIN_EMAIL}")
        admin_user.hashed_password = hashed_password
        admin_user.role = models.UserRole.ADMIN
        admin_user.is_active = True
    else:
      
        print(f"Creating new admin user: {ADMIN_EMAIL}")
        new_admin = models.User(
            email=ADMIN_EMAIL,
            username="SchoolAdmin",
            hashed_password=hashed_password,
            role=models.UserRole.ADMIN,
            is_active=True
        )
        db.add(new_admin)
    
    db.commit()
    print("Seed process complete!")
    db.close()

if __name__ == "__main__":
    seed_admin()
