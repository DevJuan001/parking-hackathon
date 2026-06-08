from typing import Optional
from pydantic import BaseModel


class SpotsFiltersSchema(BaseModel):
    spot_status: Optional[int] = None


class CreateSpotSchema(BaseModel):
    spot: str


class UpdateSpotStatusSchema(BaseModel):
    spot_status: int
