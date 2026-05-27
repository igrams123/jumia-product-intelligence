from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.background import BackgroundScheduler

from .database import engine
from .models import Base
from .routers import products
from .scraper import scrape_all_phones

# CREATE TABLES
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Jumia Product Intelligence API"
)

# START SCHEDULER
scheduler = BackgroundScheduler()

scheduler.add_job(
    scrape_all_phones,
    "interval",
    hours=1
)

scheduler.start()

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