from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.utils.plate_formatter import plate_formatter
from app.features.parking.models.parking_schemas import CreatePlateSchema
from app.features.parking.repositories.plates_repository import PlatesRepository
from app.features.parking.repositories.vehicle_types_repository import VehicleTypesRepository
from app.features.spots.models.spots_schemas import SpotsFiltersSchema
from app.features.spots.repositories.spots_repository import SpotsRepository

logger = get_logger("parking.service")


class ParkingService:

    @staticmethod
    def get_all_plates(parking_id: int):
        connection = get_connection()

        try:
            error, plates = PlatesRepository.find_all_plates(
                parking_id, connection
            )

            if error:
                raise ServiceError(error)

            return None, plates

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_plates: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener las placas", None

        finally:
            connection.close()

    @staticmethod
    def get_all_spots(parking_id: int):
        connection = get_connection()

        try:
            error, spots = SpotsRepository.find_all_spots(
                parking_id, SpotsFiltersSchema(), connection
            )

            if error:
                raise ServiceError(error)

            return None, spots

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_spots: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los espacios", None

        finally:
            connection.close()

    @staticmethod
    def get_plate_by_name(parking_id: int, plate: str):
        connection = get_connection()

        try:
            error, plate_response = PlatesRepository.get_plate_by_name(
                parking_id, plate, connection
            )

            if error:
                raise ServiceError(error)

            return None, plate_response

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_plate_by_name: %s",
                e,
                exc_info=True
            )
            return "Error al intentar buscar la placa", None

        finally:
            connection.close()

    @staticmethod
    async def create_plate(parking_id: int, plate_data: CreatePlateSchema):
        connection = get_connection()

        try:
            plate_text = plate_formatter(plate_data.plate)

            error, plate_exists = PlatesRepository.get_plate_by_name(
                parking_id, plate_text, connection
            )

            if error:
                raise ServiceError(error)

            if plate_exists:
                raise ServiceError(
                    "Esta placa ya se encuentra registrada, intenta cambiar la placa e intentalo nuevamente"
                )

            if not plate_text:
                raise ServiceError("La placa no puede estar vacía")

            if plate_text[-1].isalpha():
                vehicle_type = 2
            else:
                vehicle_type = 1

            error, vehicle_type_id = VehicleTypesRepository.find_vehicle_type_id_by_name(
                vehicle_type, connection
            )

            if error or not vehicle_type_id:
                raise ServiceError(error or "Tipo de vehículo no encontrado")

            error, plate_id, message = PlatesRepository.create_plate(
                parking_id=parking_id,
                plate_str=plate_text,
                vehicle_type_id=vehicle_type_id,
                connection=connection
            )

            if error or not plate_id:
                raise ServiceError(error or message)

            connection.commit()

            return None, True, "Placa registrada correctamente"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_plate: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar la placa", False, None

        finally:
            connection.close()
