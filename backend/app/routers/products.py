from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import text

from typing import List

from ..database import get_db
from ..schemas import ProductResponse

router = APIRouter(
    tags=["Products"]
)

# GET ALL PRODUCTS
@router.get(
    "/products",
    response_model=List[ProductResponse]
)
def get_products(
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("SELECT * FROM products")
    )

    products = result.fetchall()

    return [
        dict(row._mapping)
        for row in products
    ]


# SEARCH PRODUCTS
@router.get(
    "/products/search",
    response_model=List[ProductResponse]
)
def search_products(
    keyword: str,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT * FROM products
            WHERE LOWER(name) LIKE LOWER(:keyword)
        """),
        {
            "keyword": f"%{keyword}%"
        }
    )

    products = result.fetchall()

    return [
        dict(row._mapping)
        for row in products
    ]


# FILTER PRODUCTS
@router.get(
    "/products/filter",
    response_model=List[ProductResponse]
)
def filter_products(
    min_price: float = 0,
    max_price: float = 1000000,
    db: Session = Depends(get_db)
):

    result = db.execute(
        text("""
            SELECT * FROM products
            WHERE price >= :min_price
            AND price <= :max_price
        """),
        {
            "min_price": min_price,
            "max_price": max_price
        }
    )

    products = result.fetchall()

    return [
        dict(row._mapping)
        for row in products
    ]