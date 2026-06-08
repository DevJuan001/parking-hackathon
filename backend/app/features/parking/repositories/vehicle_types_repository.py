from app.utils.logger import get_logger

logger = get_logger("vehicle_types.repository")


class VehicleTypesRepository:

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
                "Error en find_vehicle_type_id_by_name: %s", e, exc_info=True
            )
            return "Error al buscar el tipo de vehículo", None

        finally:
            cursor.close()
