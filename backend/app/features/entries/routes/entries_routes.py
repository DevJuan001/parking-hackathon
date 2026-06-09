from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
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
        Depends(require_roles(["Admin"]))
    ]
)
def get_all_entries(filters: EntriesFiltersSchema = Depends()):
    return EntriesController.get_all_entries(filters)


@router.get(
    "/plate/{plate_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_entries_by_plate(plate_id: int):
    return EntriesController.get_entries_by_plate(plate_id)


@router.get(
    "/{entry_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_entry_by_id(entry_id: int):
    return EntriesController.get_entry_by_id(entry_id)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
async def create_entry(
    entry_data: CreateEntrySchema
):
    return await EntriesController.create_entry(entry_data)
