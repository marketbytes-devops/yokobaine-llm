from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, func, JSON
from sqlalchemy.orm import relationship
from app.core.database import Base

class Notice(Base):
    __tablename__ = "notices"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String(50), default="General") # e.g., General, Event, Holiday, Exam
    target_audience = Column(JSON, default=["All"]) # e.g., ["All", "Teachers", "Students", "Parents"]
    is_pinned = Column(Boolean, default=False)
    attachment_url = Column(String(500), nullable=True)
    
    posted_by_id = Column(Integer, ForeignKey("users.id"))
    
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relationship to user
    posted_by = relationship("app.authapp.models.User")
