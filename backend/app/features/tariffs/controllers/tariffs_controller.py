from fastapi import HTTPException
from app.features.tariffs.services.tariffs_service import TariffsService
from app.features.tariffs.models.tariffs_schemas import CreateTariffSchema, UpdateTariffSchema


class TariffsController:

    @staticmethod
    def get_all_tariffs():
        error, tariffs = TariffsService.get_all_tariffs()

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": tariffs
        }

    @staticmethod
    def get_tariff_by_id(tariff_id: int):
        error, tariff = TariffsService.get_tariff_by_id(tariff_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": tariff
        }

    @staticmethod
    async def create_tariff(tariff_data: CreateTariffSchema):
        error, success, message = await TariffsService.create_tariff(tariff_data)

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }

    @staticmethod
    def update_tariff(tariff_id: int, tariff_data: UpdateTariffSchema):
        error, success, message = TariffsService.update_tariff(
            tariff_id, tariff_data
        )

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }

    @staticmethod
    def delete_tariff(tariff_id: int):
        error, success, message = TariffsService.delete_tariff(tariff_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "success": success,
            "message": message
        }
