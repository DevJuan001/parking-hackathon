from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.parking.models.parking_responses import PlateResponse, SpotResponse

logger = get_logger("parking.repository")


class ParkingRepository:

    @staticmethod
    def find_all_plates(connection):
        cursor = connection.cursor()

        query = """
        SELECT
            p.id,
            p.plate,
            vt.name,
            p.created_at
        FROM PLATES AS p
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        ORDER BY p.created_at DESC
        """

        try:
            cursor.execute(query)
            results = cursor.fetchall()

            plates = [
                PlateResponse(
                    id=item[0],
                    plate=item[1],
                    vehicle_type=item[2],
                    created_at=date_formatter(item[3])
                )
                for item in results
            ]
            return None, plates

        except Exception as e:
            logger.error("Error en find_all_plates: %s", e, exc_info=True)
            return "Error al intentar obtener las placas", None

        finally:
            cursor.close()

    @staticmethod
    def get_plate_by_name(plate: str, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            p.id,
            p.plate,
            vt.name,
            p.created_at
        FROM PLATES AS p
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        WHERE p.plate = %s
        """

        try:
            cursor.execute(query, (plate.upper(),))
            result = cursor.fetchall()

            if not result:
                return None, None

            plate_response = [
                PlateResponse(
                    id=item[0],
                    plate=item[1],
                    vehicle_type=item[2],
                    created_at=date_formatter(item[3])
                )
                for item in result
            ]

            return None, plate_response

        except Exception as e:
            logger.error("Error en get_plate_by_name: %s", e, exc_info=True)
            return "Error al intentar buscar la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_all_spots(connection):
        cursor = connection.cursor()

        query = """
        SELECT
            spot_id,
            spot,
            spot_status
        FROM SPOTS
        ORDER BY spot ASC
        """

        try:
            cursor.execute(query)
            results = cursor.fetchall()

            spots = [
                SpotResponse(
                    spot_id=item[0],
                    spot=item[1],
                    status=item[2],
                )
                for item in results
            ]
            return None, spots

        except Exception as e:
            logger.error("Error en find_all_spots: %s", e, exc_info=True)
            return "Error al intentar obtener los espacios", None

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
            logger.error(
                "Error en find_vehicle_type_id_by_name: %s", e, exc_info=True)
            return "Error al buscar el tipo de vehículo", None

        finally:
            cursor.close()

    @staticmethod
    def create_plate(plate_str: str, vehicle_type_id: int, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO PLATES (plate, vehicle_type_id)
        VALUES (%s, %s)
        """

        try:
            cursor.execute(query, (plate_str, vehicle_type_id))
            return None, True, "Placa registrada correctamente"

        except Exception as e:
            logger.error("Error en create_plate: %s", e, exc_info=True)
            return "Error al intentar registrar la placa", False, None

        finally:
            cursor.close()
