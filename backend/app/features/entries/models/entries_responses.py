from datetime import datetime
from pydantic import BaseModel


class EntryResponse(BaseModel):
    id: int
    plate: str
    vehicle_type: str
    spot_id: int
    spot: str
    created_at: datetime
