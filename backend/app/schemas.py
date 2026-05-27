from pydantic import BaseModel

class ProductBase(BaseModel):
    name: str
    category: str | None = None
    brand: str | None = None
    price: float | None = None
    original_price: float | None = None
    discount: str | None = None
    rating: float | None = None
    reviews: int | None = None
    seller: str | None = None
    product_url: str | None = None
    image_url: str | None = None
    availability: str | None = None

class ProductCreate(ProductBase):
    pass

class ProductResponse(ProductBase):
    id: int

    class Config:
        from_attributes = True