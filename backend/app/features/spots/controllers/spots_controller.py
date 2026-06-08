from fastapi import HTTPException
from app.features.spots.services.spots_service import SpotsService
from app.features.spots.models.spots_schemas import SpotsFiltersSchema, CreateSpotSchema, UpdateSpotStatusSchema


class SpotsController:

    @staticmethod
    def get_all_spots(filters: SpotsFiltersSchema):
        error, spots = SpotsService.get_all_spots(filters)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": spots
        }

    @staticmethod
    def get_spot_by_id(spot_id: int):
        error, spot = SpotsService.get_spot_by_id(spot_id)

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": spot
        }

    @staticmethod
    def create_spot(spot_data: CreateSpotSchema):
        error, success, message = SpotsService.create_spot(
            spot_data.spot
        )

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }

    @staticmethod
    def update_spot_status(spot_id: int, status_data: UpdateSpotStatusSchema):
        error, success, message = SpotsService.update_spot_status(
            spot_id, status_data.spot_status
        )

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }
