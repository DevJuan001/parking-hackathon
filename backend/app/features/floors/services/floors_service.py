from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.features.floors.repositories.floors_repository import FloorsRepository

logger = get_logger("floors.service")


class FloorsService:

    @staticmethod
    def get_all_floors(parking_id: int):
        connection = get_connection()

        try:
            error, floors = FloorsRepository.find_all_floors(
                parking_id, connection
            )

            if error:
                raise ServiceError(error)

            return None, floors

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_floors: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los pisos", None

        finally:
            connection.close()

    @staticmethod
    def get_floor_by_id(parking_id: int, floor_id: int):
        connection = get_connection()

        try:
            error, floor = FloorsRepository.find_floor_by_id(
                parking_id, floor_id, connection
            )

            if error or not floor:
                raise ServiceError(error)

            return None, floor

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_floor_by_id: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener el piso", None

        finally:
            connection.close()

    @staticmethod
    def create_floor(parking_id: int, floor_number: int):
        connection = get_connection()

        try:
            error, floor_id, message = FloorsRepository.create_floor(
                parking_id, floor_number, connection
            )

            if error or not floor_id:
                raise ServiceError(error)

            connection.commit()

            return None, True, message

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_floor: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar el piso", False, None

        finally:
            connection.close()

    @staticmethod
    def update_floor(parking_id: int, floor_id: int, floor_number: int):
        connection = get_connection()

        try:
            error, exists = FloorsRepository.find_floor_by_id(
                parking_id, floor_id, connection
            )

            if error or not exists:
                raise ServiceError("Piso no encontrado")

            error, success, message = FloorsRepository.update_floor(
                parking_id, floor_id, floor_number, connection
            )

            if error or not success:
                raise ServiceError(error)

            connection.commit()

            return None, True, message

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en update_floor: %s",
                e,
                exc_info=True
            )
            return "Error al intentar actualizar el piso", False, None

        finally:
            connection.close()
