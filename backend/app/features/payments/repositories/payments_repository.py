from datetime import datetime
from app.utils.logger import get_logger
from app.utils.date_formatter import date_formatter
from app.features.payments.models.payments_schemas import PaymentsFiltersSchema
from app.features.payments.models.payments_responses import PaymentResponse

logger = get_logger("payments.repository")


class PaymentsRepository:

    @staticmethod
    def find_all_payments(filters_data: PaymentsFiltersSchema, connection):
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
    def find_payments_by_plate(plate_id: int, connection):
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
        WHERE pay.plate_id = %s
        ORDER BY pay.created_at DESC
        """

        try:
            cursor.execute(query, (plate_id,))
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
            logger.error("Error en find_payments_by_plate: %s", e, exc_info=True)
            return "Error al intentar obtener los pagos de la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_plate_by_plate_str(plate_str: str, connection):
        cursor = connection.cursor()

        query = """
        SELECT p.id, p.plate, vt.name
        FROM PLATES AS p
        INNER JOIN VEHICLE_TYPES AS vt ON vt.id = p.vehicle_type_id
        WHERE p.plate = %s
        """

        try:
            cursor.execute(query, (plate_str,))
            result = cursor.fetchone()

            if not result:
                return "Placa no encontrada", None

            return None, {"id": result[0], "plate": result[1], "vehicle_type": result[2]}

        except Exception as e:
            logger.error("Error en find_plate_by_plate_str: %s", e, exc_info=True)
            return "Error al buscar la placa", None

        finally:
            cursor.close()

    @staticmethod
    def find_latest_entry(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT id, created_at
        FROM ENTRIES
        WHERE plate_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """

        try:
            cursor.execute(query, (plate_id,))
            result = cursor.fetchone()

            if not result:
                return "No se encontró un ingreso para esta placa", None

            return None, {"id": result[0], "created_at": result[1]}

        except Exception as e:
            logger.error("Error en find_latest_entry: %s", e, exc_info=True)
            return "Error al buscar el último ingreso", None

        finally:
            cursor.close()

    @staticmethod
    def find_latest_exit(plate_id: int, connection):
        cursor = connection.cursor()

        query = """
        SELECT id, created_at
        FROM EXITS
        WHERE plate_id = %s
        ORDER BY created_at DESC
        LIMIT 1
        """

        try:
            cursor.execute(query, (plate_id,))
            result = cursor.fetchone()

            if not result:
                return None, None

            return None, {"id": result[0], "created_at": result[1]}

        except Exception as e:
            logger.error("Error en find_latest_exit: %s", e, exc_info=True)
            return "Error al buscar la última salida", None

        finally:
            cursor.close()

    @staticmethod
    def find_rate_by_vehicle_type(vehicle_type: str, connection):
        cursor = connection.cursor()

        query = "SELECT id, value FROM RATES WHERE vehicle_type = %s LIMIT 1"

        try:
            cursor.execute(query, (vehicle_type,))
            result = cursor.fetchone()

            if not result:
                return "Tarifa no encontrada para ese tipo de vehículo", None

            return None, {"id": result[0], "value": result[1]}

        except Exception as e:
            logger.error("Error en find_rate_by_vehicle_type: %s", e, exc_info=True)
            return "Error al buscar la tarifa", None

        finally:
            cursor.close()

    @staticmethod
    def find_first_rate(connection):
        cursor = connection.cursor()

        query = "SELECT id, vehicle_type, value FROM RATES LIMIT 1"

        try:
            cursor.execute(query)
            result = cursor.fetchone()

            if not result:
                return "No hay tarifas registradas", None

            return None, {"id": result[0], "vehicle_type": result[1], "value": result[2]}

        except Exception as e:
            logger.error("Error en find_first_rate: %s", e, exc_info=True)
            return "Error al buscar la tarifa", None

        finally:
            cursor.close()

    @staticmethod
    def create_payment(plate_id: int, spot_id: int, value: float, connection):
        cursor = connection.cursor()

        query = """
        INSERT INTO PAYMENTS (plate_id, spot_id, value)
        VALUES (%s, %s, %s)
        """

        try:
            cursor.execute(query, (plate_id, spot_id, value))
            return None, True, "Pago registrado correctamente"

        except Exception as e:
            logger.error("Error en create_payment: %s", e, exc_info=True)
            return "Error al intentar registrar el pago", False, None

        finally:
            cursor.close()
