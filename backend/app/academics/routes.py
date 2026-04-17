from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.academics import service
from app.academics.schemas import (
    SubjectConfigCreate, SubjectConfigResponse
)
from typing import List

router = APIRouter(prefix="/api/v1/academics", tags=["Academics"])

@router.get("/subjects/{segment}", response_model=List[SubjectConfigResponse])
def get_subjects(segment: str, db: Session = Depends(get_db)):
    return service.get_subjects_by_segment(db, segment)

@router.get("/all-subjects", response_model=List[str])
def get_all_subjects(db: Session = Depends(get_db)):
    """Get a flat list of all unique subjects defined in Subject Repository"""
    return service.get_all_distinct_subjects(db)

@router.get("/subjects-grouped")
def get_subjects_grouped(db: Session = Depends(get_db)):
    """Get subjects grouped by segment"""
    return service.get_subjects_grouped_by_segment(db)

@router.post("/subjects", response_model=SubjectConfigResponse, status_code=status.HTTP_201_CREATED)
def add_subject_config(data: SubjectConfigCreate, db: Session = Depends(get_db)):
    return service.create_subject_config(db, data)

@router.put("/subjects/{config_id}", response_model=SubjectConfigResponse)
def modify_subject_config(config_id: int, data: SubjectConfigCreate, db: Session = Depends(get_db)):
    updated = service.update_subject_config(db, config_id, data)
    if not updated:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return updated

@router.delete("/subjects/{config_id}")
def remove_subject_config(config_id: int, db: Session = Depends(get_db)):
    deleted = service.delete_subject_config(db, config_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return {"status": "success", "message": "Configuration removed"}
