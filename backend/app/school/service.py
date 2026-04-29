from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func, text
from app.school.models import SchoolProfile, AcademicTerm, Teacher, SchoolSection, SchoolClass
from app.school.schemas import (
    SchoolProfileCreate, SchoolProfileUpdate, 
    AcademicTermCreate, AcademicTermUpdate,
    TeacherCreate, TeacherUpdate, SchoolClassCreate
)
from app.students.models import Student

def get_school_profile(db: Session):
    return db.query(SchoolProfile).first()

def create_school_profile(db: Session, data: SchoolProfileCreate):
    # Auto-fix: Ensure the database column can handle large images
    try:
        db.execute(text("ALTER TABLE school_profile MODIFY logo_url LONGTEXT"))
        db.commit()
    except Exception:
        db.rollback() # Ignore if already modified or not MySQL

    profile = SchoolProfile(**data.model_dump())
    db.add(profile)
    db.commit()
    db.refresh(profile)
    return profile

def update_school_profile(db: Session, data: SchoolProfileUpdate):
    # Auto-fix: Ensure the database column can handle large images
    try:
        db.execute(text("ALTER TABLE school_profile MODIFY logo_url LONGTEXT"))
        db.commit()
    except Exception:
        db.rollback() 

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
    db.query(AcademicTerm).update({"is_active": False})
    term = AcademicTerm(**data.model_dump())
    term.is_active = True
    db.add(term)
    db.commit()
    db.refresh(term)
    return term

def update_term(db: Session, term_id: int, data: AcademicTermUpdate):
    term = db.query(AcademicTerm).filter(AcademicTerm.id == term_id).first()
    if not term: return None
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
    section = db.query(SchoolSection).filter(func.lower(SchoolSection.name) == name.lower()).first()
    if not section:
        section = SchoolSection(name=name)
        db.add(section)
        db.flush()
    return section

def create_teacher(db: Session, data: TeacherCreate):
    section_names = data.section_names
    teacher_data = data.model_dump(exclude={"section_names"})
    teacher = Teacher(**teacher_data)
    for name in section_names:
        section = get_or_create_section(db, name)
        teacher.sections.append(section)
    db.add(teacher)
    db.commit()
    db.refresh(teacher)
    return teacher

def update_teacher(db: Session, teacher_id: int, data: TeacherUpdate):
    teacher = get_teacher(db, teacher_id)
    if not teacher: return None
    update_data = data.model_dump(exclude_unset=True, exclude={"section_names"})
    for field, value in update_data.items():
        setattr(teacher, field, value)
    if data.section_names is not None:
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

def get_sections(db: Session):
    return db.query(SchoolSection).all()

def get_classes_by_section(db: Session, section_name: str):
    section = db.query(SchoolSection).filter(func.lower(SchoolSection.name) == section_name.lower()).first()
    if not section:
        return []
    return section.classes

def create_class(db: Session, data: SchoolClassCreate):
    section = get_or_create_section(db, data.section_name)
    query = db.query(SchoolClass).filter(
        SchoolClass.section_id == section.id,
        func.lower(SchoolClass.class_name) == data.class_name.lower()
    )
    if data.section_identifier:
        query = query.filter(func.lower(SchoolClass.section_identifier) == data.section_identifier.lower())
    else:
        query = query.filter(SchoolClass.section_identifier == None)
    if query.first():
        ident = f" {data.section_identifier}" if data.section_identifier else ""
        raise HTTPException(status_code=400, detail=f"Class {data.class_name}{ident} already exists.")
    class_data = data.model_dump(exclude={"section_name"})
    class_data["section_id"] = section.id
    new_class = SchoolClass(**class_data)
    db.add(new_class)
    db.commit()
    db.refresh(new_class)
    return new_class

def get_teachers_by_section(db: Session, section_name: str):
    section = db.query(SchoolSection).filter(func.lower(SchoolSection.name) == section_name.lower()).first()
    if not section:
        return []
    return section.teachers

def delete_class(db: Session, class_id: int):
    cls = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if cls:
        db.delete(cls)
        db.commit()
    return cls

