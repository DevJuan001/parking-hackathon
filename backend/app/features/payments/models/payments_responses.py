from pydantic import BaseModel


class PaymentResponse(BaseModel):
    id: int
    plate: str
    spot: str
    value: float
    created_at: str
    payment_method: int


class CalculatePaymentResponse(BaseModel):
    plate: str
    entry_time: str
    exit_time: str
    hours_parked: float
    rate_value: float
    total: float
