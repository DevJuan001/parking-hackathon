from pydantic import BaseModel, EmailStr


class LoginModelSchema(BaseModel):
    email: EmailStr
    password: str


class RecoverPasswordSchema(BaseModel):
    email: EmailStr


class VerifyRoleModelSchema(BaseModel):
    roles: list[str]


class RegisterSchema(BaseModel):
    parking_name: str
    parking_address: str
    name: str
    first_surname: str
    second_surname: str
    email: EmailStr
    password: str