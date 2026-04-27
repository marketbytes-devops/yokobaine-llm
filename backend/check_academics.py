from sqlalchemy import text
from app.core.database import engine

def check_academics():
    try:
        with engine.connect() as conn:
            print("Fetching all subject configurations...")
            res = conn.execute(text("SELECT segment, target_class FROM subject_configurations"))
            rows = res.fetchall()
            if not rows:
                print("NO subject configurations found in database!")
            for row in rows:
                print(f"Segment: '{row[0]}', Class: '{row[1]}'")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_academics()
