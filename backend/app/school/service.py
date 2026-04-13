from sqlalchemy.orm import Session
from app.school.models import SchoolProfile, AcademicTerm, Teacher, SchoolSection
from app.school.schemas import (
    SchoolProfileCreate, SchoolProfileUpdate, 
    AcademicTermCreate, AcademicTermUpdate,
    TeacherCreate, TeacherUpdate
)

# ... School Profile and Term services ... (skipping for brevity but keeping original)

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
