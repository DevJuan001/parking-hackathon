# language: es

Característica: Crear Plaza
  Como administrador
  Quiero crear una nueva plaza en el sistema
  Para poder gestionar los espacios del parking

  @crear-plaza
  Escenario: Crear una nueva plaza exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Parking
    Cuando crea una nueva plaza
    Entonces deberia ver la plaza en la tabla
