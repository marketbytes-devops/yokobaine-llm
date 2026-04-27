from sqlalchemy import text
from app.core.database import engine

def check_8A():
    try:
        with engine.connect() as conn:
            # Find class8A ID
            c_res = conn.execute(text("SELECT id FROM school_classes WHERE class_name='Class 8' AND section_identifier='A'"))
            c_row = c_res.fetchone()
            if not c_row:
                print("Class 8A NOT found!")
                return
            
            class_id = c_row[0]
            print(f"Checking workloads for Class 8A (ID: {class_id})...")
            
            w_res = conn.execute(text(f"SELECT subject_name, periods_per_week, is_double, day, period FROM timetable_workloads WHERE class_id={class_id}"))
            w_rows = w_res.fetchall()
            
            total = 0
            for row in w_rows:
                print(f"Subject: {row[0]}, Periods: {row[1]}, Double: {row[2]}, Fixed: {row[3]} P{row[4]}")
                total += row[1]
            
            print(f"TOTAL PERIODS MAPPED: {total}")
            
            # Check config capacity
            cfg_res = conn.execute(text("SELECT days, periods FROM timetable_configs ORDER BY id DESC LIMIT 1"))
            cfg = cfg_res.fetchone()
            if cfg:
                import json
                days = json.loads(cfg[0])
                periods = cfg[1]
                capacity = len(days) * periods
                print(f"WEEKLY CAPACITY: {capacity}")
                if total > capacity:
                    print("!!! OVER CAPACITY !!! This is why it fails.")
                elif total == capacity:
                    print("Capacity is FULL. Very hard to solve with strict rules.")
                else:
                    print(f"Remaining slots: {capacity - total}")

    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    check_8A()
