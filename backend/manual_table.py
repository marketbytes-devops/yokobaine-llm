from app.core.database import engine
from sqlalchemy import text

with engine.connect() as conn:
    try:
        conn.execute(text("""
            CREATE TABLE roles (
                id INTEGER NOT NULL AUTO_INCREMENT, 
                name VARCHAR(100) NOT NULL, 
                description VARCHAR(255), 
                PRIMARY KEY (id),
                UNIQUE (name)
            )
        """))
        conn.commit()
        print("Table 'roles' created successfully")
    except Exception as e:
        print(f"Failed to create table 'roles': {e}")
