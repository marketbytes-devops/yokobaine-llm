from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.school.models import Teacher
from app.school.schemas import TeacherResponse
from pydantic import TypeAdapter
import urllib.parse

password = urllib.parse.quote_plus("Gatsbymarketbytes@9633")
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{password}@localhost/yokobine_db"
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

db = SessionLocal()
try:
    teachers = db.query(Teacher).all()
    print(f"Query successful. Found {len(teachers)} teachers.")
    
    for t in teachers:
        print(f"Teacher {t.id}: {t.full_name}, subjects type: {type(t.subjects)}, constraints type: {type(t.constraints)}")

    adapter = TypeAdapter(list[TeacherResponse])
    data = adapter.validate_python(teachers)
    print("Serialization successful.")
except Exception as e:
    print(f"ERROR: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
finally:
    db.close()
