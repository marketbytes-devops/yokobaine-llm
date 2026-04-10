from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.authapp import routes as auth_routes
from app.school import routes as school_routes

# NOTE: Do NOT use create_all() here.
# All database schema changes are managed by Alembic migrations.
# To apply changes: alembic upgrade head

app = FastAPI(title="Yokobine LLM API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)
app.include_router(school_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to Yokobine LLM API"}
