from pydantic import BaseModel, ConfigDict
from datetime import date, datetime
from typing import Optional, List

class GuardianBase(BaseModel):
    full_name: str
    phone_number: str
    home_address: Optional[str] = None
    emergency_contact: Optional[str] = None

class GuardianCreate(GuardianBase):
    pass

class GuardianResponse(GuardianBase):
    id: int
    
    model_config = ConfigDict(from_attributes=True)


class StudentBase(BaseModel):
    admission_id: str
    full_name: str
    date_of_birth: Optional[date] = None
    blood_group: Optional[str] = None
    academic_level: str
    current_grade: str
    section_identifier: Optional[str] = None
    academic_stream: Optional[str] = None
    photo_url: Optional[str] = None

class StudentCreate(StudentBase):
    guardian: GuardianCreate
    class_teacher_id: Optional[int] = None

class StudentResponse(StudentBase):
    id: int
    is_active: bool
    guardian: Optional[GuardianResponse] = None
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
