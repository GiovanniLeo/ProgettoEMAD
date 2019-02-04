package it.babysafeseat.database;

import org.bson.Document;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

public class Queries {
  public static boolean addUser(Utente u) {
    //user is initialized to null, for error checking
    if(u == null) return false;
    if(u.getNome() == null || u.getCognome() == null || u.getEmail() == null || u.getPassword() == null) return false;

    MongoCollection<Document> users = DatabaseManager.getUsers(); 

    if(users==null) return false;

    Document userDocument = new Document()
        .append("Nome", u.getNome())
        .append("Cognome", u.getCognome())
        .append("Email", u.getEmail())
        .append("Password", u.getPassword())
        .append("Ruolo", u.getRuolo())
        .append("Citta", u.getCitta());


    users.insertOne(userDocument);
    return true;
  }
  
  
  public static boolean checkLogin(String email, String password) {
    if(email == null || password == null) return false;
    
    Document loginQuery = new Document().append("Email", email).append("Password", password);

    MongoCollection<Document> coll = DatabaseManager.getUsers();
    
    FindIterable<Document> users = coll.find(loginQuery);
    
    //if the user exists (it's just one), returns true
    if(users.iterator().hasNext()) return true;
    else return false;
  }
}
