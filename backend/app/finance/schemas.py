from pydantic import BaseModel
from typing import Optional
from datetime import date

class FeeCategoryBase(BaseModel):
    name: str

class FeeCategoryCreate(FeeCategoryBase):
    pass

class FeeCategoryResponse(FeeCategoryBase):
    id: int
    class Config:
        from_attributes = True

class FeeStructureBase(BaseModel):
    section: str
    class_name: str
    category_name: str
    amount: float
    frequency: str
    due_date: Optional[date] = None
    due_day: Optional[int] = None
    invoice_day: Optional[int] = None
    month_from: Optional[str] = None
    month_to: Optional[str] = None

class FeeStructureCreate(FeeStructureBase):
    pass

class FeeStructureResponse(FeeStructureBase):
    id: int
    class Config:
        from_attributes = True

class StudentInvoiceBase(BaseModel):
    student_id: int
    fee_type: str
    amount: float
    due_date: date
    status: str = "Pending"

class StudentInvoiceCreate(StudentInvoiceBase):
    pass

class StudentInvoiceResponse(StudentInvoiceBase):
    id: int
    class Config:
        from_attributes = True

class FeeFrequencyBase(BaseModel):
    name: str

class FeeFrequencyCreate(FeeFrequencyBase):
    pass

class FeeFrequencyResponse(FeeFrequencyBase):
    id: int
    class Config:
        from_attributes = True
