from pydantic import BaseModel


class ExitResponse(BaseModel):
    id: int
    plate: str
    created_at: str
