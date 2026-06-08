from fastapi import HTTPException
from app.features.payments.services.payments_service import PaymentsService
from app.features.payments.models.payments_schemas import CreatePaymentSchema, PaymentsFiltersSchema, CalculatePaymentSchema


class PaymentsController:

    @staticmethod
    def get_all_payments(filters: PaymentsFiltersSchema):
        error, payments = PaymentsService.get_all_payments(filters)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": payments
        }

    @staticmethod
    def get_payment_by_id(payment_id: int):
        error, payment = PaymentsService.get_payment_by_id(payment_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": payment
        }

    @staticmethod
    def get_payments_by_plate(plate_id: int):
        error, payments = PaymentsService.get_payments_by_plate(plate_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": payments
        }

    @staticmethod
    def calculate_payment(params: CalculatePaymentSchema):
        error, result = PaymentsService.calculate_payment(
            params.plate
        )

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": result
        }

    @staticmethod
    async def create_payment(payment_data: CreatePaymentSchema):
        error, success, message = await PaymentsService.create_payment(payment_data)

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }
