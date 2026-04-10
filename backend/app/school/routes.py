from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.school import service
from app.school.schemas import (
    SchoolProfileCreate, SchoolProfileUpdate, SchoolProfileResponse,
    AcademicTermCreate, AcademicTermUpdate, AcademicTermResponse
)

router = APIRouter(prefix="/api/v1/school", tags=["School"])

@router.get("/profile", response_model=SchoolProfileResponse)
def get_profile(db: Session = Depends(get_db)):
    profile = service.get_school_profile(db)
    if not profile:
        raise HTTPException(status_code=404, detail="School profile not found")
    return profile

@router.post("/profile", response_model=SchoolProfileResponse, status_code=status.HTTP_201_CREATED)
def create_profile(data: SchoolProfileCreate, db: Session = Depends(get_db)):
    existing = service.get_school_profile(db)
    if existing:
        raise HTTPException(status_code=400, detail="Already exists")
    return service.create_school_profile(db, data)

@router.put("/profile", response_model=SchoolProfileResponse)
def update_profile(data: SchoolProfileUpdate, db: Session = Depends(get_db)):
    updated = service.update_school_profile(db, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Not found")
    return updated

@router.get("/term", response_model=AcademicTermResponse)
def get_current_term(db: Session = Depends(get_db)):
    term = service.get_active_term(db)
    if not term:
        raise HTTPException(status_code=404, detail="No active term found")
    return term

@router.post("/term", response_model=AcademicTermResponse, status_code=status.HTTP_201_CREATED)
def create_new_term(data: AcademicTermCreate, db: Session = Depends(get_db)):
    return service.create_term(db, data)

@router.put("/term/{term_id}", response_model=AcademicTermResponse)
def update_existing_term(term_id: int, data: AcademicTermUpdate, db: Session = Depends(get_db)):
    updated = service.update_term(db, term_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Term not found")
    return updated
