package it.babysafeseat.database;

import org.json.JSONException;
import org.json.JSONObject;

public class Utente {
  /**
   * Create a new void user.
   * All the params are setted to null.
   */
  public Utente() {
    nome = null;
    cognome = null;
    email = null;
    password = null;
    ruolo = null;
    citta = null;
  }
  
  /**
   * Create a new void user giving all the params
   * @param n The name of the user.
   * @param c The surname of the user.
   * @param e The email of the user.
   * @param p The password of the user.
   * @param r The role of the user in the app.
   * @param ci The city of the user.
   */
  public Utente(String n, String c, String e, String p, String r, String  ci) {
    nome = n;
    cognome = c;
    email = e;
    password = p;
    ruolo = r;
    citta = ci;
  }

  /**
   * Create a new user by a JSON
   * @param jsonUser the new user in JSON format
   * @throws JSONException if something wrong, should be catched to check the errors
   */
  public Utente(JSONObject jsonUser) throws JSONException{

    nome = jsonUser.getString("nome");
    cognome = jsonUser.getString("cognome");
    email = jsonUser.getString("email");
    password = jsonUser.getString("password");

    if(jsonUser.getInt("ruolo") == 0) ruolo = "Au";
    else ruolo = "An";

    citta = jsonUser.getJSONObject("citta").getString("comune");    

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


  public String getRuolo() {
    return ruolo;
  }


  public void setRuolo(String ruolo) {
    this.ruolo = ruolo;
  }

  public String getCitta() {
    return citta;
  }


  public void setCitta(String citta) {
    this.citta = citta;
  }

  @Override
  public String toString() {
    return "Nome: " + nome + 
        "\nCognome: " + cognome + 
        "\nEmail: " + email + 
        "\nPassword: " + password +
        "\nRuolo: " + (ruolo=="An"?"Angelo":"Autista") +
        "\nCitta: " + citta;
  }

  private String nome, cognome, email, password, ruolo, citta;
}
