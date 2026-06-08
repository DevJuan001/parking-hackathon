from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.middlewares.roles_middleware import require_roles
from app.features.exits.controllers.exits_controller import ExitsController
from app.features.exits.models.exits_schemas import CreateExitSchema, ExitsFiltersSchema

router = APIRouter(
    prefix="/api/exits",
    tags=["Exits"]
)


@router.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_all_exits(filters: ExitsFiltersSchema = Depends()):
    return ExitsController.get_all_exits(filters)


@router.get(
    "/plate/{plate_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_exits_by_plate(plate_id: int):
    return ExitsController.get_exits_by_plate(plate_id)


@router.get(
    "/{exit_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_exit_by_id(exit_id: int):
    return ExitsController.get_exit_by_id(exit_id)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
async def create_exit(
    exit_data: CreateExitSchema
):
    return await ExitsController.create_exit(exit_data)
