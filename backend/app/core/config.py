import os

class Settings:
    SECRET_KEY = os.getenv("SECRET_KEY", "yokobaine_super_secret_key")
    ALGORITHM = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24
    
    MYSQL_USER = os.getenv("MYSQL_USER", "root")
    MYSQL_PASSWORD = os.getenv("MYSQL_PASSWORD", "Gatsbymarketbytes@9633")
    MYSQL_SERVER = os.getenv("MYSQL_SERVER", "localhost")
    MYSQL_DB = os.getenv("MYSQL_DB", "yokobine_db")
    
    # SMTP Settings for Password Reset
    SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
    SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
    SMTP_USERNAME = os.getenv("SMTP_USERNAME", "nithyapradeep047@gmail.com")
    SMTP_PASSWORD = os.getenv("SMTP_PASSWORD", "bmyvyuockzvckhzd")
    SENDER_EMAIL = os.getenv("SENDER_EMAIL", "nithyapradeep047@gmail.com")

settings = Settings()
