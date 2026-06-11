package co.com.test.models;

public class CredencialesInicioSesion {
    private String usuario;
    private String clave;

    public String getUsuario(){
        return usuario;
    }
    public String getClave(){
        return clave;
    }
    public void setUsuario(String usuario) {
        this.usuario = usuario;
    }
    public void setClave(String clave) {
        this.clave = clave;
    }
}
