from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.exits.models.exits_schemas import ExitsFiltersSchema
from app.features.exits.models.exits_responses import ExitResponse

logger = get_logger("exits.repository")


class ExitsRepository:

    @staticmethod
    def find_all_exits(filters_data: ExitsFiltersSchema, connection):
        data = filters_data.model_dump(exclude_none=True)

        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            e.created_at
        FROM EXITS AS e
        INNER JOIN PLATES AS p ON p.id = e.plate_id
        """

        filters = []
        values = []

        if "plate_id" in data:
            filters.append("e.plate_id = %s")
            values.append(data["plate_id"])

        if "start_date" in data:
            filters.append("DATE(e.created_at) >= %s")
            values.append(data["start_date"])

        if "end_date" in data:
            filters.append("DATE(e.created_at) <= %s")
            values.append(data["end_date"])

        if filters:
            query += " WHERE " + " AND ".join(filters)

        query += " ORDER BY e.created_at DESC"

        try:
            cursor.execute(query, values)
            results = cursor.fetchall()

            exits = [
                ExitResponse(
                    id=item[0],
                    plate=item[1],
                    created_at=item[2]
                )
                for item in results
            ]
            return None, exits

        except Exception as e:
            logger.error("Error en find_all_exits: %s", e, exc_info=True)
            return "Error al intentar obtener las salidas", None

        finally:
            cursor.close()

    @staticmethod
    def find_exit_by_id(exit_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            e.created_at
        FROM EXITS AS e
        INNER JOIN PLATES AS p ON p.id = e.plate_id
        WHERE e.id = %s
        """

        try:
            cursor.execute(query, (exit_id,))
            result = cursor.fetchone()

            if not result:
                return "Salida no encontrada", None

            return None, ExitResponse(
                id=result[0],
                plate=result[1],
                created_at=result[2]
            )

        except Exception as e:
            logger.error("Error en find_exit_by_id: %s", e, exc_info=True)
            return "Error al intentar obtener la salida", None

        finally:
            cursor.close()

    @staticmethod
    def find_exits_by_plate(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            e.created_at
        FROM EXITS AS e
        INNER JOIN PLATES AS p
            ON p.id = e.plate_id
        WHERE e.plate_id = %s
        ORDER BY e.created_at DESC
        """

        try:
            cursor.execute(query, (plate_id,))
            results = cursor.fetchall()

            exits = [
                ExitResponse(
                    id=item[0],
                    plate=item[1],
                    created_at=item[2]
                )
                for item in results
            ]
            return None, exits

        except Exception as e:
            logger.error("Error en find_exits_by_plate: %s", e, exc_info=True)
            return "Error al intentar obtener las salidas de la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_latest_exit(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            e.created_at
        FROM EXITS AS e
        INNER JOIN PLATES AS p
            ON p.id = e.plate_id
        WHERE plate_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """

        try:
            cursor.execute(query, (plate_id,))
            result = cursor.fetchone()

            if not result:
                return None, None

            return None, ExitResponse(
                id=result[0],
                plate=result[1],
                created_at=result[2]
            )

        except Exception as e:
            logger.error("Error en find_latest_exit: %s", e, exc_info=True)
            return "Error al buscar la última salida", None

        finally:
            cursor.close()

    @staticmethod
    def create_exit(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO EXITS (plate_id)
        VALUES (%s)
        """

        try:
            cursor.execute(query, (plate_id,))
            return None, True, "Salida registrada correctamente"

        except Exception as e:
            logger.error("Error en create_exit: %s", e, exc_info=True)
            return "Error al intentar registrar la salida", False, None

        finally:
            cursor.close()
