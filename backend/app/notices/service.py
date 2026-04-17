from sqlalchemy.orm import Session
from . import models, schemas

def create_notice(db: Session, notice: schemas.NoticeCreate, user_id: int):
    db_notice = models.Notice(
        **notice.model_dump(),
        posted_by_id=user_id
    )
    db.add(db_notice)
    db.commit()
    db.refresh(db_notice)
    return db_notice

def get_notices(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.Notice).order_by(models.Notice.is_pinned.desc(), models.Notice.created_at.desc()).offset(skip).limit(limit).all()

def get_notice(db: Session, notice_id: int):
    return db.query(models.Notice).filter(models.Notice.id == notice_id).first()

def update_notice(db: Session, notice_id: int, notice_update: schemas.NoticeUpdate):
    db_notice = get_notice(db, notice_id)
    if not db_notice:
        return None
    
    update_data = notice_update.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(db_notice, key, value)
    
    db.commit()
    db.refresh(db_notice)
    return db_notice

def delete_notice(db: Session, notice_id: int):
    db_notice = get_notice(db, notice_id)
    if db_notice:
        db.delete(db_notice)
        db.commit()
        return True
    return False
