package com.tecgeo.geoitbibackend.calculo.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class CustoUnitarioBasicoService {
	
	private String tipologia;
	private String padraoConstrucao;
	private String estrutura;
	
	@SuppressWarnings("unchecked")
	public Object getCustoUnitarioBasico(Map<String, Object> objectMap) {
		
		this.tipologia = (String) ((Map<String,Object>) objectMap.get("caracteristicas")).get("tipologia").toString().toUpperCase();
		this.padraoConstrucao = (String) ((Map<String, Object>) objectMap.get("caracteristicas")).get("padraoconstrucao");
		System.out.println(this.padraoConstrucao);
		
		if(this.tipologia.equals("COM/RESIDÊNCIA") || this.tipologia.equals("SALA/CONJUNTO") || this.tipologia.equals("EDI. COMERCIAL")) {
			this.tipologia = "LOJA";
		}
		
		if(this.tipologia.equals("GALPÃO") || this.tipologia.equals("EDICULA") || this.tipologia.equals("POSTO DE SERVIÇO") || this.tipologia.equals("GARAGEM")) {
			this.tipologia = "TELHEIRO";
		}
		
	    Double fatorCorrecao;

		fatorCorrecao = (Double) ((Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) objectMap.get("fatorCorrecao")).get("FATOR_CORRECAO")).get(this.tipologia)).get(this.padraoConstrucao);
	    	    
	    Double resultCub = fatorCorrecao * 1254.77;
		
		return resultCub;
	}

}
