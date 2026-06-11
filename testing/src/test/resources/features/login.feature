# language: es
# author: Rigoberto Vargas

Característica: Inicio de sesión
  Como usuario registrado
  quiero iniciar sesión en la aplicación
  para poder acceder a mi cuenta

  @autenticacion
  Escenario: Verificar autenticación exitosa en Traclinker
    Dado que el usuario está en la página de inicio de sesión
    Cuando el usuario ingresa credenciales válidas
      | usuario             | clave        |
      |juanesyt7@gmail.com |J%a2tojIk4NR |
    Entonces el usuario debería estar en la pagina de bienvenida

