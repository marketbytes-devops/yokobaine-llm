from typing import Any, List
from sqlalchemy.orm import Session
from app.timetable import models, schemas
from app.school.models import SchoolClass, Teacher, SchoolSection
from app.academics.models import SubjectConfiguration
from app.timetable.algorithm import TimetableGenerator

def create_config(db: Session, data: schemas.TimetableConfigCreate):
    db_config = models.TimetableConfig(**data.model_dump())
    db.add(db_config)
    db.commit()
    db.refresh(db_config)
    return db_config

def get_configs(db: Session):
    return db.query(models.TimetableConfig).order_by(models.TimetableConfig.created_at.desc()).all()

def create_workload(db: Session, data: schemas.WorkloadCreate):
    db_workload = models.ClassWorkload(**data.model_dump())
    db.add(db_workload)
    db.commit()
    db.refresh(db_workload)
    return db_workload

def get_workloads_by_class(db: Session, class_id: int):
    return db.query(models.ClassWorkload).filter(models.ClassWorkload.class_id == class_id).all()

def generate_timetable(db: Session, request: schemas.TimetableGenerateRequest):
    # 1. Fetch Latest Config for this Level/Stream
    config = db.query(models.TimetableConfig).filter(
        models.TimetableConfig.level == request.level,
        models.TimetableConfig.is_active == True
    )
    if request.stream:
        config = config.filter(models.TimetableConfig.stream == request.stream)
    
    config = config.order_by(models.TimetableConfig.created_at.desc()).first()
    
    if not config:
        return {"status": "error", "message": "No active configuration found for this level"}

    # 2. Get Section ID
    section = db.query(SchoolSection).filter(SchoolSection.name == request.level).first()
    if not section:
        return {"status": "error", "message": f"Section {request.level} not found"}

    # 3. Fetch all classes for this section
    classes_query = db.query(SchoolClass).filter(SchoolClass.section_id == section.id)
    if request.stream:
        classes_query = classes_query.filter(SchoolClass.stream == request.stream)
    
    # If specific class_ids are provided, filter further
    if request.class_ids:
        classes_query = classes_query.filter(SchoolClass.id.in_(request.class_ids))
    
    classes = classes_query.all()
    class_ids = [c.id for c in classes]
    
    if not class_ids:
        return {"status": "error", "message": "No classes found for this criteria"}

    # 4. Fetch all workloads for these classes
    workloads = db.query(models.ClassWorkload).filter(models.ClassWorkload.class_id.in_(class_ids)).all()
    
    if not workloads:
        return {"status": "error", "message": "No workloads defined for these classes"}

    # 5. Extract additional constraints
    # - Class Teachers
    class_teachers = {c.id: c.class_teacher_id for c in classes if c.class_teacher_id}
    
    # - Teacher Constraints & Names
    teachers = db.query(Teacher).all()
    teacher_map = {t.id: t.full_name for t in teachers}
    teacher_constraints = {t.id: t.constraints for t in teachers if t.constraints}

    workload_data = [
        {
            "class_id": w.class_id,
            "subject_name": w.subject_name,
            "teacher_id": w.teacher_id,
            "teacher_name": teacher_map.get(w.teacher_id, "Unknown"),
            "periods_per_week": w.periods_per_week,
            "is_double": w.is_double
        } for w in workloads
    ]
    
    # 6. Run Algorithm
    generator = TimetableGenerator(
        days=config.days,
        periods=config.periods,
        workloads=workload_data,
        drill_periods=config.drill_periods,
        fixed_slots=config.fixed_slots or [],
        class_teachers=class_teachers,
        teacher_constraints=teacher_constraints,
        class_ids=class_ids
    )

    
    solution_grid = generator.generate()
    
    if solution_grid:
        # Fill empty slots with assigned subjects to satisfy "Fully Fill" requirement without "Self Study"
        for cid in solution_grid:
            class_subjects = [w for w in workload_data if w['class_id'] == cid]
            subject_cycle = 0
            
            for day in config.days:
                for p in range(config.periods):
                    if solution_grid[cid][day][p] is None:
                        if class_subjects:
                            sub = class_subjects[subject_cycle % len(class_subjects)]
                            solution_grid[cid][day][p] = {
                                "subject": sub['subject_name'],
                                "teacher_id": sub['teacher_id'],
                                "teacher_name": sub['teacher_name']
                            }
                            subject_cycle += 1
                        else:
                            # Fallback if no subjects at all are defined for this class
                            solution_grid[cid][day][p] = {
                                "subject": "Library/Free",
                                "teacher_id": -1,
                                "teacher_name": "N/A"
                            }

        # Save solution to DB (One record per class)
        # First clear old solutions for these classes
        db.query(models.TimetableSolution).filter(models.TimetableSolution.class_id.in_(class_ids)).delete(synchronize_session=False)

        for cid, grid in solution_grid.items():
            db_solution = models.TimetableSolution(
                class_id=cid,
                term_id=request.term_id,
                grid_data=grid,
                is_active=True
            )
            db.add(db_solution)
        
        db.commit()
        
        # Format response for frontend consumption
        # Include class metadata and solution IDs
        response_data = {}
        for c in classes:
            # Find the solution object we just created
            sol = next((s for s in db.query(models.TimetableSolution).filter(models.TimetableSolution.class_id == c.id).all()), None)
            response_data[f"{c.class_name} {c.section_identifier}"] = {
                "id": sol.id if sol else None,
                "grid": solution_grid.get(c.id)
            }

        return {"status": "success", "timetable": response_data}
    
    return {"status": "error", "message": "No conflict-free solution found. Try reducing complexity or adding more periods."}

def update_solution_grid(db: Session, solution_id: int, grid_data: Any):
    solution = db.query(models.TimetableSolution).filter(models.TimetableSolution.id == solution_id).first()
    if not solution:
        return None
    
    solution.grid_data = grid_data
    db.commit()
    db.refresh(solution)
    return solution
