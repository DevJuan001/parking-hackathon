# language: es

Característica: Crear Usuario
  Como administrador
  Quiero crear un nuevo usuario en el sistema
  Para poder gestionar los accesos al sistema

  @crear-usuario
  Escenario: Crear un nuevo usuario exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Usuarios
    Cuando crea un nuevo usuario
    Entonces deberia ver el mensaje de exito
