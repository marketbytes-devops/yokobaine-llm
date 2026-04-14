from pydantic import BaseModel
from typing import List
from datetime import datetime

class SubjectConfigBase(BaseModel):
    target_class: str
    segment: str
    subjects: List[str]

class SubjectConfigCreate(SubjectConfigBase):
    pass

class SubjectConfigResponse(SubjectConfigBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
