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

/**
 * Servlet implementation class Login
 */
@WebServlet("/Login")
public class Login extends HttpServlet {
    private static final long serialVersionUID = 1L;
    private Logger log;
    private Utils utils = new Utils();

    public Login() {
        super();

        log = Logger.getLogger("global");
    }

    protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        String textRequest = request.getReader().lines().collect(Collectors.joining(System.lineSeparator()));
        JSONObject jsonRequest = new JSONObject(textRequest);
        JSONObject jsonResponse = new JSONObject();

        String email, password;
        response.setContentType("application/json");
        try {
            email = jsonRequest.getString("email");
            password = jsonRequest.getString("password");
        }catch(JSONException e) {
            email = null;
            password = null;
        }

        if(Queries.checkLogin(email, password)) {
            log.info("User found");
            jsonResponse.append("found", "true");
        }else {
            log.info("User not found");
            jsonResponse.append("found", "false");
        }


        this.utils.setHeaders(response);

        response.getWriter().write(jsonResponse.toString());
    }

    //for Preflight
    @Override
    protected void doOptions(HttpServletRequest req, HttpServletResponse resp)
            throws ServletException, IOException {
        resp.setHeader("Access-Control-Allow-Headers", "*");
        resp.setHeader("Access-Control-Allow-Origin","*");
        resp.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS" );

        resp.setStatus(HttpServletResponse.SC_OK);
    }
}
