package com.tecgeo.geoitbibackend.util;

public class AuthToken {	 
	private String token;
    public static AuthToken instance;
 
    protected AuthToken() {
    	//Construtor vazio Singleton
    }
 
    public static AuthToken getInstance() {
        if (instance == null) {
        	instance = new AuthToken();
        }
        
        return instance;
    }

	public String getToken() {
		return token;
	}

	public void setToken(String token) {
		this.token = token;
	}
    
}
