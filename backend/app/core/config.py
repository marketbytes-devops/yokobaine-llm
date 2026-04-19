import os
from dotenv import load_dotenv

load_dotenv()  

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 1440))
    
    DB_USER = os.getenv("DB_USER", "root")
    DB_PASSWORD = os.getenv("DB_PASSWORD", "marketbytesshared@9633")
    DB_HOST = os.getenv("DB_HOST", "shared-mysql")
    DB_NAME = os.getenv("DB_NAME", "yokobainellmdb")
    DB_PORT = os.getenv("DB_PORT", "3306")
    
    SMTP_SERVER = os.getenv("SMTP_SERVER")
    SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL")

settings = Settings()