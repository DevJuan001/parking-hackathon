from fastapi import HTTPException
from app.features.parking.services.parking_service import ParkingService
from app.features.parking.models.parking_schemas import CreatePlateSchema


class ParkingController:

    @staticmethod
    def get_all_plates():
        error, plates = ParkingService.get_all_plates()

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": plates
        }

    @staticmethod
    def get_all_spots():
        error, spots = ParkingService.get_all_spots()

        if error:
            raise HTTPException(status_code=404, detail=error)

        return {
            "data": spots
        }

    @staticmethod
    async def create_plate(plate_data: CreatePlateSchema):
        error, success, message = await ParkingService.create_plate(plate_data)

        if error:
            raise HTTPException(status_code=400, detail=error)

        return {
            "success": success,
            "message": message
        }
