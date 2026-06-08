from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.entries.models.entries_schemas import CreateEntrySchema, EntriesFiltersSchema
from app.features.entries.models.entries_responses import EntryResponse

logger = get_logger("entries.repository")


class EntriesRepository:

    @staticmethod
    def find_all_entries(filters_data: EntriesFiltersSchema, connection):
        data = filters_data.model_dump(exclude_none=True)

        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            vt.name,
            s.spot,
            e.created_at
        FROM ENTRIES AS e
        INNER JOIN PLATES        AS p  ON p.id  = e.plate_id
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        INNER JOIN SPOTS         AS s  ON s.spot_id = e.spot_id
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

            entries = [
                EntryResponse(
                    id=item[0],
                    plate=item[1],
                    vehicle_type=item[2],
                    spot=item[3],
                    created_at=date_formatter(item[4])
                )
                for item in results
            ]
            return None, entries

        except Exception as e:
            logger.error("Error en find_all_entries: %s", e, exc_info=True)
            return "Error al intentar obtener los ingresos", None

        finally:
            cursor.close()

    @staticmethod
    def find_entry_by_id(entry_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            vt.name,
            s.spot,
            e.created_at
        FROM ENTRIES AS e
        INNER JOIN PLATES        AS p  ON p.id  = e.plate_id
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        INNER JOIN SPOTS         AS s  ON s.spot_id = e.spot_id
        WHERE e.id = %s
        """

        try:
            cursor.execute(query, (entry_id,))
            result = cursor.fetchone()

            if not result:
                return "Ingreso no encontrado", None

            entry = EntryResponse(
                id=result[0],
                plate=result[1],
                vehicle_type=result[2],
                spot=result[3],
                created_at=date_formatter(result[4])
            )
            return None, entry

        except Exception as e:
            logger.error("Error en find_entry_by_id: %s", e, exc_info=True)
            return "Error al intentar obtener el ingreso", None

        finally:
            cursor.close()

    @staticmethod
    def find_entries_by_plate(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            e.id,
            p.plate,
            vt.name,
            s.spot,
            e.created_at
        FROM ENTRIES AS e
        INNER JOIN PLATES        AS p  ON p.id  = e.plate_id
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        INNER JOIN SPOTS         AS s  ON s.spot_id = e.spot_id
        WHERE e.plate_id = %s
        ORDER BY e.created_at DESC
        """

        try:
            cursor.execute(query, (plate_id,))
            results = cursor.fetchall()

            entries = [
                EntryResponse(
                    id=item[0],
                    plate=item[1],
                    vehicle_type=item[2],
                    spot=item[3],
                    created_at=date_formatter(item[4])
                )
                for item in results
            ]
            return None, entries

        except Exception as e:
            logger.error("Error en find_entries_by_plate: %s", e, exc_info=True)
            return "Error al intentar obtener los ingresos de la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_plate_by_plate_str(plate_str: str, connection):
        cursor = connection.cursor()

        query = "SELECT id, vehicle_type_id FROM PLATES WHERE plate = %s"

        try:
            cursor.execute(query, (plate_str,))
            result = cursor.fetchone()

            if not result:
                return None, None

            return None, {"id": result[0], "vehicle_type_id": result[1]}

        except Exception as e:
            logger.error("Error en find_plate_by_plate_str: %s", e, exc_info=True)
            return "Error al buscar la placa", None

        finally:
            cursor.close()

    @staticmethod
    def update_plate_vehicle_type(plate_id: int, vehicle_type_id: int, connection):
        cursor = connection.cursor()

        query = "UPDATE PLATES SET vehicle_type_id = %s WHERE id = %s"

        try:
            cursor.execute(query, (vehicle_type_id, plate_id))
            return None, True

        except Exception as e:
            logger.error("Error en update_plate_vehicle_type: %s", e, exc_info=True)
            return "Error al actualizar el tipo de vehículo", False

        finally:
            cursor.close()

    @staticmethod
    def create_plate(plate_str: str, vehicle_type_id: int, connection):
        cursor = connection.cursor()

        query = "INSERT INTO PLATES (plate, vehicle_type_id) VALUES (%s, %s)"

        try:
            cursor.execute(query, (plate_str, vehicle_type_id))
            return None, cursor.lastrowid

        except Exception as e:
            logger.error("Error en create_plate: %s", e, exc_info=True)
            return "Error al registrar la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_vehicle_type_id_by_name(name: str, connection):
        cursor = connection.cursor()

        query = "SELECT id FROM VEHICLE_TYPES WHERE name = %s"

        try:
            cursor.execute(query, (name,))
            result = cursor.fetchone()

            if not result:
                return "Tipo de vehículo no encontrado", None

            return None, result[0]

        except Exception as e:
            logger.error("Error en find_vehicle_type_id_by_name: %s", e, exc_info=True)
            return "Error al buscar el tipo de vehículo", None

        finally:
            cursor.close()

    @staticmethod
    def has_active_entry(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT e.id FROM ENTRIES e
        WHERE e.plate_id = %s
        AND NOT EXISTS (
            SELECT 1 FROM EXITS x
            WHERE x.plate_id = e.plate_id
            AND x.created_at > e.created_at
        )
        LIMIT 1
        """

        try:
            cursor.execute(query, (plate_id,))
            result = cursor.fetchone()

            return None, result is not None

        except Exception as e:
            logger.error("Error en has_active_entry: %s", e, exc_info=True)
            return "Error al verificar si la placa tiene un ingreso activo", False

        finally:
            cursor.close()

    @staticmethod
    def find_available_spot(connection):
        cursor = connection.cursor()

        query = """
        SELECT s.spot_id, s.spot
        FROM SPOTS s
        WHERE s.spot_status = 2
        LIMIT 1
        """

        try:
            cursor.execute(query)
            result = cursor.fetchone()

            if not result:
                return "No hay plazas disponibles", None, None

            return None, result[0], result[1]

        except Exception as e:
            logger.error("Error en find_available_spot: %s", e, exc_info=True)
            return "Error al buscar plaza disponible", None, None

        finally:
            cursor.close()

    @staticmethod
    def create_entry(plate_id: int, spot_id: int, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO ENTRIES (plate_id, spot_id)
        VALUES (%s, %s)
        """

        try:
            cursor.execute(query, (plate_id, spot_id))
            return None, True, "Ingreso registrado correctamente"

        except Exception as e:
            logger.error("Error en create_entry: %s", e, exc_info=True)
            return "Error al intentar registrar el ingreso", False, None

        finally:
            cursor.close()

    @staticmethod
    def update_spot_status(spot_id: int, status: int, connection):
        cursor = connection.cursor()

        query = "UPDATE SPOTS SET spot_status = %s WHERE spot_id = %s"

        try:
            cursor.execute(query, (status, spot_id))
            return None, True

        except Exception as e:
            logger.error("Error en update_spot_status: %s", e, exc_info=True)
            return "Error al actualizar el estado de la plaza", False

        finally:
            cursor.close()
