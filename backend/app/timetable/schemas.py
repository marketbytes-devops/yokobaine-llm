from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class TimetableConfigBase(BaseModel):
    level: str
    stream: Optional[str] = None
    days: List[str]
    periods: int
    duration: int
    breaks: List[dict] = []
    drill_periods: List[dict] = []

class TimetableConfigCreate(TimetableConfigBase):
    pass

class TimetableConfigResponse(TimetableConfigBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True

class WorkloadBase(BaseModel):
    config_id: Optional[int] = None
    class_id: int
    subject_name: str
    teacher_id: int
    periods_per_week: int

class WorkloadCreate(WorkloadBase):
    pass

class WorkloadResponse(WorkloadBase):
    id: int
    class Config:
        from_attributes = True

class TimetableGenerateRequest(BaseModel):
    level: str
    stream: Optional[str] = None
    term_id: Optional[int] = None
