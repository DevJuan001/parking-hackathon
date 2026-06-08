from fastapi import HTTPException
from app.features.exits.services.exits_service import ExitsService
from app.features.exits.models.exits_schemas import CreateExitSchema, ExitsFiltersSchema


class ExitsController:

    @staticmethod
    def get_all_exits(filters: ExitsFiltersSchema):
        error, exits = ExitsService.get_all_exits(filters)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": exits
        }

    @staticmethod
    def get_exit_by_id(exit_id: int):
        error, exit_record = ExitsService.get_exit_by_id(exit_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": exit_record
        }

    @staticmethod
    def get_exits_by_plate(plate_id: int):
        error, exits = ExitsService.get_exits_by_plate(plate_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": exits
        }

    @staticmethod
    async def create_exit(exit_data: CreateExitSchema):
        error, success, message = await ExitsService.create_exit(exit_data)

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }
