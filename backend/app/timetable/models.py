from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base

class TimetableConfig(Base):
    __tablename__ = "timetable_configs"

    id           = Column(Integer, primary_key=True, index=True)
    level        = Column(String(50), nullable=False) # e.g. LP, UP
    stream       = Column(String(100), nullable=True) 
    days         = Column(JSON, nullable=False)      # List of days: ["Mon", "Tue"...]
    periods      = Column(Integer, default=8)
    duration     = Column(Integer, default=45)
    breaks       = Column(JSON, default=[])         # List of break objects
    drill_periods = Column(JSON, default=[])        # List of drill period objects
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())

class ClassWorkload(Base):
    __tablename__ = "timetable_workloads"

    id               = Column(Integer, primary_key=True, index=True)
    config_id        = Column(Integer, ForeignKey("timetable_configs.id"), nullable=True) # Linked to a specific config
    class_id         = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    subject_name     = Column(String(100), nullable=False)
    teacher_id       = Column(Integer, ForeignKey("teachers.id"), nullable=False)
    periods_per_week = Column(Integer, nullable=False)
    
    # Relationships
    school_class = relationship("SchoolClass")
    teacher      = relationship("Teacher")

class TimetableSolution(Base):
    __tablename__ = "timetable_solutions"

    id         = Column(Integer, primary_key=True, index=True)
    class_id   = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    term_id    = Column(Integer, ForeignKey("academic_term.id"), nullable=True)
    grid_data  = Column(JSON, nullable=False) # Full 2D array of the schedule
    is_active  = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
