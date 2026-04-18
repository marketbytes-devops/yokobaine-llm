from sqlalchemy import Column, Integer, String, Date, Text, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    admission_id = Column(String(50), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    date_of_birth = Column(Date, nullable=True)
    blood_group = Column(String(10), nullable=True)
    
    # Academic Classification
    academic_level = Column(String(50), nullable=False) # e.g. KG, LP, UP, HIGH SCHOOL
    current_grade = Column(String(50), nullable=False)  # e.g. Class 1, Class 10
    section_identifier = Column(String(50), nullable=True) # e.g. A, B, C
    academic_stream = Column(String(100), nullable=True) # e.g. Science, Commerce
    photo_url = Column(Text, nullable=True)
    
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationship
    guardian = relationship("Guardian", back_populates="student", uselist=False, cascade="all, delete-orphan")


class Guardian(Base):
    __tablename__ = "guardians"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(255), nullable=False)
    phone_number = Column(String(20), nullable=False)
    home_address = Column(Text, nullable=True)
    emergency_contact = Column(String(20), nullable=True)
    
    student_id = Column(Integer, ForeignKey("students.id"), unique=True)
    
    # Relationship
    student = relationship("Student", back_populates="guardian")
