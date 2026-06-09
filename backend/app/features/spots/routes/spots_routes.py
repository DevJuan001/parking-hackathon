from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.features.spots.controllers.spots_controller import SpotsController
from app.features.spots.models.spots_schemas import SpotsFiltersSchema, CreateSpotSchema, UpdateSpotStatusSchema

router = APIRouter(
    prefix="/api/spots",
    tags=["Spots"]
)


@router.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def get_all_spots(filters: SpotsFiltersSchema = Depends()):
    return SpotsController.get_all_spots(filters)


@router.get(
    "/{spot_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def get_spot_by_id(spot_id: int):
    return SpotsController.get_spot_by_id(spot_id)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def create_spot(
    spot_data: CreateSpotSchema
):
    return SpotsController.create_spot(spot_data)


@router.put(
    "/{spot_id}/status",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def update_spot_status(
    spot_id: int,
    status_data: UpdateSpotStatusSchema
):
    return SpotsController.update_spot_status(spot_id, status_data)
