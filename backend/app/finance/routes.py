from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.finance import models, schemas
from typing import List
router = APIRouter(prefix="/api/v1/finance", tags=["Finance"])

@router.get("/categories", response_model=List[schemas.FeeCategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(models.FeeCategory).all()

@router.post("/categories", response_model=schemas.FeeCategoryResponse)
def create_category(category: schemas.FeeCategoryCreate, db: Session = Depends(get_db)):
    db_cat = db.query(models.FeeCategory).filter(models.FeeCategory.name == category.name).first()
    if db_cat:
        raise HTTPException(status_code=400, detail="Category already exists")
    new_cat = models.FeeCategory(name=category.name)
    db.add(new_cat)
    db.commit()
    db.refresh(new_cat)
    return new_cat

@router.delete("/categories/{cat_id}")
def delete_category(cat_id: int, db: Session = Depends(get_db)):
    db_cat = db.query(models.FeeCategory).filter(models.FeeCategory.id == cat_id).first()
    if not db_cat:
        raise HTTPException(status_code=404, detail="Category not found")
    db.delete(db_cat)
    db.commit()
    return {"ok": True}

@router.get("/structures", response_model=List[schemas.FeeStructureResponse])
def get_structures(db: Session = Depends(get_db)):
    return db.query(models.FeeStructure).all()

@router.post("/structures", response_model=schemas.FeeStructureResponse)
def create_structure(structure: schemas.FeeStructureCreate, db: Session = Depends(get_db)):
    new_struct = models.FeeStructure(**structure.model_dump())
    db.add(new_struct)
    db.commit()
    db.refresh(new_struct)
    return new_struct

@router.delete("/structures/{struct_id}")
def delete_structure(struct_id: int, db: Session = Depends(get_db)):
    db_struct = db.query(models.FeeStructure).filter(models.FeeStructure.id == struct_id).first()
    if not db_struct:
        raise HTTPException(status_code=404, detail="Structure not found")
    db.delete(db_struct)
    db.commit()
    return {"ok": True}

@router.get("/invoices/{student_id}", response_model=List[schemas.StudentInvoiceResponse])
def get_student_invoices(student_id: int, db: Session = Depends(get_db)):
    return db.query(models.StudentInvoice).filter(models.StudentInvoice.student_id == student_id).all()

@router.post("/invoices", response_model=schemas.StudentInvoiceResponse)
def create_student_invoice(invoice: schemas.StudentInvoiceCreate, db: Session = Depends(get_db)):
    new_inv = models.StudentInvoice(**invoice.model_dump())
    db.add(new_inv)
    db.commit()
    db.refresh(new_inv)
    return new_inv

@router.get("/frequencies", response_model=List[schemas.FeeFrequencyResponse])
def get_frequencies(db: Session = Depends(get_db)):
    return db.query(models.FeeFrequency).all()

@router.post("/frequencies", response_model=schemas.FeeFrequencyResponse)
def create_frequency(freq: schemas.FeeFrequencyCreate, db: Session = Depends(get_db)):
    db_freq = db.query(models.FeeFrequency).filter(models.FeeFrequency.name == freq.name).first()
    if db_freq:
        raise HTTPException(status_code=400, detail="Frequency already exists")
    new_freq = models.FeeFrequency(name=freq.name)
    db.add(new_freq)
    db.commit()
    db.refresh(new_freq)
    return new_freq

@router.delete("/frequencies/{freq_id}")
def delete_frequency(freq_id: int, db: Session = Depends(get_db)):
    db_freq = db.query(models.FeeFrequency).filter(models.FeeFrequency.id == freq_id).first()
    if not db_freq:
        raise HTTPException(status_code=404, detail="Frequency not found")
    db.delete(db_freq)
    db.commit()
    return {"ok": True}
