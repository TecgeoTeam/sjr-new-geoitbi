package com.tecgeo.geoitbibackend.calculo.service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tecgeo.geoitbibackend.util.JsonUtil;
import okhttp3.OkHttpClient;
import okhttp3.Request;

@Service
public class ImovelWSService {
	
	private String urlWebService = "https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14";
	private String urlWebServiceUnidade = "https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/27";
	
	@SuppressWarnings("unchecked")
	public Object getImovelWS(String inscricao) {
		
		/*objecto mapper transforma o json string em objeto java*/
		ObjectMapper mapper = new ObjectMapper();
		
		HashMap<String, Object> dadosImoArcServer;
		
		Object imovelWS;
		
		String query = "/query?where=DE_GEOCODE_LOTE+%3D+%27" +
				inscricao + "%27&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=*&returnGeometry=true&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=pjson";
		try {
			
			TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {};
			dadosImoArcServer = mapper.readValue(JsonUtil.jsonGetRequest(this.urlWebServiceUnidade + query), typeReference);
			imovelWS = ((List<Map<String, Object>>) dadosImoArcServer.get("features")).get(0).get("attributes");
			return imovelWS;
			
		} catch (JsonParseException e) {
			e.printStackTrace();
		} catch (JsonMappingException e) {
			e.printStackTrace();
		} catch (IOException e) {
			e.printStackTrace();
		}
		return null;
	}
	
	
	@SuppressWarnings("unchecked")
	public Object getImovelWSTinus(String inscricao) {
		
		OkHttpClient client = new OkHttpClient();
		
		/*objeto mapper transforma o json string em objeto java*/
		ObjectMapper mapper = new ObjectMapper();
		
		HashMap<String, Object> dadosImo;
		
		Object imovelWS;
		//PESQUISANDO PELA INSCRICAO INTEIRA DA TINUS
//		String query = "/query?where=sjr_cadastro.SDE.Lote.stg_geocode+%3D+" +
//				inscricao + "&text=&objectIds=&time=&geometry=&geometryType=esriGeometryEnvelope&inSR=&spatialRel=esriSpatialRelIntersects&relationParam=&outFields=sjr_cadastro.SDE.TB_LOTES.DE_ID&returnGeometry=false&returnTrueCurves=false&maxAllowableOffset=&geometryPrecision=&outSR=&having=&returnIdsOnly=false&returnCountOnly=false&orderByFields=&groupByFieldsForStatistics=&outStatistics=&returnZ=false&returnM=false&gdbVersion=&historicMoment=&returnDistinctValues=false&resultOffset=&resultRecordCount=&queryByDistance=&returnExtentOnly=false&datumTransformation=&parameterValues=&rangeValues=&quantizationParameters=&f=pjson";

		//O SEQUENCIAL DO LOTE (TABELA) PESQUISA NO WS DA TINUS E RETORNA OS DADOS DO IMÓVEL
		
//		Object sequencial = null;
//		
//		Request requestGeocodigo = new Request.Builder()
//				  .url(urlWebService+query)
//				  .get()
//				  .build();
//		
//		try {
//			okhttp3.Response responseGeocodigo = client.newCall(requestGeocodigo).execute();
//			String jsonResponseGeocodigo = responseGeocodigo.body().string();
//			JSONObject Jobject = new JSONObject(jsonResponseGeocodigo);
//			JSONArray Jarray = Jobject.getJSONArray("features");
//			Object attr = Jarray.get(0);
//			sequencial = ((JSONObject) ((JSONObject) attr).get("attributes")).get("sjr_cadastro.SDE.TB_LOTES.DE_ID");
//			System.out.println(sequencial);
//			
//		} catch (JsonParseException e) {
//			e.printStackTrace();
//		} catch (JsonMappingException e) {
//			e.printStackTrace();
//		} catch (IOException e) {
//			e.printStackTrace();
//		}
		
		Request requestTinus = new Request.Builder()
				  .url("http://www2.tinus.com.br:57773/api/siat/v1/saojosederibamar/geoitbi/" + inscricao)
				  .get()
				  .addHeader("Authorization", "Basic NDM4NTMwOlQzQ0czMFNKUg==")
				  .addHeader("cache-control", "no-cache")
				  .addHeader("Postman-Token", "ba13e73c-8a4d-4318-87ac-3620aadde934")
				  .build();
		
		try {
			
			okhttp3.Response response = client.newCall(requestTinus).execute();
			TypeReference<Map<String, Object>> typeReference = new TypeReference<Map<String, Object>>() {};
			dadosImo = mapper.readValue(response.body().string(), typeReference);
			imovelWS = dadosImo;
			return imovelWS;
			
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
