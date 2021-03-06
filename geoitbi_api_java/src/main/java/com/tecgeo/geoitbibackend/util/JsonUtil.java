package com.tecgeo.geoitbibackend.util;

import java.io.IOException;
import java.io.InputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.Scanner;

import org.springframework.stereotype.Component;

@Component
public class JsonUtil {
	
	// TODO transformar esse json string em uma tabela no banco ou um objeto separado de parametros.
		
	  private static String streamToString(InputStream inputStream) {
		    @SuppressWarnings("resource")
			String text = new Scanner(inputStream, "UTF-8").useDelimiter("\\Z").next();
		    return text;
		  }

		  public static String jsonGetRequest(String urlQueryString) {
		    String json = null;
		    try {
		      URL url = new URL(urlQueryString);
		      HttpURLConnection connection = (HttpURLConnection) url.openConnection();
		      connection.setDoOutput(true);
		      connection.setInstanceFollowRedirects(false);
		      connection.setRequestMethod("GET");
		      connection.setRequestProperty("Content-Type", "application/json");
		      connection.setRequestProperty("charset", "utf-8");
		      connection.connect();
		      InputStream inStream = connection.getInputStream();
		      json = streamToString(inStream); // input stream to string
		    } catch (IOException ex) {
		      ex.printStackTrace();
		    }
		    return json;
		  }

}
