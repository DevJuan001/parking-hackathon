from datetime import timedelta

import jwt
from jwt import PyJWTError
from pydantic import EmailStr
from fastapi import Request, Response

from app.core.config import settings
from app.utils.logger import get_logger
from app.core.exception import ServiceError
from app.tasks.email_tasks import recovery_password_email
from app.features.parking.services.parking_service import ParkingService
from app.features.users.services.users_service import UsersService
from app.features.auth.models.auth_schema import RegisterSchema, VerifyRoleModelSchema
from app.core.security import create_access_token, create_refresh_token, set_auth_cookies, verify_password

logger = get_logger("auth.service")


class AuthService:
    @staticmethod
    def login(email: str, password: str, response: Response):
        try:
            error, user = UsersService.get_user_by_email(email)

            if error or not user:
                raise ServiceError(error)

            # Validación de los parametros recibidos
            if not verify_password(user[6], password):
                raise ServiceError("Contraseña incorrecta")

            # Tiempo en que expira el token
            expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE)

            # Creación del token
            access_token = create_access_token({
                "sub": str(user[1]),
                "role": user[0]
            },
                expires_delta=expires
            )

            refresh_token = create_refresh_token({
                "sub": str(user[1]),
                "role": user[0]
            }
            )

            set_auth_cookies(response, access_token, refresh_token)

            return None, True, "Inicio de sesión exitoso"

        except ServiceError as e:
            return e.message, False, "No autorizado"

        except Exception as e:
            logger.error("Error en login: %s", e, exc_info=True)
            return "No autorizado", False, None

    @staticmethod
    async def register(data: RegisterSchema, response: Response):
        try:
            error, parking_id, parking_message = ParkingService.create_parking(
                name=data.parking_name,
                address=data.parking_address
            )

            if error or not parking_id:
                raise ServiceError(error or parking_message)

            error, user_id, role_name, user_message = await UsersService.create_user_with_password(
                name=data.name,
                first_surname=data.first_surname,
                second_surname=data.second_surname,
                email=data.email,
                password=data.password,
                parking_id=parking_id
            )

            if error or not user_id or not role_name:
                raise ServiceError(error or user_message)

            expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE)

            access_token = create_access_token(
                {"sub": str(user_id), "role": role_name},
                expires_delta=expires
            )

            refresh_token = create_refresh_token(
                {"sub": str(user_id), "role": role_name}
            )

            set_auth_cookies(response, access_token, refresh_token)

            return None, True, "Registro exitoso"

        except ServiceError as e:
            return e.message, False, None

        except Exception as e:
            logger.error("Error en register: %s", e, exc_info=True)
            return "Error al intentar registrar el usuario", False, None

    @staticmethod
    def refresh_tokens(request: Request, response: Response):
        refresh_token = request.cookies.get("refresh_token")

        if not refresh_token:
            raise ServiceError("Refresh token no encontrado")

        try:
            payload = jwt.decode(
                refresh_token,
                settings.REFRESH_TOKEN_SECRET_KEY,
                algorithms=[settings.ALGORITHM]
            )
            user_id = payload.get("sub")

            if not user_id:
                raise ServiceError("Refresh token inválido")

            new_access_token = create_access_token({
                "sub": str(user_id),
                "role": payload.get("role")
            },
                expires_delta=timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE)
            )

            new_refresh_token = create_refresh_token({
                "sub": user_id,
                "role": payload.get("role")
            })

            set_auth_cookies(response, new_access_token, new_refresh_token)

            return None, True, "Tokens actualizados correctamente"

        except PyJWTError:
            raise ServiceError(
                "Refresh token expirado o inválido"
            )

        except ServiceError as e:
            return e.message, False, None

        except Exception as e:
            logger.error("Error en refresh_tokens: %s", e, exc_info=True)
            return "Error al intentar refrezcar los tokens", False, None

    @staticmethod
    def verify_roles(body: VerifyRoleModelSchema, payload: dict):
        try:
            user_role = payload.get("role")
            roles = body.roles

            if user_role not in roles:
                raise ServiceError("No autorizado")

            return None, True

        except ServiceError as e:
            return e.message, None

        except Exception as e:
            logger.error("Error en verify_roles: %s", e, exc_info=True)
            return "Error al intentar verificar los roles", None

    @staticmethod
    def logout(response: Response):
        try:
            response.delete_cookie(
                key="access_token",
                path="/"
            )

            response.delete_cookie(
                key="refresh_token",
                path="/api/auth/refresh"
            )

            return None, True, "Sesión cerrada exitosamente"

        except Exception as e:
            logger.error("Error en logout: %s", e, exc_info=True)
            return "Error al intentar cerrar la sesión", False, None

    @staticmethod
    def recover_password(email: EmailStr):
        try:
            error, user = UsersService.get_user_by_email(email)

            if user:
                recovery_password_email.delay(
                    user_email=email,
                    user_name=user[2]
                )

        except Exception:
            pass

        return True, "Correo enviado correctamente"
