from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core import database
from app.authapp import routes as auth_routes


database.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Yokobine LLM API")


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_routes.router)

@app.get("/")
def root():
    return {"message": "Welcome to Yokobine LLM API"}
