import os
import sys


sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy.orm import Session
from app.core import database, security
from app.authapp import models

def seed_admin():
    db = database.SessionLocal()
    
    ADMIN_EMAIL = "yokobaine@gmail.com"
    ADMIN_PASSWORD = "Yokobaineadmin@2026"
    
    # 1. Ensure the SuperAdmin role exists in the 'roles' table
    sa_role = db.query(models.Role).filter(models.Role.name == "SuperAdmin").first()
    if not sa_role:
        print("Creating SuperAdmin role...")
        sa_role = models.Role(
            name="SuperAdmin",
            description="Full access to manage the school"
        )
        db.add(sa_role)
        db.commit()
        db.refresh(sa_role)

    # 2. Setup the admin user and link to child 'SuperAdmin' role
    admin_user = db.query(models.User).filter(models.User.email == ADMIN_EMAIL).first()
    hashed_password = security.get_password_hash(ADMIN_PASSWORD)

    if admin_user:
        print(f"Updating existing admin user: {ADMIN_EMAIL}")
        admin_user.hashed_password = hashed_password
        admin_user.role_id = sa_role.id
        admin_user.is_active = True
    else:
        print(f"Creating new admin user: {ADMIN_EMAIL}")
        new_admin = models.User(
            email=ADMIN_EMAIL,
            username="YokobaineAdmin",
            hashed_password=hashed_password,
            role_id=sa_role.id,
            is_active=True
        )
        db.add(new_admin)
    
    db.commit()
    print("Seed process complete! Admin user created/updated and linked to 'SuperAdmin' role.")
    db.close()

if __name__ == "__main__":
    seed_admin()
