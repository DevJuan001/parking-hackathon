from pydantic import BaseModel


class FloorResponse(BaseModel):
    id: int
    floor_number: int
    created_at: str
