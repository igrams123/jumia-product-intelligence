from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import engine
from .models import Base
from .routers import products
import os


@app.get("/db-check")
def db_check():
    return {
        "database_url": os.getenv("DATABASE_URL")
    }
# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jumia Product Intelligence API"
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ROUTES
app.include_router(products.router)

@app.get("/")
def home():
    return {
        "message": "Jumia Product Intelligence API Running"
    }