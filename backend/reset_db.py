from sqlalchemy import text
from app.core.database import engine, Base, SessionLocal
from app.authapp import models

def reset_and_seed():
    db = SessionLocal()
    try:
        print("Disabling foreign key checks...")
        db.execute(text("SET FOREIGN_KEY_CHECKS = 0;"))
        db.commit()
        
        # Manually drop tables if drop_all fails
        print("Dropping tables manually...")
        tables = ["users", "roles"] # Simple list for now
        for table in tables:
            try:
                db.execute(text(f"DROP TABLE IF EXISTS {table};"))
                db.commit()
                print(f"Dropped {table}")
            except Exception as e:
                print(f"Failed to drop {table}: {e}")

        print("Creating new database schema...")
        Base.metadata.create_all(bind=engine)
        
        print("Enabling foreign key checks...")
        db.execute(text("SET FOREIGN_KEY_CHECKS = 1;"))
        db.commit()
        
        # --- Basic Seeding ---
        print("Creating default 'SuperAdmin' role...")
        sa_role = models.Role(
            name="SuperAdmin", 
            description="Full access to manage the school"
        )
        db.add(sa_role)
        db.commit()
        db.refresh(sa_role)
        
        print(f"Success! Database reset. 'SuperAdmin' role created with ID: {sa_role.id}")
    except Exception as e:
        print(f"CRITICAL ERROR: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()
