from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.authapp import routes as auth_routes
from app.school import routes as school_routes
from app.academics import routes as academics_routes
from app.timetable import routes as timetable_routes
from app.notices import routes as notice_routes
from app.students import routes as student_routes
from app.finance import routes as finance_routes

# NOTE: Do NOT use create_all() here.
# All database schema changes are managed by Alembic migrations.
# To apply changes: alembic upgrade head

app = FastAPI(title="Yokobine LLM API")


from app.core.config import settings

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(school_routes.router)
app.include_router(academics_routes.router)
app.include_router(timetable_routes.router)
app.include_router(notice_routes.router)
app.include_router(student_routes.router)
app.include_router(finance_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to Yokobine LLM API"}
