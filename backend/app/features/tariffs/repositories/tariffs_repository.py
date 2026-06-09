from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.tariffs.models.tariffs_responses import TariffResponse

logger = get_logger("tariffs.repository")


class TariffsRepository:

    @staticmethod
    def find_all_tariffs(parking_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            id,
            vehicle_type_id,
            value,
            created_at,
            updated_at
        FROM RATES
        WHERE parking_id = %s
        ORDER BY vehicle_type_id ASC
        """

        try:
            cursor.execute(query, (parking_id,))
            results = cursor.fetchall()

            tariffs = [
                TariffResponse(
                    id=item[0],
                    vehicle_type=item[1],
                    value=item[2],
                    created_at=date_formatter(item[3]),
                    updated_at=date_formatter(item[4])
                )
                for item in results
            ]
            return None, tariffs

        except Exception as e:
            logger.error("Error en find_all_tariffs: %s", e, exc_info=True)
            return "Error al intentar obtener las tarifas", None

        finally:
            cursor.close()

    @staticmethod
    def find_tariff_by_id(parking_id: int, tariff_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            id,
            vehicle_type_id,
            value,
            created_at,
            updated_at
        FROM RATES
        WHERE parking_id = %s AND id = %s
        """

        try:
            cursor.execute(query, (parking_id, tariff_id))
            result = cursor.fetchone()

            if not result:
                return "Tarifa no encontrada", None

            tariff = TariffResponse(
                id=result[0],
                vehicle_type=result[1],
                value=result[2],
                created_at=date_formatter(result[3]),
                updated_at=date_formatter(result[4])
            )
            return None, tariff

        except Exception as e:
            logger.error("Error en find_tariff_by_id: %s", e, exc_info=True)
            return "Error al intentar obtener la tarifa", None

        finally:
            cursor.close()

    @staticmethod
    def find_rate_by_vehicle_type(parking_id: int, vehicle_type: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            id,
            vehicle_type_id,
            value,
            created_at,
            updated_at
        FROM RATES
        WHERE parking_id = %s AND vehicle_type_id = %s
        LIMIT 1
        """

        try:
            cursor.execute(query, (parking_id, vehicle_type))
            result = cursor.fetchone()

            if not result:
                return "Tarifa no encontrada para ese tipo de vehículo", None

            return None, TariffResponse(
                id=result[0],
                vehicle_type=result[1],
                value=result[2],
                created_at=date_formatter(result[3]),
                updated_at=date_formatter(result[4])
            )

        except Exception as e:
            logger.error(
                "Error en find_rate_by_vehicle_type: %s",
                e,
                exc_info=True
            )
            return "Error al buscar la tarifa", None

        finally:
            cursor.close()

    @staticmethod
    def create_tariff(parking_id: int, vehicle_type_id: int, value: float, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO RATES (parking_id, vehicle_type_id, value)
        VALUES (%s, %s, %s)
        """

        try:
            cursor.execute(query, (
                parking_id,
                vehicle_type_id,
                value
            ))
            return None, True, "Tarifa creada correctamente"

        except Exception as e:
            logger.error("Error en create_tariff: %s", e, exc_info=True)
            return "Error al intentar crear la tarifa", False, None

        finally:
            cursor.close()

    @staticmethod
    def update_tariff(parking_id: int, tariff_id: int, value: float, connection):
        cursor = connection.cursor()

        query = """
        UPDATE RATES
        SET value = %s
        WHERE parking_id = %s AND id = %s
        """

        try:
            cursor.execute(query, (value, parking_id, tariff_id))
            return None, True, "Tarifa actualizada correctamente"

        except Exception as e:
            logger.error("Error en update_tariff: %s", e, exc_info=True)
            return "Error al intentar actualizar la tarifa", False, None

        finally:
            cursor.close()
