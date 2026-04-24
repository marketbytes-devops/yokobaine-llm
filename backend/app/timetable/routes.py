from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Any
from app.core.database import get_db
from app.timetable import service, schemas

router = APIRouter(prefix="/api/v1/timetable", tags=["Timetable Builder"])

@router.post("/config", response_model=schemas.TimetableConfigResponse)
def save_config(data: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    return service.create_config(db, data)

@router.get("/config", response_model=List[schemas.TimetableConfigResponse])
def list_configs(db: Session = Depends(get_db)):
    return service.get_configs(db)

@router.put("/config/{config_id}", response_model=schemas.TimetableConfigResponse)
def update_config(config_id: int, data: schemas.TimetableConfigCreate, db: Session = Depends(get_db)):
    return service.update_config(db, config_id, data)

@router.delete("/config/{config_id}")
def delete_config(config_id: int, db: Session = Depends(get_db)):
    success = service.delete_config(db, config_id)
    if not success:
        raise HTTPException(status_code=404, detail="Configuration not found")
    return {"status": "success", "message": "Configuration deleted"}

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

@router.patch("/solution/{solution_id}")
def update_manual_timetable(solution_id: int, grid_data: Any, db: Session = Depends(get_db)):
    """Allows manual editing of a generated solution"""
    updated = service.update_solution_grid(db, solution_id, grid_data)
    if not updated:
        raise HTTPException(status_code=404, detail="Solution not found")
    return {"status": "success", "message": "Timetable updated manually"}
