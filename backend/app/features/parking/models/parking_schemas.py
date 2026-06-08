from pydantic import BaseModel


class CreatePlateSchema(BaseModel):
    plate: str