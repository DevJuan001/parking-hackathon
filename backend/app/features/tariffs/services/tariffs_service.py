from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.features.tariffs.repositories.tariffs_repository import TariffsRepository
from app.features.tariffs.models.tariffs_schemas import CreateTariffSchema, UpdateTariffSchema

logger = get_logger("tariffs.service")


class TariffsService:

    @staticmethod
    def get_all_tariffs():
        connection = get_connection()

        try:
            error, tariffs = TariffsRepository.find_all_tariffs(connection)

            if error:
                raise ServiceError(error)

            return None, tariffs

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_tariffs: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener las tarifas", None

        finally:
            connection.close()

    @staticmethod
    def get_tariff_by_id(tariff_id: int):
        connection = get_connection()

        try:
            error, tariff = TariffsRepository.find_tariff_by_id(
                tariff_id, connection
            )

            if error or not tariff:
                raise ServiceError(error)

            return None, tariff

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_tariff_by_id: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener la tarifa", None

        finally:
            connection.close()

    @staticmethod
    async def create_tariff(tariff_data: CreateTariffSchema):
        connection = get_connection()

        try:
            error, success, message = TariffsRepository.create_tariff(
                tariff_data=tariff_data,
                connection=connection
            )

            if error or not success:
                raise ServiceError(error)

            connection.commit()

            return None, True, "Tarifa creada correctamente"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_tariff: %s",
                e,
                exc_info=True
            )
            return "Error al intentar crear la tarifa", False, None

        finally:
            connection.close()

    @staticmethod
    def update_tariff(tariff_id: int, tariff_data: UpdateTariffSchema):
        connection = get_connection()

        try:
            error, existing = TariffsRepository.find_tariff_by_id(
                tariff_id, connection
            )

            if not existing:
                raise ServiceError("Tarifa no encontrada")

            error, success, message = TariffsRepository.update_tariff(
                tariff_id, tariff_data, connection
            )

            if error or not success:
                raise ServiceError(error)

            connection.commit()

            return None, True, "Tarifa actualizada correctamente"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en update_tariff: %s",
                e,
                exc_info=True
            )
            return "Error al intentar actualizar la tarifa", False, None

        finally:
            connection.close()