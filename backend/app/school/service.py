from sqlalchemy.orm import Session
from app.school.models import SchoolProfile, AcademicTerm, Teacher, SchoolSection
from app.school.schemas import (
    SchoolProfileCreate, SchoolProfileUpdate, 
    AcademicTermCreate, AcademicTermUpdate,
    TeacherCreate, TeacherUpdate
)

def get_school_profile(db: Session):
    return db.query(SchoolProfile).first()

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
        
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(profile, field, value)
        
    db.commit()
    db.refresh(profile)
    return profile

def get_active_term(db: Session):
    return db.query(AcademicTerm).filter(AcademicTerm.is_active == True).order_by(AcademicTerm.id.desc()).first()

def create_term(db: Session, data: AcademicTermCreate):
    # Deactivate existing active terms before creating new one
    db.query(AcademicTerm).update({"is_active": False})
    
    term = AcademicTerm(**data.model_dump())
    term.is_active = True
    db.add(term)
    db.commit()
    db.refresh(term)
    return term

def update_term(db: Session, term_id: int, data: AcademicTermUpdate):
    term = db.query(AcademicTerm).filter(AcademicTerm.id == term_id).first()
    if not term:
        return None
    
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(term, field, value)
        
    db.commit()
    db.refresh(term)
    return term

def get_teachers(db: Session, skip: int = 0, limit: int = 100):
    return db.query(Teacher).offset(skip).limit(limit).all()

def get_teacher(db: Session, teacher_id: int):
    return db.query(Teacher).filter(Teacher.id == teacher_id).first()

def get_or_create_section(db: Session, name: str):
    section = db.query(SchoolSection).filter(SchoolSection.name == name).first()
    if not section:
        section = SchoolSection(name=name)
        db.add(section)
        db.flush() # Get ID without committing
    return section

def create_teacher(db: Session, data: TeacherCreate):
    # Extract section names and subjects
    section_names = data.section_names
    # Create teacher obj
    teacher_data = data.model_dump(exclude={"section_names"})
    teacher = Teacher(**teacher_data)
    
    # Associate sections
    for name in section_names:
        section = get_or_create_section(db, name)
        teacher.sections.append(section)
    
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

def update_teacher(db: Session, teacher_id: int, data: TeacherUpdate):
    teacher = get_teacher(db, teacher_id)
    if not teacher:
        return None
    
    update_data = data.model_dump(exclude_unset=True, exclude={"section_names"})
    for field, value in update_data.items():
        setattr(teacher, field, value)
    
    if data.section_names is not None:
        # Clear existing and re-add
        teacher.sections = []
        for name in data.section_names:
            section = get_or_create_section(db, name)
            teacher.sections.append(section)
            
    db.commit()
    db.refresh(teacher)
    return teacher

def delete_teacher(db: Session, teacher_id: int):
    teacher = get_teacher(db, teacher_id)
    if teacher:
        db.delete(teacher)
        db.commit()
    return teacher
