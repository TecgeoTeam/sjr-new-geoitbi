package com.tecgeo.geoitbibackend.calculo.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecgeo.geoitbibackend.util.JsonUtil;

@Service
public class DadosPlantaDeValorService {
	
	private String urlPlantaDeValor = "https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_de_Transmissao/MapServer/0";
	private String urlLotesComFaces = "https://sigribamar.com.br/server/rest/services/GeoITBI/Lotes_com_Faces/MapServer/1";
	
	private String codFace;
	private String geocodigo;
	
	@SuppressWarnings({ "unchecked" })
	public Object getDadosPlantaDeValor(Map<String,Object> objectMap) {
		
		this.codFace = (String) ((Map<String,Object>) objectMap.get("imovelWSTINUS")).get("imovel_geoFace");

		ObjectMapper plantaMapper = new ObjectMapper();
		HashMap<String, Object> dadosPlanta;
		Object attributesPlanta;
		
		String query = "/query?where=de_face_v01+%3D+%27" + codFace + 
				"%27&text=&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=*&returnZ=false&returnM=false&returnDistinctValues=false&f=pjson";
		System.out.println(this.urlPlantaDeValor + query);
		try {
			TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {};
			dadosPlanta = plantaMapper.readValue(JsonUtil.jsonGetRequest(this.urlPlantaDeValor + query), typeReference);
			attributesPlanta = ((List<Map<String, Object>>) dadosPlanta.get("features")).get(0).get("attributes");

			return attributesPlanta;
			
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}
	
	@SuppressWarnings({ "unchecked" })
	public Object getDadosLotesComFaces(Map<String,Object> objectMap) {
		
		this.geocodigo = (String) objectMap.get("inscricao");

		ObjectMapper plantaMapper = new ObjectMapper();
		HashMap<String, Object> dadosPlanta;
		Object attributesPlanta;

		String query = "/query?where=+stg_geocode+%3D+%27"+ geocodigo +
				"%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=pjson";
		System.out.println(this.urlLotesComFaces + query);
		try {
			TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {};
			dadosPlanta = plantaMapper.readValue(JsonUtil.jsonGetRequest(this.urlLotesComFaces + query), typeReference);
			attributesPlanta = ((List<Map<String, Object>>) dadosPlanta.get("features")).get(0).get("attributes");		
			
			return attributesPlanta;
			
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		
		return null;
	}

}
