from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import get_db
from app.timetable import service, schemas

router = APIRouter(prefix="/api/v1/timetable", tags=["Timetable Builder"])

@router.post("/config", response_model=schemas.TimetableConfigResponse)
def save_config(data: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    return service.create_config(db, data)

@router.get("/config", response_model=List[schemas.TimetableConfigResponse])
def list_configs(db: Session = Depends(get_db)):
    return service.get_configs(db)

@router.post("/workload", response_model=schemas.WorkloadResponse)
def add_workload_mapping(data: schemas.WorkloadCreate, db: Session = Depends(get_db)):
    return service.create_workload(db, data)

@router.get("/workload/{class_id}", response_model=List[schemas.WorkloadResponse])
def get_class_workloads(class_id: int, db: Session = Depends(get_db)):
    return service.get_workloads_by_class(db, class_id)

@router.post("/generate")
def generate_timetable(request: schemas.TimetableGenerateRequest, db: Session = Depends(get_db)):
    """Triggers the Backtracking Algorithm to generate a perfect schedule"""
    result = service.generate_timetable(db, request)
    if result.get("status") == "error":
        raise HTTPException(status_code=400, detail=result["message"])
    return result
