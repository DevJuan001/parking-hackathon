from pydantic import BaseModel


class EntryResponse(BaseModel):
    id: int
    plate: str
    vehicle_type: str
    spot: str
    created_at: str
