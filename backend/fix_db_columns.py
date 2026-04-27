from sqlalchemy import text
from app.core.database import engine

def fix_db():
    try:
        with engine.connect() as conn:
            print("Checking/Adding columns to timetable_workloads...")
            # Try to add day column
            try:
                conn.execute(text("ALTER TABLE timetable_workloads ADD COLUMN day VARCHAR(20) NULL"))
                conn.commit()
                print("Added 'day' column.")
            except Exception as e:
                print(f"'day' column might already exist or error: {e}")
            
            # Try to add period column
            try:
                conn.execute(text("ALTER TABLE timetable_workloads ADD COLUMN period INT NULL"))
                conn.commit()
                print("Added 'period' column.")
            except Exception as e:
                print(f"'period' column might already exist or error: {e}")

            # Make teacher_id nullable
            try:
                conn.execute(text("ALTER TABLE timetable_workloads MODIFY COLUMN teacher_id INT NULL"))
                conn.commit()
                print("Modified 'teacher_id' to be nullable.")
            except Exception as e:
                print(f"Error modifying teacher_id: {e}")
            
            print("Database fix complete.")
    except Exception as e:
        print(f"Failed to connect to DB: {e}")

if __name__ == "__main__":
    fix_db()
