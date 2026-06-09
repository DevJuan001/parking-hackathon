from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.middlewares.jwt_middleware import verify_jwt
from app.middlewares.roles_middleware import require_roles
from app.features.entries.controllers.entries_controller import EntriesController
from app.features.entries.models.entries_schemas import CreateEntrySchema, EntriesFiltersSchema

router = APIRouter(
    prefix="/api/entries",
    tags=["Entries"]
)


@router.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"])),
        Depends(verify_jwt)
    ]
)
def get_all_entries(
    filters: EntriesFiltersSchema = Depends(),
    payload: dict = Depends(verify_jwt)
):
    return EntriesController.get_all_entries(filters, payload)


@router.get(
    "/plate/{plate_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"])),
        Depends(verify_jwt)
    ]
)
def get_entries_by_plate(
    plate_id: int,
    payload: dict = Depends(verify_jwt)
):
    return EntriesController.get_entries_by_plate(plate_id, payload)


@router.get(
    "/{entry_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"])),
        Depends(verify_jwt)
    ]
)
def get_entry_by_id(
    entry_id: int,
    payload: dict = Depends(verify_jwt)
):
    return EntriesController.get_entry_by_id(entry_id, payload)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(verify_jwt)
    ]
)
async def create_entry(
    entry_data: CreateEntrySchema,
    payload: dict = Depends(verify_jwt)
):
    return await EntriesController.create_entry(entry_data, payload)
