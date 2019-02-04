package it.babysafeseat.server;

import java.io.IOException;
import java.util.logging.Logger;
import java.util.stream.Collectors;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.json.JSONException;
import org.json.JSONObject;
import it.babysafeseat.database.Queries;
import it.babysafeseat.database.Utente;

/**
 * Servlet implementation class Registrazione
 */
@WebServlet("/Registrazione")
public class Registrazione extends HttpServlet {
  private static final long serialVersionUID = 1L;
  private Logger log;

  public Registrazione() {
    super();
    log = Logger.getLogger("global");
  }

  protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
    //la richiesta è ricevuta come oggetto JSON, dal quale è possibile recuperare e controllare i parametri
    String textRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
    JSONObject jsonRequest = new JSONObject(textRequest);
    JSONObject jsonResponse = new JSONObject();

    Utente u = null;

    try {
      u = new Utente (jsonRequest);
    }catch(JSONException e){
      e.printStackTrace();
      u = null;
    }


    if(Queries.addUser(u)) {
      log.info("Utente inserito!");   
      jsonResponse.append("added", "true");
    } else {
      log.info("Problema con l'inserimento!");
      jsonResponse.append("added", "false");
    }

    response.getWriter().write(jsonResponse.toString());

  }

  //for Preflight
  @Override
  protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
      throws ServletException, IOException {
    resp.setHeader("Access-Control-Allow-Headers", "*");
    resp.setHeader("Access-Control-Allow-Origin", "*");
    resp.setStatus(HttpServletResponse.SC_OK);
  }

}
