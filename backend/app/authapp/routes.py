from fastapi import APIRouter, Depends, BackgroundTasks
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.authapp import schemas, service
from app.core import database

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication & Roles"]
)

# --- Role Management ---
@router.post("/roles", response_model=schemas.Role)
def create_role(role: schemas.RoleCreate, db: Session = Depends(database.get_db)):
    return service.create_role(db, role)

@router.get("/roles", response_model=list[schemas.Role])
def get_roles(db: Session = Depends(database.get_db)):
    return service.get_roles(db)

# --- User Management ---
@router.post("/register", response_model=schemas.UserResponse)
def register(user: schemas.UserCreate, db: Session = Depends(database.get_db)):
    return service.create_user(db, user)

@router.post("/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(database.get_db)):
    return service.authenticate_user(db, form_data.username, form_data.password)

@router.post("/forgot-password")
def forgot_password(request: schemas.ForgotPasswordRequest, background_tasks: BackgroundTasks, db: Session = Depends(database.get_db)):
    return service.process_forgot_password(db, request.email, background_tasks)

@router.post("/reset-password")
def reset_password(request: schemas.ResetPasswordRequest, db: Session = Depends(database.get_db)):
    return service.process_reset_password(db, request.email, request.token, request.new_password)
