from sqlalchemy import Column, Integer, String, JSON, ForeignKey, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from app.core.database import Base
from app.school.models import SchoolClass, Teacher

class TimetableConfig(Base):
    __tablename__ = "timetable_configs"

    id           = Column(Integer, primary_key=True, index=True)
    level        = Column(String(50), nullable=False) # e.g. LP, UP
    stream       = Column(String(100), nullable=True) 
    days         = Column(JSON, nullable=False)      # List of days: ["Mon", "Tue"...]
    periods      = Column(Integer, default=8)
    duration     = Column(Integer, default=45)
    start_time   = Column(String(20), nullable=True, default="08:30 AM")
    end_time     = Column(String(20), nullable=True, default="03:30 PM")
    breaks       = Column(JSON, default=[])         # List of break objects
    drill_periods = Column(JSON, default=[])        # List of drill period objects
    fixed_slots   = Column(JSON, default=[])        # New: Assembly, Lunch, etc.
    is_active    = Column(Boolean, default=True)
    created_at   = Column(DateTime, server_default=func.now())
    updated_at   = Column(DateTime, server_default=func.now(), onupdate=func.now())


class ClassWorkload(Base):
    __tablename__ = "timetable_workloads"

    id               = Column(Integer, primary_key=True, index=True)
    config_id        = Column(Integer, ForeignKey("timetable_configs.id"), nullable=True) # Linked to a specific config
    class_id         = Column(Integer, ForeignKey("school_classes.id"), nullable=False)
    subject_name     = Column(String(100), nullable=False)
    teacher_id       = Column(Integer, ForeignKey("teachers.id"), nullable=True)
    periods_per_week = Column(Integer, nullable=False)
    is_double        = Column(Boolean, default=False) # For Lab subjects
    day              = Column(String(20), nullable=True) # For fixed slots
    period           = Column(Integer, nullable=True)   # For fixed slots

    
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

class GlobalTimingSettings(Base):
    __tablename__ = "global_timing_settings"
    id = Column(Integer, primary_key=True, index=True)
    period_duration_minutes = Column(Integer)
    lunch_after_period = Column(Integer)
    lunch_duration_minutes = Column(Integer)
    short_break_after_period = Column(Integer)
    short_break_duration_minutes = Column(Integer)
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

class PeriodTimeSlot(Base):
    __tablename__ = "period_time_slots"
    id = Column(Integer, primary_key=True, index=True)
    class_name = Column(String(100), nullable=False)
    period_number = Column(Integer)
    start_time = Column(String(10), nullable=False)
    end_time = Column(String(10), nullable=False)
    is_break = Column(Boolean, default=False)
    break_name = Column(String(100), nullable=True)
