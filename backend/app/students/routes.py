from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from app.core.database import SessionLocal
from . import schemas, service

router = APIRouter(prefix="/api/students", tags=["Students"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.StudentResponse)
def enroll_student(student_in: schemas.StudentCreate, db: Session = Depends(get_db)):
    # Check if admission ID already exists
    existing = service.get_student_by_admission(db, admission_id=student_in.admission_id)
    if existing:
        raise HTTPException(status_code=400, detail="Admission ID already registered")
    
    return service.create_student(db=db, student_in=student_in)

@router.get("/", response_model=List[schemas.StudentResponse])
def list_students(
    grade: Optional[str] = None, 
    section: Optional[str] = None, 
    skip: int = 0, 
    limit: int = 100, 
    db: Session = Depends(get_db)
):
    return service.get_students(db, grade=grade, section=section, skip=skip, limit=limit)

@router.put("/{student_id}", response_model=schemas.StudentResponse)
def update_student_record(student_id: int, data: schemas.StudentCreate, db: Session = Depends(get_db)):
    updated = service.update_student(db, student_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated

@router.delete("/{student_id}")
def delete_student_record(student_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_student(db, student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return {"status": "success", "message": "Record removed"}
