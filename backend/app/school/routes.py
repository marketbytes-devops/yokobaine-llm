from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.school import service
from app.school.schemas import (
    SchoolProfileCreate, SchoolProfileUpdate, SchoolProfileResponse,
    AcademicTermCreate, AcademicTermUpdate, AcademicTermResponse,
    TeacherCreate, TeacherUpdate, TeacherResponse,
    SchoolSectionResponse, SchoolClassCreate, SchoolClassResponse
)
from typing import List

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


# --- TEACHER ENDPOINTS ---

@router.get("/teachers", response_model=List[TeacherResponse])
def list_teachers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_teachers(db, skip=skip, limit=limit)

@router.get("/teachers/{teacher_id}", response_model=TeacherResponse)
def get_teacher_by_id(teacher_id: int, db: Session = Depends(get_db)):
    teacher = service.get_teacher(db, teacher_id)
    if not teacher:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return teacher

@router.post("/teachers", response_model=TeacherResponse, status_code=status.HTTP_201_CREATED)
def register_teacher(data: TeacherCreate, db: Session = Depends(get_db)):
    return service.create_teacher(db, data)

@router.put("/teachers/{teacher_id}", response_model=TeacherResponse)
@router.patch("/teachers/{teacher_id}", response_model=TeacherResponse)
def update_teacher_profile(teacher_id: int, data: TeacherUpdate, db: Session = Depends(get_db)):
    updated = service.update_teacher(db, teacher_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return updated

@router.delete("/teachers/{teacher_id}")
def remove_teacher(teacher_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_teacher(db, teacher_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Teacher not found")
    return {"status": "success", "message": "Teacher removed"}


# --- SCHOOL STRUCTURE ENDPOINTS ---

@router.get("/sections", response_model=List[SchoolSectionResponse])
def list_sections(db: Session = Depends(get_db)):
    """Get all school sections (Kindergarten, LP, UP, etc.)"""
    return service.get_sections(db)

@router.get("/sections/{section_name}/teachers", response_model=List[TeacherResponse])
def list_teachers_by_section(section_name: str, db: Session = Depends(get_db)):
    """Get list of teachers belonging to a specific section"""
    return service.get_teachers_by_section(db, section_name)

@router.get("/sections/{section_name}/classes", response_model=List[SchoolClassResponse])
def list_classes_by_section(section_name: str, db: Session = Depends(get_db)):
    """Get list of classes belonging to a specific section (e.g. classes in LP)"""
    return service.get_classes_by_section(db, section_name)

@router.post("/classes", response_model=SchoolClassResponse, status_code=status.HTTP_201_CREATED)
def add_class(data: SchoolClassCreate, db: Session = Depends(get_db)):
    """Create a new class within a section"""
    return service.create_class(db, data)

@router.delete("/classes/{class_id}")
def remove_class(class_id: int, db: Session = Depends(get_db)):
    """Delete a school class"""
    # I need to add this to service as well
    deleted = service.delete_class(db, class_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Class not found")
    return {"status": "success", "message": "Class removed"}

@router.put("/classes/{class_id}", response_model=SchoolClassResponse)
def update_class_config(class_id: int, data: SchoolClassCreate, db: Session = Depends(get_db)):
    """Update a class configuration"""
    updated = service.update_class(db, class_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Class not found")
    return updated
