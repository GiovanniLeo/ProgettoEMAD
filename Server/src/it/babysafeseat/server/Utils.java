package it.babysafeseat.server;
import javax.servlet.http.HttpServletResponse;

public class Utils {

    public Utils() {}

    public void setHeaders(HttpServletResponse response){
        response.setHeader("Access-Control-Allow-Headers", "*");
        response.setHeader("Access-Control-Allow-Origin","*");
        response.setHeader("Access-Control-Allow-Methods", "DELETE, POST, GET, OPTIONS" );
        response.setStatus(HttpServletResponse.SC_OK);
    }
}
