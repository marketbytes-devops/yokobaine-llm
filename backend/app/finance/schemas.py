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
