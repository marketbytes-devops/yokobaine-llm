from sqlalchemy.orm import Session
from app.school.models import SchoolProfile, AcademicTerm
from app.school.schemas import SchoolProfileCreate, SchoolProfileUpdate, AcademicTermCreate, AcademicTermUpdate

def get_school_profile(db: Session):
    return db.query(SchoolProfile).filter(SchoolProfile.is_active == True).first()

def create_school_profile(db: Session, data: SchoolProfileCreate):
    profile = SchoolProfile(**data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

def update_school_profile(db: Session, data: SchoolProfileUpdate):
    profile = get_school_profile(db)
    if not profile:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    db.commit()
    db.refresh(profile)
    return profile

def get_active_term(db: Session):
    return db.query(AcademicTerm).filter(AcademicTerm.is_active == True).first()

def create_term(db: Session, data: AcademicTermCreate):
    term = AcademicTerm(**data.model_dump())
    db.add(term)
    db.commit()
    db.refresh(term)
    return term

def update_term(db: Session, term_id: int, data: AcademicTermUpdate):
    term = db.query(AcademicTerm).filter(AcademicTerm.id == term_id).first()
    if not term:
        return None
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(term, field, value)
    db.commit()
    db.refresh(term)
    return term
