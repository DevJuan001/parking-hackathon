from fastapi import APIRouter, Depends
from fastapi_limiter.depends import RateLimiter
from app.middlewares.roles_middleware import require_roles
from app.features.payments.controllers.payments_controller import PaymentsController
from app.features.payments.models.payments_schemas import CreatePaymentSchema, PaymentsFiltersSchema, CalculatePaymentSchema

router = APIRouter(
    prefix="/api/payments",
    tags=["Payments"]
)


@router.get(
    "/",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_all_payments(filters: PaymentsFiltersSchema = Depends()):
    return PaymentsController.get_all_payments(filters)


@router.get(
    "/calculate",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
def calculate_payment(params: CalculatePaymentSchema = Depends()):
    return PaymentsController.calculate_payment(params)


@router.get(
    "/plate/{plate_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_payments_by_plate(plate_id: int):
    return PaymentsController.get_payments_by_plate(plate_id)


@router.get(
    "/{payment_id}",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60)),
        Depends(require_roles(["Admin"]))
    ]
)
def get_payment_by_id(payment_id: int):
    return PaymentsController.get_payment_by_id(payment_id)


@router.post(
    "/create",
    dependencies=[
        Depends(RateLimiter(times=30, seconds=60))
    ]
)
async def create_payment(
    payment_data: CreatePaymentSchema
):
    return await PaymentsController.create_payment(payment_data)
