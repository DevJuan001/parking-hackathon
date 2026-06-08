from datetime import datetime
from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.core.database import get_connection
from app.utils.date_formatter import date_formatter
from app.features.entries.repositories.entries_repository import EntriesRepository
from app.features.exits.repositories.exits_repository import ExitsRepository
from app.features.parking.repositories.plates_repository import PlatesRepository
from app.features.payments.repositories.payments_repository import PaymentsRepository
from app.features.tariffs.repositories.tariffs_repository import TariffsRepository
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
            plate_text = plate.replace("-", "").strip().upper()

            error, plate_data = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error or not plate_data:
                raise ServiceError(error or "Placa no encontrada")

            plate_id = plate_data.id
            vehicle_type = plate_data.vehicle_type

            error, entry = EntriesRepository.find_latest_entry(
                plate_id, connection
            )

            if error or not entry:
                raise ServiceError(
                    error or "No se encontró un ingreso para esta placa")

            entry_time = entry["created_at"]

            exit_time = datetime.now()

            diff = exit_time - entry_time
            hours_parked = round(diff.total_seconds() / 3600, 2)

            error, rate = TariffsRepository.find_rate_by_vehicle_type(
                vehicle_type, connection
            )

            if error or not rate:
                raise ServiceError(error or "Tarifa no encontrada")

            rate_value = rate["value"]
            total = round(hours_parked * rate_value, 2)

            return None, {
                "plate": plate_data.plate,
                "entry_time": date_formatter(entry_time),
                "exit_time": date_formatter(exit_time),
                "hours_parked": hours_parked,
                "rate_value": rate_value,
                "total": total
            }

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
            plate_text = payment_data.plate.replace("-", "").strip().upper()

            error, plate_list = PlatesRepository.get_plate_by_name(
                plate_text, connection
            )

            if error or not plate_list:
                raise ServiceError(error or "Placa no encontrada")

            plate_id = plate_list[0].id

            error, entry = EntriesRepository.find_latest_entry(
                plate_id, connection
            )

            if error or not entry:
                raise ServiceError(
                    error or "No se encontró un ingreso para esta placa")

            entry_time = entry["created_at"]
            exit_time = datetime.now()

            diff = exit_time - entry_time
            hours_parked = round(diff.total_seconds() / 3600, 2)

            error, rate = TariffsRepository.find_first_rate(connection)

            if error or not rate:
                raise ServiceError(error or "Tarifa no encontrada")

            value = round(hours_parked * rate["value"], 2)

            error, _, _ = ExitsRepository.create_exit(
                plate_id, connection
            )

            if error:
                raise ServiceError(error)

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
