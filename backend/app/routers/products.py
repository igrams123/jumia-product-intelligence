from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from typing import List

from ..database import get_db
from ..models import Product
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

    products = (
        db.query(Product)
        .order_by(Product.id.desc())
        .all()
    )

    return products


# SEARCH PRODUCTS
@router.get(
    "/products/search",
    response_model=List[ProductResponse]
)
def search_products(
    keyword: str,
    db: Session = Depends(get_db)
):

    products = (
        db.query(Product)
        .filter(
            Product.name.ilike(f"%{keyword}%")
        )
        .order_by(Product.id.desc())
        .all()
    )

    return products


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

    products = (
        db.query(Product)
        .filter(Product.price >= min_price)
        .filter(Product.price <= max_price)
        .order_by(Product.price.asc())
        .all()
    )

    return products