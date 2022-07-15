package com.tecgeo.geoitbibackend.calculo.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ValorDaEdificacaoService {
	
	private Double areaConstruida;
	
	@SuppressWarnings({"unchecked", "rawtypes"})
	public Object getValorDaEdificacao(Map<String, Object> objectMap) {
		
		//String areaConstruidaString = (String) ((Map<String, Object>) objectMap.get("caracteristicas")).get("area_construida");
		this.areaConstruida = (double) ((Map<String, Object>) objectMap.get("caracteristicas")).get("area_construida");;
		
		// ITEM 2.2 DA LEI COMPLEMENTAR DE SJR
		Double valorEdif;

		System.out.println(objectMap);

		valorEdif = areaConstruida * (double) objectMap.get("cub") * (0.2 + 0.8 * (double) objectMap.get("depreciacao"));

		
		return valorEdif;
	}

}
