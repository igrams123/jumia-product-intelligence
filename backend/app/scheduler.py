from apscheduler.schedulers.blocking import BlockingScheduler
from app.scraper import scrape_all_phones

scheduler = BlockingScheduler()

# SCRAPE EVERY 1 HOUR
scheduler.add_job(
    scrape_all_phones,
    "interval",
    hours=1
)

print("=" * 60)
print("AUTO SCRAPER STARTED")
print("SCRAPING EVERY 1 HOUR")
print("=" * 60)

scheduler.start()