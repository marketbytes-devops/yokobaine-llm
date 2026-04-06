import os
import sys

# Automatically add the backend directory to python's path so 'app' can be imported easily
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core import database, security
from app.authapp import models

def seed_admin():
    db = database.SessionLocal()
    
    # Check if admin already exists
    admin_user = db.query(models.User).filter(models.User.email == "admin@yokobaine.com").first()
    if admin_user:
        print("Admin user already exists!")
        return

    # Create an admin user
    hashed_password = security.get_password_hash("admin123")
    new_admin = models.User(
        email="admin@yokobaine.com",
        username="SchoolAdmin",
        hashed_password=hashed_password,
        role=models.UserRole.ADMIN,
        is_active=True
    )
    
    db.add(new_admin)
    db.commit()
    print("Seed successful! Admin user created:")
    print("Email: admin@yokobaine.com")
    print("Password: admin123")
    
    db.close()

if __name__ == "__main__":
    seed_admin()
