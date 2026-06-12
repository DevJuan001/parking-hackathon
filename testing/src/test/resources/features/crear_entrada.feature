# language: es

Característica: Crear Entrada
  Como administrador
  Quiero crear una nueva entrada en el sistema
  Para poder registrar el ingreso de vehiculos

  @crear-entrada
  Escenario: Crear una nueva entrada exitosamente
    Cuando el usuario ha iniciado sesion
    Cuando navega a la seccion Entradas
    Cuando crea una nueva entrada
    Entonces deberia ver el mensaje de exito
