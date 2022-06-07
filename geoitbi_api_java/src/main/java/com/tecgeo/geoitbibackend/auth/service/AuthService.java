package com.tecgeo.geoitbibackend.auth.service;

import java.util.Map;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import com.tecgeo.geoitbibackend.util.AuthToken;
import com.tecgeo.geoitbibackend.util.RequestUtil;

@Service
public class AuthService {

	@Autowired
	Environment env;
	
	@Autowired
	RequestUtil requestUtil;
	
    @SuppressWarnings({"unchecked"})
	public void autenticar() {
		try {
			String result = this.requestAutenticar();
    		JSONObject jsonObj = new JSONObject(result);
			Map<String, Object> map = new Gson().fromJson(jsonObj.toString(), Map.class);
            
			Map<String, String> subMap = (Map<String, String>) map.get("dados");
            String token = subMap.get("token");
            AuthToken.getInstance().setToken(token);
		} catch (Exception e) {
			e.printStackTrace();
		}
	}
	
	public String requestAutenticar() throws Exception {
        String url = env.getProperty("service.config.tecadmin.url") 
        		+ "/api/usuarios/autenticar";
        
        JsonObject args = new JsonObject();
        args.addProperty("username", env.getProperty("service.config.tecadmin.username"));
        args.addProperty("password", env.getProperty("service.config.tecadmin.password"));
      
		return requestUtil.sendPost(url, false, args);
	}
	
}
