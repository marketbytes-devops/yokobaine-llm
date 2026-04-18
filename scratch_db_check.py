
from app.core.database import SessionLocal
from app.timetable.models import ClassWorkload
from sqlalchemy import inspect

db = SessionLocal()
try:
    inspector = inspect(db.bind)
    tables = inspector.get_table_names()
    print(f"Tables: {tables}")
    if "timetable_workloads" in tables:
        count = db.query(ClassWorkload).count()
        print(f"Workloads count: {count}")
    else:
        print("Table timetable_workloads DOES NOT EXIST")
finally:
    db.close()
