# language: es

Característica: Crear Piso
  Como administrador
  Quiero crear un nuevo piso en el sistema
  Para poder gestionar los niveles del parking

  @crear-piso
  Escenario: Crear un nuevo piso exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Parking
    Cuando crea un nuevo piso
    Entonces deberia ver el mensaje de exito
