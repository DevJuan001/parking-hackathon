# language: es

Característica: Cambiar Estado de Usuario
  Como administrador
  Quiero cambiar el estado de un usuario existente
  Para poder habilitar o deshabilitar su acceso al sistema

  @cambiar-estado-usuario
  Escenario: Cambiar estado de usuario exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Usuarios
    Cuando cambia el estado de un usuario
    Entonces deberia ver el cambio de estado en la tabla