def update_class(db: Session, class_id: int, data: SchoolClassCreate):
    cls = db.query(SchoolClass).filter(SchoolClass.id == class_id).first()
    if not cls: return None
    section = get_or_create_section(db, data.section_name)
    query = db.query(SchoolClass).filter(
        SchoolClass.section_id == section.id,
        func.lower(SchoolClass.class_name) == data.class_name.lower(),
        SchoolClass.id != class_id
    )
    if data.section_identifier:
        query = query.filter(func.lower(SchoolClass.section_identifier) == data.section_identifier.lower())
    else:
        query = query.filter(SchoolClass.section_identifier == None)
    if query.first():
        raise HTTPException(status_code=400, detail="Another identical class configuration exists.")
    cls.section_id = section.id
    update_data = data.model_dump(exclude={"section_name"}, exclude_unset=True)
    for field, value in update_data.items():
        setattr(cls, field, value)
    db.commit()
    db.refresh(cls)
    return cls

def get_class_summaries(db: Session, section_name: str = None):
    # Get student grouping stats
    student_stats_query = db.query(
        Student.current_grade,
        Student.section_identifier,
        Student.academic_level,
        func.count(Student.id).label("student_count")
    ).group_by(Student.current_grade, Student.section_identifier, Student.academic_level)
    if section_name:
        student_stats_query = student_stats_query.filter(Student.academic_level == section_name)
    student_stats = student_stats_query.all()

    # Get configured classrooms
    class_query = db.query(
        SchoolClass.id,
        SchoolClass.class_name,
        SchoolClass.section_identifier,
        SchoolSection.name.label("section_name"),
        Teacher.full_name.label("teacher_name")
    ).join(SchoolSection, SchoolClass.section_id == SchoolSection.id)\
     .outerjoin(Teacher, SchoolClass.class_teacher_id == Teacher.id)
    if section_name:
        class_query = class_query.filter(SchoolSection.name == section_name)
    config_classes = class_query.all()

    summaries = []
    seen = set()
    for cc in config_classes:
        combo = (cc.class_name, cc.section_identifier)
        seen.add(combo)
        s_match = next((s for s in student_stats if s.current_grade == cc.class_name and s.section_identifier == cc.section_identifier), None)
        summaries.append({
            "id": cc.id, "class_name": cc.class_name, "section_identifier": cc.section_identifier,
            "section_name": cc.section_name, "teacher_name": cc.teacher_name,
            "student_count": s_match.student_count if s_match else 0
        })
    for ss in student_stats:
        if ss.section_identifier and (ss.current_grade, ss.section_identifier) not in seen:
            summaries.append({
                "id": None, "class_name": ss.current_grade, "section_identifier": ss.section_identifier,
                "section_name": ss.academic_level, "teacher_name": "Unassigned", "student_count": ss.student_count
            })
    return sorted(summaries, key=lambda x: (x["class_name"], x["section_identifier"] or ""))

def get_dashboard_stats(db: Session):
    # Counts
    school_count = db.query(SchoolProfile).count()
    teacher_count = db.query(Teacher).count()
    class_count = db.query(SchoolClass).count()
    section_count = db.query(SchoolSection).count()

    # Recent Schools
    recent_schools = db.query(SchoolProfile).order_by(SchoolProfile.created_at.desc()).limit(4).all()
    
    # Section Distribution for Chart
    section_data = db.query(
        SchoolSection.name,
        func.count(SchoolClass.id).label("class_count")
    ).join(SchoolClass).group_by(SchoolSection.name).all()

    # Academic Term Info
    term = get_active_term(db)
    
    return {
        "stats": {
            "total_schools": school_count,
            "total_teachers": teacher_count,
            "total_classes": class_count,
            "total_sections": section_count
        },
        "recent_schools": [
            {
                "id": s.id,
                "name": s.school_name,
                "principal": s.principal_name,
                "logo": s.logo_url,
                "reg": s.reg_number
            } for s in recent_schools
        ],
        "sections": [{"name": s.name, "count": s.class_count} for s in section_data],
        "term": {
            "year": term.academic_year if term else "N/A",
            "start": term.term_start_date if term else None,
            "end": term.term_end_date if term else None
        }
    }
