from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.academics.models import SubjectConfiguration
from app.academics.schemas import SubjectConfigCreate

def get_subjects_by_segment(db: Session, segment: str):
    return db.query(SubjectConfiguration).filter(SubjectConfiguration.segment == segment).all()

def create_subject_config(db: Session, data: SubjectConfigCreate):
    existing = db.query(SubjectConfiguration).filter(SubjectConfiguration.target_class == data.target_class).first()
    if existing:
        raise HTTPException(status_code=400, detail=f"Configuration for {data.target_class} already exists. Please edit the existing one.")
        
    config = SubjectConfiguration(**data.model_dump())
    db.add(config)
    db.commit()
    db.refresh(config)
    return config

def update_subject_config(db: Session, config_id: int, data: SubjectConfigCreate):
    config = db.query(SubjectConfiguration).filter(SubjectConfiguration.id == config_id).first()
    if not config:
        return None
        
    for key, value in data.model_dump().items():
        setattr(config, key, value)
        
    db.commit()
    db.refresh(config)
    return config

def delete_subject_config(db: Session, config_id: int):
    config = db.query(SubjectConfiguration).filter(SubjectConfiguration.id == config_id).first()
    if config:
        db.delete(config)
        db.commit()
    return config

def get_all_distinct_subjects(db: Session):
    configs = db.query(SubjectConfiguration).all()
    all_subjects = set()
    for c in configs:
        # c.subjects is a list of strings stored as JSON
        for s in c.subjects:
            if s:
                all_subjects.add(s)
    return sorted(list(all_subjects))
