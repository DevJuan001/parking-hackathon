from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.features.entries.repositories.entries_repository import EntriesRepository
from app.features.parking.repositories.plates_repository import PlatesRepository
from app.features.parking.repositories.vehicle_types_repository import VehicleTypesRepository
from app.features.spots.repositories.spots_repository import SpotsRepository
from app.features.entries.models.entries_schemas import CreateEntrySchema, EntriesFiltersSchema

logger = get_logger("entries.service")


class EntriesService:

    @staticmethod
    def get_all_entries(filters: EntriesFiltersSchema):
        connection = get_connection()

        try:
            error, entries = EntriesRepository.find_all_entries(
                filters, connection
            )

            if error:
                raise ServiceError(error)

            return None, entries

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_entries: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los ingresos", None

        finally:
            connection.close()

    @staticmethod
    def get_entry_by_id(entry_id: int):
        connection = get_connection()

        try:
            error, entry = EntriesRepository.find_entry_by_id(
                entry_id, connection
            )

            if error or not entry:
                raise ServiceError(error)

            return None, entry

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_entry_by_id: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener el ingreso", None

        finally:
            connection.close()

    @staticmethod
    def get_entries_by_plate(plate_id: int):
        connection = get_connection()

        try:
            error, entries = EntriesRepository.find_entries_by_plate(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

            return None, entries

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_entries_by_plate: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los ingresos de la placa", None

        finally:
            connection.close()

    @staticmethod
    async def create_entry(entry_data: CreateEntrySchema):
        data = entry_data.model_dump()
        connection = get_connection()

        try:
            plate_text = data["plate"].replace("-", "").strip().upper()

            if not plate_text:
                raise ServiceError("La placa no puede estar vacía")

            if plate_text and plate_text[-1].isalpha():
                vehicle_type = "Motorcycle"
            else:
                vehicle_type = "Car"

            error, vehicle_type_id = VehicleTypesRepository.find_vehicle_type_id_by_name(
                vehicle_type, connection
            )

            if error or not vehicle_type_id:
                raise ServiceError(error or "Tipo de vehículo no encontrado")

            plate_text = data["plate"].replace("-", "").strip().upper()

            error, plate_list = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error:
                raise ServiceError(error)

            plate = plate_list[0] if plate_list else None

            if not plate:
                error, plate_id, _ = PlatesRepository.create_plate(
                    plate_text, vehicle_type_id, connection
                )

                if error or not plate_id:
                    raise ServiceError(error or "Error al registrar la placa")
            else:
                plate_id = plate.id
                if plate.vehicle_type != vehicle_type:
                    error, _ = PlatesRepository.update_plate_vehicle_type(
                        plate_id, vehicle_type_id, connection
                    )
                    if error:
                        raise ServiceError(error)

            error, active = EntriesRepository.has_active_entry(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

            if active:
                raise ServiceError("La placa ya tiene un ingreso activo")

            error, spot_id, spot_label = EntriesRepository.find_available_spot(
                connection
            )

            if error or not spot_id:
                raise ServiceError(error or "No hay plazas disponibles")

            error, success, message = EntriesRepository.create_entry(
                plate_id=plate_id,
                spot_id=spot_id,
                connection=connection
            )

            if error or not success:
                raise ServiceError(error)

            error, _ = SpotsRepository.update_spot_status(
                spot_id, 3, connection
            )

            if error:
                raise ServiceError(error)

            connection.commit()

            return None, True, f"Ingreso registrado correctamente en plaza {spot_label}", vehicle_type

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_entry: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar el ingreso", False, None, None

        finally:
            connection.close()
