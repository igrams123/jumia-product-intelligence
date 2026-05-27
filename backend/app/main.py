from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from apscheduler.schedulers.background import BackgroundScheduler

from sqlalchemy import text

from .database import engine, SessionLocal
from .models import Base
from .routers import products
from .scraper import scrape_all_phones

# CREATE TABLES
Base.metadata.create_all(bind=engine)

# CREATE APP
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

# DATABASE CHECK
@app.get("/db-check")
def db_check():

    db = SessionLocal()

    try:

        result = db.execute(
            text("SELECT COUNT(*) FROM products")
        )

        count = result.scalar()

        return {
            "products_in_db": count
        }

    finally:
        db.close()


# HOME
@app.get("/")
def home():
    return {
        "message": "Jumia Product Intelligence API Running"
    }


# START SCHEDULER ONLY AFTER STARTUP
@app.on_event("startup")
def start_scheduler():

    scheduler = BackgroundScheduler()

    scheduler.add_job(
        scrape_all_phones,
        "interval",
        hours=1,
        max_instances=1
    )

    scheduler.start()

    print("=" * 60)
    print("SCHEDULER STARTED")
    print("=" * 60)