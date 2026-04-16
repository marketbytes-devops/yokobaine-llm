from pydantic import BaseModel, EmailStr
from typing import Optional, List
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


# --- TEACHER SCHEMAS ---

class SchoolSectionBase(BaseModel):
    name: str

class SchoolSectionResponse(SchoolSectionBase):
    id: int
    class Config:
        from_attributes = True

class SchoolClassBase(BaseModel):
    class_name: str
    section_identifier: Optional[str] = None
    stream: Optional[str] = None
    room_number: Optional[str] = None
    capacity: int = 40

class SchoolClassCreate(SchoolClassBase):
    section_name: str # e.g. LP, UP
    class_teacher_id: Optional[int] = None

class TeacherSimple(BaseModel):
    id: int
    full_name: str
    class Config:
        from_attributes = True

class SchoolClassResponse(SchoolClassBase):
    id: int
    section_id: int
    class_teacher_id: Optional[int] = None
    class_teacher: Optional[TeacherSimple] = None
    class Config:
        from_attributes = True

class SchoolSectionWithClassesResponse(SchoolSectionResponse):
    classes: List[SchoolClassResponse] = []

class TeacherBase(BaseModel):
    full_name: str
    qualification: Optional[str] = None
    subjects: List[str] = []
    constraints: List[dict] = []

class TeacherCreate(TeacherBase):
    section_names: List[str] = []

class TeacherUpdate(BaseModel):
    full_name: Optional[str] = None
    qualification: Optional[str] = None
    subjects: Optional[List[str]] = None
    constraints: Optional[List[dict]] = None
    section_names: Optional[List[str]] = None

class TeacherResponse(TeacherBase):
    id: int
    is_active: bool
    sections: List[SchoolSectionResponse] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
