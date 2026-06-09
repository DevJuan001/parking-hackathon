from pydantic import BaseModel


class FloorsFiltersSchema(BaseModel):
    pass


class CreateFloorSchema(BaseModel):
    floor_number: int


class UpdateFloorSchema(BaseModel):
    floor_number: int | None = None
