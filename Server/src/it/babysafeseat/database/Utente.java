package it.babysafeseat.database;

import org.json.JSONObject;

public class Utente {
  public Utente() {
    nome = null;
    cognome = null;
    email = null;
    password = null;
    tipo = null;
  }
  public Utente(String n, String c, String e, String p, String t) {
    nome = n;
    cognome = c;
    email = e;
    password = p;
    tipo = t;
  }
  
  
  public String getNome() {
    return nome;
  }


  public void setNome(String nome) {
    this.nome = nome;
  }


  public String getCognome() {
    return cognome;
  }


  public void setCognome(String cognome) {
    this.cognome = cognome;
  }


  public String getEmail() {
    return email;
  }


  public void setEmail(String email) {
    this.email = email;
  }


  public String getPassword() {
    return password;
  }


  public void setPassword(String password) {
    this.password = password;
  }


  public String getTipo() {
    return tipo;
  }


  public void setTipo(String tipo) {
    this.tipo = tipo;
  }


  public static Utente fromJson(JSONObject json) {
    Utente u = new Utente();
    
    u.setNome(json.getString("nome"));
    u.setCognome(json.getString("cognome"));
    u.setEmail(json.getString("email"));
    u.setPassword(json.getString("password"));
   // u.setTipo(json.getString("tipo"));
    
    return u;
  }
  
  @Override
  public String toString() {
    return "Nome: " + nome + 
        "\nCognome: " + cognome + 
        "\nEmail: " + email + 
        "\nPassword: " + password;
      //  "Tipo: " + (tipo=="An"?"Angelo":"Autista");
  }
  
  private String nome, cognome, email, password, tipo;
}
