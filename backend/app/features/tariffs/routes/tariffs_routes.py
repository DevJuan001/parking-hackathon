from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.middlewares.roles_middleware import require_roles
from app.features.tariffs.controllers.tariffs_controller import TariffsController
from app.features.tariffs.models.tariffs_schemas import CreateTariffSchema, UpdateTariffSchema

router = APIRouter(
    prefix="/api/tariffs",
    tags=["Tariffs"]
)


@router.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_all_tariffs():
    return TariffsController.get_all_tariffs()


@router.get(
    "/{tariff_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_tariff_by_id(tariff_id: int):
    return TariffsController.get_tariff_by_id(tariff_id)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
async def create_tariff(
    tariff_data: CreateTariffSchema
):
    return await TariffsController.create_tariff(tariff_data)


@router.put(
    "/update/{tariff_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def update_tariff(
    tariff_id: int,
    tariff_data: UpdateTariffSchema
):
    return TariffsController.update_tariff(tariff_id, tariff_data)
