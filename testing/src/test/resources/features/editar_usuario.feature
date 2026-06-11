# language: es

Característica: Editar Usuario
  Como administrador
  Quiero editar un usuario existente en el sistema
  Para poder actualizar su informacion

  @editar-usuario
  Escenario: Editar un usuario exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Usuarios
    Cuando edita un usuario
    Entonces deberia ver el mensaje de exito
    Cuando cierra el modal de confirmacion
