from sqlalchemy.orm import Session
from . import models, schemas

# Create product
def create_product(db: Session, product: schemas.ProductCreate):
    db_product = models.Product(**product.dict())

    db.add(db_product)
    db.commit()
    db.refresh(db_product)

    return db_product

# Get all products
def get_products(db: Session):
    return db.query(models.Product).all()