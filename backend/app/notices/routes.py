from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.core.database import SessionLocal
from . import schemas, service

router = APIRouter(prefix="/api/notices", tags=["Notices"])

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.post("/", response_model=schemas.NoticeResponse)
def create_new_notice(notice: schemas.NoticeCreate, db: Session = Depends(get_db)):
    
    return service.create_notice(db=db, notice=notice, user_id=1)

@router.get("/", response_model=List[schemas.NoticeResponse])
def read_notices(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return service.get_notices(db, skip=skip, limit=limit)

@router.get("/{notice_id}", response_model=schemas.NoticeResponse)
def read_notice(notice_id: int, db: Session = Depends(get_db)):
    db_notice = service.get_notice(db, notice_id=notice_id)
    if db_notice is None:
        raise HTTPException(status_code=404, detail="Notice not found")
    return db_notice

@router.patch("/{notice_id}", response_model=schemas.NoticeResponse)
def update_existing_notice(notice_id: int, notice_update: schemas.NoticeUpdate, db: Session = Depends(get_db)):
    db_notice = service.update_notice(db, notice_id=notice_id, notice_update=notice_update)
    if db_notice is None:
        raise HTTPException(status_code=404, detail="Notice not found")
    return db_notice

@router.delete("/{notice_id}")
def delete_existing_notice(notice_id: int, db: Session = Depends(get_db)):
    success = service.delete_notice(db, notice_id=notice_id)
    if not success:
        raise HTTPException(status_code=404, detail="Notice not found")
    return {"message": "Notice deleted successfully"}
