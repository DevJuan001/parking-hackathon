from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.utils.plate_formatter import plate_formatter
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
            # Formateamos la placa
            plate_text = plate_formatter(data["plate"])

            if not plate_text:
                raise ServiceError("La placa no puede estar vacía")

            # Validamos si la placa tiene un numero al final para poder indentificar si es una moto o un carro
            if plate_text and plate_text[-1].isalpha():
                vehicle_type_id = 2
            else:
                vehicle_type_id = 1

            # Buscamos si la placa ya esta registrada
            error, plate_list = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error:
                raise ServiceError(error)

            plate = plate_list[0] if plate_list else None

            # Si la placa no esta registrada la registramos
            if not plate:
                error, new_plate_id, message = PlatesRepository.create_plate(
                    plate_text, vehicle_type_id, connection
                )

                if error or not new_plate_id:
                    raise ServiceError(error or "Error al registrar la placa")

                plate_id = new_plate_id

            else:
                plate_id = plate.id
            
            # Buscamos si el vehiculo tiene una entrada reciente
            error, active = EntriesRepository.has_active_entry(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

            if active:
                raise ServiceError("La placa ya tiene un ingreso activo")

            # Buscamos una plaza disponible para asignarsela
            error, spot_id, spot_label = EntriesRepository.find_available_spot(
                connection
            )

            if error or not spot_id:
                raise ServiceError(error or "No hay plazas disponibles")
            
            # Registramos la entrada del vehiculo
            error, success, message = EntriesRepository.create_entry(
                plate_id=plate_id,
                spot_id=spot_id,
                connection=connection
            )

            if error or not success:
                raise ServiceError(error)

            # Actualizamos el estado de la plaza a ocupada
            error, success, message = SpotsRepository.update_spot_status(
                spot_id, 3, connection
            )

            if error or not success:
                raise ServiceError(error)

            connection.commit()

            return None, True, f"Ingreso registrado correctamente en plaza {spot_label}"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_entry: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar el ingreso", False, None

        finally:
            connection.close()
