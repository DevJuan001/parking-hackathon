from datetime import datetime
from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.utils.date_formatter import date_formatter
from app.utils.plate_formatter import plate_formatter
from app.features.exits.repositories.exits_repository import ExitsRepository
from app.features.parking.repositories.plates_repository import PlatesRepository
from app.features.tariffs.repositories.tariffs_repository import TariffsRepository
from app.features.entries.repositories.entries_repository import EntriesRepository
from app.features.payments.models.payments_responses import CalculatePaymentResponse
from app.features.payments.repositories.payments_repository import PaymentsRepository
from app.features.payments.models.payments_schemas import CreatePaymentSchema, PaymentsFiltersSchema

logger = get_logger("payments.service")


class PaymentsService:

    @staticmethod
    def get_all_payments(filters: PaymentsFiltersSchema):
        connection = get_connection()

        try:
            error, payments = PaymentsRepository.find_all_payments(
                filters, connection
            )

            if error:
                raise ServiceError(error)

            return None, payments

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_all_payments: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los pagos", None

        finally:
            connection.close()

    @staticmethod
    def get_payment_by_id(payment_id: int):
        connection = get_connection()

        try:
            error, payment = PaymentsRepository.find_payment_by_id(
                payment_id, connection
            )

            if error or not payment:
                raise ServiceError(error)

            return None, payment

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_payment_by_id: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener el pago", None

        finally:
            connection.close()

    @staticmethod
    def get_payments_by_plate(plate_id: int):
        connection = get_connection()

        try:
            error, payments = PaymentsRepository.find_payments_by_plate(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

            return None, payments

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en get_payments_by_plate: %s",
                e,
                exc_info=True
            )
            return "Error al intentar obtener los pagos de la placa", None

        finally:
            connection.close()

    @staticmethod
    def calculate_payment(plate: str):
        connection = get_connection()

        try:
            # Formateamos la placa
            plate_text = plate_formatter(plate)

            # Buscamos si la placa esta registrada
            error, plate_data = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error or not plate_data:
                raise ServiceError(error or "Placa no encontrada")

            plate_id = plate_data[0].id
            vehicle_type = plate_data[0].vehicle_type

            # Buscamos la entrada mas reciente del vehiculo
            error, entry = EntriesRepository.find_latest_entry(
                plate_id, connection
            )

            if error or not entry:
                raise ServiceError(
                    error or "No se encontró un ingreso para esta placa"
                )

            # Establecemos el tiempo cuando entro
            entry_time = entry["created_at"]

            # Establecemos que el tiempo de salida es el actual
            exit_time = datetime.now()

            # Calculamos la diferencia de tiempo entre la entrada y al salida
            diff = exit_time - entry_time

            # Redondeamos el tiempo que duro parqueado el vehiculo
            hours_parked = round(diff.total_seconds() / 3600, 2)

            # Buscamos la tarifa por el tipo de vehiculo
            error, rate = TariffsRepository.find_rate_by_vehicle_type(
                vehicle_type, connection
            )

            if error or not rate:
                raise ServiceError(error or "Tarifa no encontrada")

            rate_value = rate["value"]

            # Redondeamos el valor a cobrarle al vehiculo
            total = round(hours_parked * rate_value, 2)

            return None, CalculatePaymentResponse(
                plate=plate_data[0].plate,
                entry_time=date_formatter(entry_time),
                exit_time=date_formatter(exit_time),
                hours_parked=hours_parked,
                rate_value=rate_value,
                total=total
            )

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error(
                "Error en calculate_payment: %s",
                e,
                exc_info=True
            )
            return "Error al calcular el pago", None

        finally:
            connection.close()

    @staticmethod
    async def create_payment(payment_data: CreatePaymentSchema):
        connection = get_connection()

        try:
            plate_text = plate_formatter(payment_data.plate)

            # Buscamos si esta registrada la placa
            error, plate_list = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error or not plate_list:
                raise ServiceError(error or "Placa no encontrada")

            plate_id = plate_list[0].id
            vehicle_type = plate_list[0].vehicle_type

            # Buscamos la entrada mas reciente
            error, entry = EntriesRepository.find_latest_entry(
                plate_id, connection
            )

            if error or not entry:
                raise ServiceError(
                    error or "No se encontró un ingreso para esta placa")

            # Almacenamos la hora a la que entro el vehiculo
            entry_time = entry["created_at"]

            # Establecemos que el tiempo de salida es el actual
            exit_time = payment_data.exit_time

            diff = exit_time - entry_time

            # Redondeamos las horas que duro parqueado el vehiculo
            hours_parked = round(diff.total_seconds() / 3600, 2)

            # Buscamos el valor de la tarifa según el tipo de vehiculo
            error, rate = TariffsRepository.find_rate_by_vehicle_type(
                vehicle_type, connection
            )

            if error or not rate:
                raise ServiceError(error or "Tarifa no encontrada")

            # Redondeamos el valor a pagar
            value = round(hours_parked * rate["value"], 2)

            # Registramos la salida del vehiculo
            error, success, message = ExitsRepository.create_exit(
                plate_id, connection
            )

            if error or not success:
                raise ServiceError(
                    error or "Error al intentar crear la salida"
                )

            # Registramos el pago
            error, success, message = PaymentsRepository.create_payment(
                plate_id=plate_id,
                spot_id=entry["spot_id"],
                value=value,
                connection=connection
            )

            if error or not success:
                raise ServiceError(error)

            connection.commit()

            return None, True, "Pago registrado correctamente"

        except ServiceError as e:
            connection.rollback()
            return e.message, False, None

        except Exception as e:
            connection.rollback()
            logger.error(
                "Error en create_payment: %s",
                e,
                exc_info=True
            )
            return "Error al intentar registrar el pago", False, None

        finally:
            connection.close()
