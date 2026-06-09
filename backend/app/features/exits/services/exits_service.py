from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.utils.plate_formatter import plate_formatter
from app.features.exits.repositories.exits_repository import ExitsRepository
from app.features.spots.repositories.spots_repository import SpotsRepository
from app.features.parking.repositories.plates_repository import PlatesRepository
from app.features.entries.repositories.entries_repository import EntriesRepository
from app.features.exits.models.exits_schemas import CreateExitSchema, ExitsFiltersSchema


logger = get_logger("exits.service")


class ExitsService:

    @staticmethod
    def get_all_exits(filters: ExitsFiltersSchema):
        connection = get_connection()

        try:
            error, exits = ExitsRepository.find_all_exits(
                filters, connection
            )

            if error:
                raise ServiceError(error)

            return None, exits

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_exits: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener las salidas", None

        finally:
            connection.close()

    @staticmethod
    def get_exit_by_id(exit_id: int):
        connection = get_connection()

        try:
            error, exit_record = ExitsRepository.find_exit_by_id(
                exit_id, connection
            )

            if error or not exit_record:
                raise ServiceError(error)

            return None, exit_record

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_exit_by_id: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener la salida", None

        finally:
            connection.close()

    @staticmethod
    def get_exits_by_plate(plate_id: int):
        connection = get_connection()

        try:
            error, exits = ExitsRepository.find_exits_by_plate(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

            return None, exits

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_exits_by_plate: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener las salidas de la placa", None

        finally:
            connection.close()

    @staticmethod
    async def create_exit(exit_data: CreateExitSchema):
        connection = get_connection()

        try:
            plate_text = plate_formatter(exit_data.plate)

            if not plate_text:
                raise ServiceError("La placa no puede estar vacía")

            # Buscamos si esta registrada la placa
            error, plate_list = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error or not plate_list:
                raise ServiceError(error or "Placa no encontrada")

            plate = plate_list[0]

            # Validamos que el vehiculo este adentro
            error, active = EntriesRepository.has_active_entry(
                plate.id, connection
            )

            if error:
                raise ServiceError(error)

            if not active:
                raise ServiceError(
                    "La placa no tiene un ingreso activo, no se puede registrar la salida"
                )

            # Buscamos la plaza donde estaba el vehiculo
            error, spot_id = EntriesRepository.find_latest_entry_spot(
                plate.id, connection
            )

            if error or not spot_id:
                raise ServiceError(
                    error or "No se encontró un ingreso para esta placa"
                )

            # Registramos la salida
            error, success, message = ExitsRepository.create_exit(
                plate_id=plate.id,
                connection=connection
            )

            if error or not success:
                raise ServiceError(error)

            # Actualizamos el estado de la plaza
            error, success, message = SpotsRepository.update_spot_status(
                spot_id, 2, connection
            )

            if error or not success:
                raise ServiceError(
                    error or "Error al intentar actualizar el estado de la plaza"
                )

            connection.commit()

            return None, True, "Salida registrada correctamente"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_exit: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar la salida", False, None

        finally:
            connection.close()
