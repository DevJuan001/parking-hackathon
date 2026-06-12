# language: es

Característica: Crear Entrada como Cliente
  Como cliente
  Quiero ingresar mi placa en el check-in
  Para registrar el ingreso de mi vehiculo al parqueadero

  @crear-entrada-cliente
  Escenario: Crear una nueva entrada desde la interfaz del cliente
    Cuando el cliente ha iniciado sesion
    Cuando ingresa su placa en el check-in
    Entonces deberia ver el mensaje de agradecimiento
