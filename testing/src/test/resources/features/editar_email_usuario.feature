# language: es

Característica: Editar Email de Usuario
  Como administrador
  Quiero editar el email de un usuario existente
  Para poder actualizar su direccion de correo

  @editar-email-usuario
  Escenario: Editar email de usuario exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Usuarios
    Cuando edita un usuario
    Cuando edita el email del usuario
    Entonces deberia ver el mensaje de exito
