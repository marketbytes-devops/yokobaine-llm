from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
import enum
from app.core.database import Base

class UserRole(str, enum.Enum):
    ADMIN = "admin"
    TEACHER = "teacher"
    STUDENT = "student"
    PARENT = "parent"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, index=True)
    username = Column(String(255), unique=True, index=True)
    hashed_password = Column(String(255))
    role = Column(SQLEnum(UserRole), default=UserRole.STUDENT)
    is_active = Column(Boolean, default=True)
