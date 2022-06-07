package com.tecgeo.geoitbibackend.calculo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class CaracteristicasImovelWSService {
	
	@SuppressWarnings({"unchecked", "rawtypes"})
	public Object buildCaracteristicasImovel(Map<String, Object> objectMap) {
		
		/*TODO Tratar as exceções das caracteristicas*/
			
		HashMap<String, Object> imovel = (HashMap<String, Object>) objectMap.get("imovelWSTINUS");
		
		Map<String, Object> caracteristicas = new HashMap<>();
		
		List<Object> componenteCaracteristicas =  (List<Object>) ((Map<String,Object>) ((ArrayList) ((Map<String,Object>) objectMap.get("imovelWSTINUS")).get("bci_componentes")).get(0)).get("componente_caracteristicas");
		
		for (int i = 0; i < componenteCaracteristicas.size(); i++) {
			caracteristicas.put(((Map<String,Object>) componenteCaracteristicas.get(i)).get("nome").toString().toLowerCase(), ((Map<String,Object>) componenteCaracteristicas.get(i)).get("conteudo").toString().toLowerCase());
			
			if (((Map<String,Object>) componenteCaracteristicas.get(i)).get("nome").equals("PADRAOCONSTRUCAO")){
				caracteristicas.put(((Map<String,Object>) componenteCaracteristicas.get(i)).get("nome").toString().toLowerCase(), ((Map<String,Object>) componenteCaracteristicas.get(i)).get("codigo").toString());
			}
			
		}

		return caracteristicas;
		
	}

}
