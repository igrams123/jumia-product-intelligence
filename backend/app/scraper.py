import requests
from bs4 import BeautifulSoup
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import Product

BASE_URL = "https://www.jumia.co.ke/smartphones/?page={}"

# ALL KNOWN PHONE BRANDS
KNOWN_BRANDS = [
    "Samsung",
    "Apple",
    "iPhone",
    "Infinix",
    "Tecno",
    "Itel",
    "Xiaomi",
    "Redmi",
    "Poco",
    "Oppo",
    "Vivo",
    "Realme",
    "Huawei",
    "Honor",
    "Nokia",
    "Google",
    "Pixel",
    "OnePlus",
    "VGO",
    "VGO TEL",
    "Vpool",
    "Oking",
    "Modio",
    "Blackview",
    "Safaricom",
]

HEADERS = {
    "User-Agent": (
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
        "AppleWebKit/537.36 (KHTML, like Gecko) "
        "Chrome/124.0.0.0 Safari/537.36"
    )
}


# CLEAN PRICE
def clean_price(price_text):
    try:
        price = (
            price_text.replace("KSh", "")
            .replace(",", "")
            .strip()
        )

        return float(price)

    except:
        return 0.0


# CLEAN RATING
def clean_rating(rating_text):
    try:
        if not rating_text:
            return 0.0

        rating_text = rating_text.strip()

        if "No ratings" in rating_text:
            return 0.0

        number = rating_text.split(" ")[0]

        return float(number)

    except:
        return 0.0


# DETECT BRAND
def detect_brand(name):
    title_lower = name.lower()

    for brand in KNOWN_BRANDS:
        if brand.lower() in title_lower:
            return brand

    return "Unknown"


# SCRAPE MULTIPLE PAGES
def scrape_all_phones():

    db: Session = SessionLocal()

    total_saved = 0

    try:

        # SCRAPE MANY PAGES
        for page in range(1, 21):

            url = BASE_URL.format(page)

            print("=" * 80)
            print(f"SCRAPING PAGE {page}")
            print(url)

            response = requests.get(
                url,
                headers=HEADERS
            )

            print("STATUS:", response.status_code)

            if response.status_code != 200:
                print("FAILED PAGE")
                continue

            soup = BeautifulSoup(
                response.text,
                "html.parser"
            )

            products = soup.find_all(
                "article",
                class_="prd"
            )

            print(f"Found {len(products)} products")

            # LOOP PRODUCTS
            for item in products:

                try:

                    # NAME
                    name_tag = item.find(
                        "h3",
                        class_="name"
                    )

                    name = (
                        name_tag.text.strip()
                        if name_tag
                        else "No Name"
                    )

                    # PRODUCT URL
                    link_tag = item.find("a")

                    product_url = (
                        "https://www.jumia.co.ke"
                        + link_tag["href"]
                        if link_tag and link_tag.get("href")
                        else ""
                    )

                    # IMAGE
                    image_tag = item.find("img")

                    image_url = ""

                    if image_tag:

                        image_url = (
                            image_tag.get("data-src")
                            or image_tag.get("src")
                            or ""
                        )

                    # PRICE
                    price_tag = item.find(
                        "div",
                        class_="prc"
                    )

                    price = clean_price(
                        price_tag.text
                    ) if price_tag else 0.0

                    # OLD PRICE
                    old_price_tag = item.find(
                        "div",
                        class_="old"
                    )

                    original_price = (
                        clean_price(old_price_tag.text)
                        if old_price_tag
                        else 0.0
                    )

                    # DISCOUNT
                    discount_tag = item.find(
                        "div",
                        class_="bdg _dsct"
                    )

                    discount = (
                        discount_tag.text.strip()
                        if discount_tag
                        else "0%"
                    )

                    # RATING
                    rating_tag = item.find(
                        "div",
                        class_="stars _s"
                    )

                    rating = clean_rating(
                        rating_tag.text
                    ) if rating_tag else 0.0

                    # REVIEWS
                    reviews = 0

                    # BRAND
                    brand = detect_brand(name)

                    # CATEGORY
                    category = "Smartphones"

                    # SELLER
                    seller = "Jumia"

                    # AVAILABILITY
                    availability = "In Stock"

                    # CHECK IF EXISTS
                    existing = db.query(Product).filter(
                        Product.product_url == product_url
                    ).first()

                    # UPDATE EXISTING PRODUCT
                    if existing:

                        existing.name = name
                        existing.brand = brand
                        existing.price = price
                        existing.original_price = original_price
                        existing.discount = discount
                        existing.rating = rating
                        existing.image_url = image_url
                        existing.availability = availability

                        print(f"UPDATED: {name}")

                    else:

                        new_product = Product(
                            name=name,
                            category=category,
                            brand=brand,
                            price=price,
                            original_price=original_price,
                            discount=discount,
                            rating=rating,
                            reviews=reviews,
                            seller=seller,
                            product_url=product_url,
                            image_url=image_url,
                            availability=availability,
                        )

                        db.add(new_product)

                        print(f"SAVED: {name}")

                    total_saved += 1

                except Exception as e:
                    print("PRODUCT ERROR:", e)

            # SAVE EACH PAGE
            db.commit()

        print("=" * 80)
        print("SCRAPING COMPLETED")
        print(f"TOTAL PRODUCTS PROCESSED: {total_saved}")

    except Exception as e:
        print("SCRAPER ERROR:", e)

    finally:
        db.close()


# RUN SCRAPER
if __name__ == "__main__":
    scrape_all_phones()