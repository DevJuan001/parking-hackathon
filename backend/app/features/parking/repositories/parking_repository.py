from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.parking.models.parking_schemas import CreatePlateSchema, CreatePaymentSchema, ParkingFiltersSchema
from app.features.parking.models.parking_responses import PlateResponse, SpotResponse, PaymentResponse

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
    def find_all_spots(connection):
        cursor = connection.cursor()

        query = """
        SELECT
            spot_id,
            spot
        FROM SPOTS
        ORDER BY spot ASC
        """

        try:
            cursor.execute(query)
            results = cursor.fetchall()

            spots = [
                SpotResponse(
                    spot_id=item[0],
                    spot=item[1]
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
    def find_all_payments(filters_data: ParkingFiltersSchema, connection):
        data = filters_data.model_dump(exclude_none=True)

        cursor = connection.cursor()

        query = """
        SELECT
            pay.id,
            p.plate,
            s.spot,
            pay.value,
            pay.created_at
        FROM PAYMENTS AS pay
        INNER JOIN PLATES AS p ON p.id = pay.plate_id
        INNER JOIN SPOTS  AS s ON s.spot_id = pay.spot_id
        """

        filters = []
        values = []

        if "plate_id" in data:
            filters.append("pay.plate_id = %s")
            values.append(data["plate_id"])

        if "spot_id" in data:
            filters.append("pay.spot_id = %s")
            values.append(data["spot_id"])

        if "start_date" in data:
            filters.append("DATE(pay.created_at) >= %s")
            values.append(data["start_date"])

        if "end_date" in data:
            filters.append("DATE(pay.created_at) <= %s")
            values.append(data["end_date"])

        if filters:
            query += " WHERE " + " AND ".join(filters)

        query += " ORDER BY pay.created_at DESC"

        try:
            cursor.execute(query, values)
            results = cursor.fetchall()

            payments = [
                PaymentResponse(
                    id=item[0],
                    plate=item[1],
                    spot=item[2],
                    value=item[3],
                    created_at=date_formatter(item[4])
                )
                for item in results
            ]
            return None, payments

        except Exception as e:
            logger.error("Error en find_all_payments: %s", e, exc_info=True)
            return "Error al intentar obtener los pagos", None

        finally:
            cursor.close()

    @staticmethod
    def find_payment_by_id(payment_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT
            pay.id,
            p.plate,
            s.spot,
            pay.value,
            pay.created_at
        FROM PAYMENTS AS pay
        INNER JOIN PLATES AS p ON p.id = pay.plate_id
        INNER JOIN SPOTS  AS s ON s.spot_id = pay.spot_id
        WHERE pay.id = %s
        """

        try:
            cursor.execute(query, (payment_id,))
            result = cursor.fetchone()

            if not result:
                return "Pago no encontrado", None

            payment = PaymentResponse(
                id=result[0],
                plate=result[1],
                spot=result[2],
                value=result[3],
                created_at=date_formatter(result[4])
            )
            return None, payment

        except Exception as e:
            logger.error("Error en find_payment_by_id: %s", e, exc_info=True)
            return "Error al intentar obtener el pago", None

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

    @staticmethod
    def create_payment(payment_data: CreatePaymentSchema, connection):
        data = payment_data.model_dump()

        cursor = connection.cursor()

        query = """
        INSERT INTO PAYMENTS (plate_id, spot_id, value)
        VALUES (%s, %s, %s)
        """

        try:
            cursor.execute(query, (
                data["plate_id"],
                data["spot_id"],
                data["value"])
            )
            return None, True, "Pago registrado correctamente"

        except Exception as e:
            logger.error("Error en create_payment: %s", e, exc_info=True)
            return "Error al intentar registrar el pago", False, None

        finally:
            cursor.close()
