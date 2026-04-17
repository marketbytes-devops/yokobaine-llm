from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, func, Table, ForeignKey, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base


# Association table for Teacher <-> Section (Many-to-Many)
teacher_section_link = Table(
    'teacher_section_link', Base.metadata,
    Column('teacher_id', Integer, ForeignKey('teachers.id'), primary_key=True),
    Column('section_id', Integer, ForeignKey('school_sections.id'), primary_key=True)
)


class SchoolProfile(Base):
    __tablename__ = "school_profile"

    id             = Column(Integer, primary_key=True, index=True)
    school_name    = Column(String(255), nullable=False)
    reg_number     = Column(String(100), nullable=True)
    principal_name = Column(String(150), nullable=True)
    contact_email  = Column(String(150), nullable=True)
    phone_number   = Column(String(30),  nullable=True)
    logo_url       = Column(String(500), nullable=True)
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime, server_default=func.now())
    updated_at     = Column(DateTime, server_default=func.now(), onupdate=func.now())


class AcademicTerm(Base):
    __tablename__ = "academic_term"

    id              = Column(Integer, primary_key=True, index=True)
    academic_year   = Column(String(20), nullable=False)
    term_start_date = Column(Date, nullable=True)
    term_end_date   = Column(Date, nullable=True)
    is_active       = Column(Boolean, default=True)
    created_at      = Column(DateTime, server_default=func.now())
    updated_at      = Column(DateTime, server_default=func.now(), onupdate=func.now())


class Teacher(Base):
    __tablename__ = "teachers"

    id             = Column(Integer, primary_key=True, index=True)
    full_name      = Column(String(255), nullable=False)
    qualification  = Column(String(255), nullable=True)
    subjects       = Column(JSON, default=[]) # List of strings
    constraints    = Column(JSON, default=[]) # List of {day, period} objects
    is_active      = Column(Boolean, default=True)
    created_at     = Column(DateTime, server_default=func.now())
    updated_at     = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationship
    sections = relationship("SchoolSection", secondary=teacher_section_link, back_populates="teachers")


class SchoolSection(Base):
    __tablename__ = "school_sections"

    id         = Column(Integer, primary_key=True, index=True)
    name       = Column(String(100), nullable=False, unique=True) # e.g. LP, UP...
    created_at = Column(DateTime, server_default=func.now())

    # Relationship
    teachers = relationship("Teacher", secondary=teacher_section_link, back_populates="sections")
    classes  = relationship("SchoolClass", back_populates="section")


class SchoolClass(Base):
    __tablename__ = "school_classes"

    id                 = Column(Integer, primary_key=True, index=True)
    class_name         = Column(String(100), nullable=False) # e.g. Class 10
    section_identifier = Column(String(50), nullable=True)  # e.g. A, B, Jupiter
    stream             = Column(String(100), nullable=True) 
    room_number        = Column(String(50), nullable=True)
    capacity           = Column(Integer, default=40)
    
    # Foreign Keys
    section_id       = Column(Integer, ForeignKey("school_sections.id"), nullable=False)
    class_teacher_id = Column(Integer, ForeignKey("teachers.id"), nullable=True)

    # Relationships
    section       = relationship("SchoolSection", back_populates="classes")
    class_teacher = relationship("Teacher")
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())
