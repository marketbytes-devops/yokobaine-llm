from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date, datetime

class SchoolProfileBase(BaseModel):
    school_name: str
    reg_number: Optional[str] = None
    principal_name: Optional[str] = None
    contact_email: Optional[EmailStr] = None
    phone_number: Optional[str] = None
    logo_url: Optional[str] = None

class SchoolProfileCreate(SchoolProfileBase):
    pass

class SchoolProfileUpdate(SchoolProfileBase):
    school_name: Optional[str] = None

class SchoolProfileResponse(SchoolProfileBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class AcademicTermBase(BaseModel):
    academic_year: str
    term_start_date: Optional[date] = None
    term_end_date: Optional[date] = None

class AcademicTermCreate(AcademicTermBase):
    pass

class AcademicTermUpdate(AcademicTermBase):
    academic_year: Optional[str] = None

class AcademicTermResponse(AcademicTermBase):
    id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
