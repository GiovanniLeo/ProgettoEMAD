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
import org.json.JSONException;
import org.json.JSONObject;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoCollection;

import it.babysafeseat.database.DatabaseManager;

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
  private static final long serialVersionUID = 1L;
  private Logger log;

  public Login() {
    super();

    log = Logger.getLogger("global");
  }


  /**
   * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
   */
  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {

    String textRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    JSONObject jsonRequest = new JSONObject(textRequest);
    JSONObject jsonResponse = new JSONObject();
    
    String email, password;
    
    try {
      email = jsonRequest.getString("email");
      password = jsonRequest.getString("password");
    }catch(JSONException e) {
      email = null;
      password = null;
    }
    
    if(checkLogin(email, password)) {
      log.info("L'utente esiste!");
      jsonResponse.append("found", "true");
    }else {
      log.info("L'utente non esiste!");
      jsonResponse.append("found", "false");
    }
    
    response.getWriter().write(jsonResponse.toString());
  }

  private boolean checkLogin(String email, String password) {
    if(email == null || password == null) return false;
    
    Document loginQuery = new Document().append("Email", email).append("Password", password);

    MongoCollection<Document> coll = DatabaseManager.getUsers();
    
    FindIterable<Document> users = coll.find(loginQuery);
    
    //if the user exists (it's just one), returns true
    if(users.iterator().hasNext()) return true;
    
    return false;
  }
}
