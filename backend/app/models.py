from sqlalchemy import Column, Integer, String, Float
from .database import Base

class Product(Base):
    __tablename__ = "products"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String, nullable=False)
    category = Column(String)
    brand = Column(String)

    price = Column(Float)
    original_price = Column(Float)

    discount = Column(String)

    rating = Column(Float)
    reviews = Column(Integer)

    seller = Column(String)

    product_url = Column(String)
    image_url = Column(String)

    availability = Column(String)