package com.tecgeo.geoitbibackend.calculo.service;

import java.util.HashMap;
import java.util.Map;

import org.springframework.stereotype.Service;

@Service
public class CaracteristicasImovelWSArcServerService {
	
	@SuppressWarnings("unchecked")
	public Object buildCaracteristicasImovelArcServer(Map<String, Object> objectMap) {
		
		//MONTAR AS CARACTERISTICAS A PARTIR DO WS DE UNIDADES DO ARCSERVER
		
		//AS CARACTERISTICAS ESTÃO COM UM DOMINIO NA FRENTE example.substring(example.lastIndexOf("/") + 1)
		
		Map<String, Object> imovel = (Map<String, Object>) objectMap.get("imovelWS");
		Map<String, Object> imovelTINUS = (Map<String, Object>) objectMap.get("imovelWSTINUS");
		
		Map<String, Object> caracteristicas = new HashMap<>();	
		
		String uso = imovel.get("DE_USO").toString().toLowerCase();
		System.out.println(uso);
			caracteristicas.put("predial", true);
			try {
				caracteristicas.put("area_construida", imovel.get("NU_AREA_CONSTRUIDA"));
				caracteristicas.put("tipologia",  imovel.get("DE_TIPO_IMOVEL"));
				caracteristicas.put("estrutura", imovel.get("DE_ESTRUTURA"));
				caracteristicas.put("topografia",  imovel.get("DE_TOPOGRAFIA"));
				caracteristicas.put("conservacao", imovel.get("DE_CONSERVACAO"));
				caracteristicas.put("pavimentacao", imovel.get("DE_PAVIMENTACAO"));
				//PADRAO DA CONSTRUÇÃO, VER COM A TINUS
				caracteristicas.put("padraoconstrucao", "1C");
				if (imovel.get("NU_COD_LOGRADOURO").toString().length() >= 6) {
					caracteristicas.put("cod_logradouro",(String) imovel.get("DE_SETOR") + imovel.get("DE_QUADRA_FISCAL") + imovel.get("NU_COD_LOGRADOURO"));
				} else {
					caracteristicas.put("cod_logradouro",(String) imovel.get("DE_SETOR") + imovel.get("DE_QUADRA_FISCAL") + "0" + imovel.get("NU_COD_LOGRADOURO"));
				}
				caracteristicas.put("fracao_ideal", imovel.get("NU_FRACAO_IDEAL").toString());
				// IDADE = DATA DO CADASTRO 2019
				//caracteristicas.put("idade", imovelTINUS.get("imovel_idade"));
				caracteristicas.put("idade", 1.0);
				caracteristicas.put("pedologia", imovel.get("DE_PEDOLOGIA"));
				caracteristicas.put("area_terreno", (Double) imovel.get("NU_AREA_TERRENO"));
				caracteristicas.put("testada", (Double) imovel.get("NU_TESTADA_T1"));
				
				if(uso.equals("territorial")) {
					//TODO TESTAR IMÓVEL TERRITORIAL
					caracteristicas.put("predial", false);
					caracteristicas.put("area_construida", 0.0);
					caracteristicas.put("conservacao", "precário");
					caracteristicas.put("tipologia", "apartamento");
					caracteristicas.put("padraoconstrucao", "baixo");
					caracteristicas.put("idade", 0.0);
					caracteristicas.put("pavimentos", 1.0);
					caracteristicas.put("padraoconstrucao", "2C");
				}

				return caracteristicas;
			}catch(Exception e) {
				System.out.println("Entrou no catch das caracteristicas");
				System.out.println(caracteristicas);
				System.out.println(e);
			}
		
		return null;
	}

}
