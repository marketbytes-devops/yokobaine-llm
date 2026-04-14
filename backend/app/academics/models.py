from sqlalchemy import Column, Integer, String, JSON, DateTime, func
from app.core.database import Base

class SubjectConfiguration(Base):
    __tablename__ = "subject_configurations"

    id           = Column(Integer, primary_key=True, index=True)
    target_class = Column(String(100), nullable=False) 
    segment      = Column(String(100), nullable=False) 
    subjects     = Column(JSON, nullable=False)       
    
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())
