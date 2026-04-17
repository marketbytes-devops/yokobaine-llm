from pydantic import BaseModel, ConfigDict
from datetime import datetime
from typing import Optional, List

class NoticeBase(BaseModel):
    title: str
    content: str
    category: str = "General"
    target_audience: List[str] = ["All"]
    is_pinned: bool = False
    attachment_url: Optional[str] = None

class NoticeCreate(NoticeBase):
    pass

class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    target_audience: Optional[List[str]] = None
    is_pinned: Optional[bool] = None
    attachment_url: Optional[str] = None

class NoticeResponse(NoticeBase):
    id: int
    posted_by_id: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
