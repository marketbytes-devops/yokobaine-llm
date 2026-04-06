from urllib.parse import quote_plus
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings

encoded_password = quote_plus(settings.MYSQL_PASSWORD)
SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{settings.MYSQL_USER}:{encoded_password}@{settings.MYSQL_SERVER}/{settings.MYSQL_DB}"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
