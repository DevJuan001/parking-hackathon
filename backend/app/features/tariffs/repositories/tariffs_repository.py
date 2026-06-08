from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.tariffs.models.tariffs_schemas import CreateTariffSchema, UpdateTariffSchema
from app.features.tariffs.models.tariffs_responses import TariffResponse

logger = get_logger("tariffs.repository")


class TariffsRepository:

    @staticmethod
    def find_all_tariffs(connection):
        cursor = connection.cursor()

        query = """
        SELECT
            id,
            vehicle_type,
            value,
            created_at,
            updated_at
        FROM RATES
        ORDER BY vehicle_type ASC
        """

        try:
            cursor.execute(query)
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
    def find_tariff_by_id(tariff_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            id,
            vehicle_type,
            value,
            created_at,
            updated_at
        FROM RATES
        WHERE id = %s
        """

        try:
            cursor.execute(query, (tariff_id,))
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
    def create_tariff(tariff_data: CreateTariffSchema, connection):
        data = tariff_data.model_dump()

        cursor = connection.cursor()

        query = """
        INSERT INTO RATES (vehicle_type, value)
        VALUES (%s, %s)
        """

        try:
            cursor.execute(query, (
                data["vehicle_type"],
                data["value"])
            )
            return None, True, "Tarifa creada correctamente"

        except Exception as e:
            logger.error("Error en create_tariff: %s", e, exc_info=True)
            return "Error al intentar crear la tarifa", False, None

        finally:
            cursor.close()

    @staticmethod
    def update_tariff(tariff_id: int, tariff_data: UpdateTariffSchema, connection):
        data = tariff_data.model_dump(exclude_none=True)

        TARIFF_FIELDS = {
            "vehicle_type": "vehicle_type",
            "value": "value",
        }

        cursor = connection.cursor()

        try:
            tariff_fields = {
                key: data[key]
                for key in TARIFF_FIELDS.keys()
                if key in data
            }

            if tariff_fields:
                mapped = {
                    TARIFF_FIELDS[key]: value for key, value in tariff_fields.items()}

                columns = ", ".join(f"{col} = %s" for col in mapped.keys())
                values = list(mapped.values()) + [tariff_id]

                cursor.execute(
                    f"UPDATE RATES SET {columns} WHERE id = %s",
                    values
                )

            return None, True, "Tarifa actualizada correctamente"

        except Exception as e:
            logger.error("Error en update_tariff: %s", e, exc_info=True)
            return "Error al intentar actualizar la tarifa", False, None

        finally:
            cursor.close()

    @staticmethod
    def delete_tariff(tariff_id: int, connection):
        cursor = connection.cursor()

        query = "DELETE FROM RATES WHERE id = %s"

        try:
            cursor.execute(query, (tariff_id,))
            return None, True, "Tarifa eliminada correctamente"

        except Exception as e:
            logger.error("Error en delete_tariff: %s", e, exc_info=True)
            return "Error al intentar eliminar la tarifa", False, None

        finally:
            cursor.close()
