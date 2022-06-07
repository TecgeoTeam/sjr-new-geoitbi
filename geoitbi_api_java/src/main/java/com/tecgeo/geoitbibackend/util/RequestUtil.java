package com.tecgeo.geoitbibackend.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

import org.apache.http.HttpResponse;
import org.apache.http.HttpStatus;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.HttpClientBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import com.google.gson.JsonObject;
import com.tecgeo.geoitbibackend.auth.service.AuthService;

@Component
public class RequestUtil {

	@Autowired
	AuthService authService;
	
	public String sendPost(String url, Boolean auth, JsonObject args) throws Exception {
		HttpClient client = HttpClientBuilder.create().build();
		HttpPost post = new HttpPost(url);
		
		if (auth) {
			post.addHeader("Authorization", "Bearer " + AuthToken.getInstance().getToken());
		}
		
		post.setHeader("Content-Type", "application/json;charset=UTF-8");
		
		try {
			post.setEntity(new StringEntity(args.toString()));
			HttpResponse response = client.execute(post);

			InputStream ips  = response.getEntity().getContent();
			BufferedReader buf = new BufferedReader(new InputStreamReader(ips,"UTF-8"));
			int status = response.getStatusLine().getStatusCode();
			if (status == HttpStatus.SC_CREATED || status == HttpStatus.SC_OK) {
				StringBuilder sb = new StringBuilder();
				String s;
				while(true) {
					s = buf.readLine();
					if(s==null || s.length()==0)
						break;
					sb.append(s);
				}
				buf.close();
				ips.close();
				return sb.toString();
			} else if (status == HttpStatus.SC_FORBIDDEN) {
				authService.autenticar();
				this.sendPost(url, auth, args);
			} else {
				throw new Exception(response.getStatusLine().getReasonPhrase());
			}
			
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
}
