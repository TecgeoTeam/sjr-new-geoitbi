package com.tecgeo.geoitbibackend.calculo.service;

import java.util.ArrayList;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class ValorDaEdificacaoService {
	
	private Double areaConstruida;
	
	@SuppressWarnings({"unchecked", "rawtypes"})
	public Object getValorDaEdificacao(Map<String, Object> objectMap) {
		
		String areaConstruidaString = (String)  ((Map<String,Object>) ((ArrayList) ((Map<String,Object>) objectMap.get("imovelWSTINUS")).get("bci_componentes")).get(0)).get("componente_area_construida");
		this.areaConstruida = Double.parseDouble(areaConstruidaString.replace(".", "").replace(",","."));
		
		// ITEM 2.2 DA LEI COMPLEMENTAR DE SJR
		Double valorEdif;

		valorEdif = areaConstruida * (double) objectMap.get("cub") * (0.2 + 0.8 * (double) objectMap.get("depreciacao"));

		
		return valorEdif;
	}

}
