from sqlalchemy.orm import Session
from . import models, schemas

def create_student(db: Session, student_in: schemas.StudentCreate):
    # 1. Create Student record
    student_data = student_in.model_dump(exclude={"guardian", "class_teacher_id"})
    db_student = models.Student(**student_data)
    db.add(db_student)
    db.flush() 
    
    # 2. Create Guardian record and link to Student
    guardian_data = student_in.guardian.model_dump()
    db_guardian = models.Guardian(**guardian_data, student_id=db_student.id)
    db.add(db_guardian)

    # 3. Handle Classroom/Teacher sync
    if student_in.class_teacher_id:
        try:
            from app.school.models import SchoolClass
            from app.school.service import get_or_create_section
            section = get_or_create_section(db, db_student.academic_level)
            
            existing_cls = db.query(SchoolClass).filter(
                SchoolClass.section_id == section.id,
                SchoolClass.class_name == db_student.current_grade,
                SchoolClass.section_identifier == db_student.section_identifier
            ).first()
            
            if existing_cls:
                existing_cls.class_teacher_id = student_in.class_teacher_id
            else:
                new_cls = SchoolClass(
                    class_name=db_student.current_grade,
                    section_identifier=db_student.section_identifier,
                    section_id=section.id,
                    class_teacher_id=student_in.class_teacher_id,
                    capacity=40,
                    room_number="TBD"
                )
                db.add(new_cls)
        except Exception as e:
            print(f"Non-critical error syncing classroom: {e}")
    
    db.commit()
    db.refresh(db_student)
    return db_student

def get_students(db: Session, grade: str = None, section: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Student)
    if grade:
        query = query.filter(models.Student.current_grade == grade)
    if section:
        query = query.filter(models.Student.section_identifier == section)
    return query.offset(skip).limit(limit).all()

def get_student_by_admission(db: Session, admission_id: str):
    return db.query(models.Student).filter(models.Student.admission_id == admission_id).first()

def update_student(db: Session, student_id: int, student_in: schemas.StudentCreate):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if not db_student:
        return None
    
    # Update Student fields
    student_data = student_in.model_dump(exclude={"guardian", "class_teacher_id"})
    for key, value in student_data.items():
        setattr(db_student, key, value)
    
    # Update Guardian fields
    if student_in.guardian and db_student.guardian:
        guardian_data = student_in.guardian.model_dump()
        for key, value in guardian_data.items():
            setattr(db_student.guardian, key, value)
            
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int):
    db_student = db.query(models.Student).filter(models.Student.id == student_id).first()
    if db_student:
        db.delete(db_student)
        db.commit()
    return db_student
