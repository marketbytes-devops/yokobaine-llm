from sqlalchemy import text
from app.core.database import engine

def add_column():
    try:
        with engine.connect() as conn:
            print("Adding 'due_date' column to fee_structures...")
            try:
                conn.execute(text("ALTER TABLE fee_structures ADD COLUMN due_date DATE NULL"))
                conn.commit()
                print("Added 'due_date' column.")
            except Exception as e:
                print(f"Column might already exist or error: {e}")
            
            print("Migration complete.")
    except Exception as e:
        print(f"Failed to connect to DB: {e}")

if __name__ == "__main__":
    add_column()
