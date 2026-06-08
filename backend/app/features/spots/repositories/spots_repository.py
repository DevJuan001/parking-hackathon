from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.spots.models.spots_schemas import SpotsFiltersSchema
from app.features.spots.models.spots_responses import SpotResponse

logger = get_logger("spots.repository")


class SpotsRepository:

    @staticmethod
    def find_all_spots(filters_data: SpotsFiltersSchema, connection):
        data = filters_data.model_dump(exclude_none=True)

        cursor = connection.cursor()

        query = """
        SELECT
            spot_id,
            spot,
            spot_status,
            created_at
        FROM SPOTS
        """

        filters = []
        values = []

        if "spot_status" in data:
            filters.append("spot_status = %s")
            values.append(data["spot_status"])

        if filters:
            query += " WHERE " + " AND ".join(filters)

        query += " ORDER BY spot ASC"

        try:
            cursor.execute(query, values)
            results = cursor.fetchall()

            spots = [
                SpotResponse(
                    spot_id=item[0],
                    spot=item[1],
                    spot_status=item[2],
                    created_at=date_formatter(item[3])
                )
                for item in results
            ]
            return None, spots

        except Exception as e:
            logger.error("Error en find_all_spots: %s", e, exc_info=True)
            return "Error al intentar obtener las plazas", None

        finally:
            cursor.close()

    @staticmethod
    def find_spot_by_id(spot_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            spot_id,
            spot,
            spot_status,
            created_at
        FROM SPOTS
        WHERE spot_id = %s
        """

        try:
            cursor.execute(query, (spot_id,))
            result = cursor.fetchone()

            if not result:
                return "Plaza no encontrada", None

            spot = SpotResponse(
                spot_id=result[0],
                spot=result[1],
                spot_status=result[2],
                created_at=date_formatter(result[3])
            )
            return None, spot

        except Exception as e:
            logger.error("Error en find_spot_by_id: %s", e, exc_info=True)
            return "Error al intentar obtener la plaza", None

        finally:
            cursor.close()

    @staticmethod
    def create_spot(spot_label: str, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO SPOTS (spot, spot_status)
        VALUES (%s, 2)
        """

        try:
            cursor.execute(query, (spot_label,))
            return None, True, "Plaza registrada correctamente"

        except Exception as e:
            logger.error("Error en create_spot: %s", e, exc_info=True)
            return "Error al intentar registrar la plaza", False, None

        finally:
            cursor.close()

    @staticmethod
    def update_spot_status(spot_id: int, status: int, connection):
        cursor = connection.cursor()

        query = "UPDATE SPOTS SET spot_status = %s WHERE spot_id = %s"

        try:
            cursor.execute(query, (status, spot_id))
            return None, True, "Estado de la plaza actualizado correctamente"

        except Exception as e:
            logger.error("Error en update_spot_status: %s", e, exc_info=True)
            return "Error al actualizar el estado de la plaza", False, None

        finally:
            cursor.close()
