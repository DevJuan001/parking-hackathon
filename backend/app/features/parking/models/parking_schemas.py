from typing import Optional
from pydantic import BaseModel


class CreatePlateSchema(BaseModel):
    plate: str
    vehicle_type: str = ""


class CreatePaymentSchema(BaseModel):
    plate_id: int
    spot_id: int
    value: float


class ParkingFiltersSchema(BaseModel):
    plate_id: Optional[int] = None
    spot_id: Optional[int] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
