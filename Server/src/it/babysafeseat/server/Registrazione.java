package it.babysafeseat.server;

import java.io.IOException;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.bson.Document;
import org.json.JSONObject;
import com.mongodb.client.MongoCollection;

import it.babysafeseat.database.DatabaseManager;
import it.babysafeseat.database.Utente;

/**
 * Servlet implementation class Registrazione
 */
@WebServlet("/Registrazione")
public class Registrazione extends HttpServlet {
  private static final long serialVersionUID = 1L;
  private Logger log;
  /**
   * @see HttpServlet#HttpServlet()
   */
  public Registrazione() {
    super();
    log = Logger.getLogger("global");
  }


  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    //la richiesta è ricevuta come oggetto JSON, dal quale è possibile recuperare e controllare i parametri
    String textRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    JSONObject jsonRequest = new JSONObject(textRequest);

    Utente u = Utente.fromJson(jsonRequest);

    if(addUser(u)) {

      log.info("Utente inserito!");      
    } else {

      log.info("Problema con l'inserimento!");
    }
    
  }

  private boolean addUser(Utente u) {
    //utente è inizializzato a null, per il checking di eventuali errori
    if(u.getNome() == null || u.getCognome() == null || u.getEmail() == null || u.getPassword() == null) return false;
   
    MongoCollection<Document> users = DatabaseManager.getUsers(); 
    Document userDocument = new Document().append("Nome", u.getNome())
        .append("Cognome", u.getCognome())
        .append("Email", u.getEmail())
        .append("Password", u.getPassword());


    users.insertOne(userDocument);
    return true;
  }

}
