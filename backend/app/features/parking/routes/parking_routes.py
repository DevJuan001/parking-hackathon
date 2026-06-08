from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.features.parking.models.parking_schemas import CreatePlateSchema
from app.features.parking.controllers.parking_controller import ParkingController

router = APIRouter(
    prefix="/api/parking",
    tags=["Parking"]
)


@router.get(
    "/plates",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def get_all_plates():
    return ParkingController.get_all_plates()


@router.get(
    "/spots",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def get_all_spots():
    return ParkingController.get_all_spots()


@router.post(
    "/plates/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
async def create_plate(
    plate_data: CreatePlateSchema
):
    return await ParkingController.create_plate(plate_data)
