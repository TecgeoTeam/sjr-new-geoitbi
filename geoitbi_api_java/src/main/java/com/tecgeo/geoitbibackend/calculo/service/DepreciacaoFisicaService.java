package com.tecgeo.geoitbibackend.calculo.service;

import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class DepreciacaoFisicaService {
	
	private Double idade;
	private String conservacao;
	
	@SuppressWarnings("unchecked")
	public Object getDepreciacaoFisica(Map<String, Object> objectMap) {
		
		//this.idade = (Double) ((Map<String, Object>) objectMap.get("imovelWSTINUS")).get("imovel_idade");
		//IDADE = DATA DO CADASTRO
		this.idade = 1.0;
		this.conservacao = ((Map<String, Object>) objectMap.get("caracteristicas")).get("conservacao").toString();
		
	    if (idade.equals(0.0)) {
	    	idade = (double) 2;
	    }
	    if (idade > 99) {
	    	idade = (double) 100;
	    }
	    
		Map<String, Object> coef = (Map<String, Object>) ((Map<String,Object>) objectMap.get("parametros")).get("coeficienteDepreciacao");
		
		Double idadeFl = idade / 80.0;
	    Double round = (double) Math.round(idadeFl * 100.0);
	    if (round % 2 != 0) {
	        if (round == 1) {
	            round = (double) 2;
	        } else {
	            round = round - 1;
	        }
	    }
	    Double vidaReferencial = round;
	    if (vidaReferencial > 100) {
	        vidaReferencial = (double) 100;
	    }
	    
	    Integer vidaRefInt = vidaReferencial.intValue();
	    
		return ((Map<String,Object>) coef.get(vidaRefInt.toString())).get(conservacao.toLowerCase());
	}

}
