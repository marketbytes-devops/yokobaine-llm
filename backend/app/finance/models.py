from sqlalchemy import Column, Integer, String, Float, Date
from app.core.database import Base

class FeeCategory(Base):
    __tablename__ = "fee_categories"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, index=True, nullable=False)

class FeeStructure(Base):
    __tablename__ = "fee_structures"
    id = Column(Integer, primary_key=True, index=True)
    section = Column(String(50), nullable=False)
    class_name = Column(String(50), nullable=False)
    category_name = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    frequency = Column(String(50), nullable=False)
    due_date = Column(Date, nullable=True) 
    due_day = Column(Integer, nullable=True) # Deadline day of month (1-31)
    invoice_day = Column(Integer, nullable=True) # Day it appears in profile (1-31)
    month_from = Column(String(20), nullable=True)
    month_to = Column(String(20), nullable=True)

class StudentInvoice(Base):
    __tablename__ = "student_invoices"
    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, index=True, nullable=False)
    fee_type = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    due_date = Column(Date, nullable=False)
    status = Column(String(50), default="Pending")

class FeeFrequency(Base):
    __tablename__ = "fee_frequencies"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, index=True, nullable=False)
