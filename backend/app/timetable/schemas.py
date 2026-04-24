from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import datetime

class TimetableConfigBase(BaseModel):
    level: str
    stream: Optional[str] = None
    days: List[str]
    periods: int
    duration: int
    start_time: Optional[str] = "08:30 AM"
    end_time: Optional[str] = "03:30 PM"
    breaks: Optional[List[dict]] = []
    drill_periods: Optional[List[dict]] = []
    fixed_slots: Optional[List[dict]] = []


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
    is_double: Optional[bool] = False


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
    class_ids: Optional[List[int]] = None

