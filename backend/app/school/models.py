from sqlalchemy import Column, Integer, String, Date, DateTime, Boolean, func
from app.core.database import Base


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
