package com.tecgeo.geoitbibackend.calculo.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.tecgeo.geoitbibackend.util.JsonUtil;

@Service
public class CalculoService {
	
	@Autowired
	JsonUtil jsonUtil;
	
	@Autowired
	ImovelWSService imovelWSService;
	
	@Autowired
	CaracteristicasImovelWSService caracteristicasImovelService;
	
	@Autowired
	CaracteristicasImovelWSArcServerService caracteristicasImovelArcServerService;
	
	@Autowired
	DadosPlantaDeValorService dadosPlantaDeValorService;
	
	@Autowired
	ParametersService parametersService;
	
	@Autowired
	DepreciacaoFisicaService depreciacaoFisicaService;
	
	@Autowired
	CustoUnitarioBasicoService custoUnitarioBasicoService;
	
	@Autowired
	ValorDaEdificacaoService valorDaEdificacaoService;
	
	@Autowired
	ValorMetroQuadradoService valorMetroQuadradoService;
	
	public Map<String, Object> map = new HashMap<>();
	
	//TODO puxar dados direto do banco da prefeitura, mapeando as classes e etc..
	//TODO CRIAR MODELS, ATÉ DO PROPRIO CALCULO.
	
	public Map<String, Object> calculo(String inscricao) {

		this.map.put("inscricao", inscricao);
		
		Object imovelWebService = imovelWSService.getImovelWS(inscricao);
		this.map.put("imovelWS", imovelWebService);
		
		// Object imovelWebServiceTINUS = imovelWSService.getImovelWSTinus(inscricao);
		// this.map.put("imovelWSTINUS", imovelWebServiceTINUS);
	
		//Object builtCaracImovel = caracteristicasImovelService.buildCaracteristicasImovel(this.map);
		Object builtCaracImovel = caracteristicasImovelArcServerService.buildCaracteristicasImovelArcServer(this.map);
		this.map.put("caracteristicas", builtCaracImovel);
	
		Object dadosPlantaDeValor = dadosPlantaDeValorService.getDadosLotesComFaces(this.map);
		this.map.put("dadosPlanta", dadosPlantaDeValor);
				
		Object builtParametros = parametersService.buildParameters();
		this.map.put("parametros", builtParametros);

		Object builtFatorCorrecao = parametersService.buildFatorCorrecao();
		this.map.put("fatorCorrecao", builtFatorCorrecao);
		
		Object builtZona = parametersService.buildZona();
		this.map.put("zona", builtZona);

		if (((Map<String, Object>) this.map.get("caracteristicas")).get("predial").equals(true)) {
				
			Object depreciacao = depreciacaoFisicaService.getDepreciacaoFisica(this.map);
			this.map.put("depreciacao", depreciacao);
			
			Object custoUnitarioBasico = custoUnitarioBasicoService.getCustoUnitarioBasico(this.map);
			this.map.put("cub", custoUnitarioBasico);
			
			Object valorEdificacao = valorDaEdificacaoService.getValorDaEdificacao(this.map);
			this.map.put("valor_edificacao", valorEdificacao);
			
		} else {
			this.map.put("valor_edificacao", 0.0);
		}
		
		Object valorMetroQuadrado = valorMetroQuadradoService.calcularValorMetroQuadrado(this.map);
		this.map.put("valor_metro_quadrado", valorMetroQuadrado);
		
		Object resultadoFinal = this.calculoFinal(this.map);
		this.map.put("resultado", resultadoFinal);
	
		return this.map;
		
	}

	@SuppressWarnings("unchecked")
	public Map<String, Object> calculoSimplificado(String inscricao){
		
		this.map.put("inscricao", inscricao);
		
		Object imovelWebServiceTINUS = imovelWSService.getImovelWSTinus(inscricao);
		this.map.put("imovelWSTINUS", imovelWebServiceTINUS);
		
		Object builtCaracImovel = caracteristicasImovelService.buildCaracteristicasImovel(this.map);
		this.map.put("caracteristicas", builtCaracImovel);
		
		Object dadosPlantaDeValor = dadosPlantaDeValorService.getDadosPlantaDeValor(this.map);
		this.map.put("dadosPlanta", dadosPlantaDeValor);
		
		Object builtParametros = parametersService.buildParameters();
		this.map.put("parametros", builtParametros);
		
		Object builtFatorCorrecao = parametersService.buildFatorCorrecao();
		this.map.put("fatorCorrecao", builtFatorCorrecao);
		
		Object builtZona = parametersService.buildZona();
		this.map.put("zona", builtZona);

		if (((Map<String, Object>) this.map.get("caracteristicas")).get("tipoimovel").equals("predial")) {
				
		Object depreciacao = depreciacaoFisicaService.getDepreciacaoFisica(this.map);
		this.map.put("depreciacao", depreciacao);
		
		Object custoUnitarioBasico = custoUnitarioBasicoService.getCustoUnitarioBasico(this.map);
		this.map.put("cub", custoUnitarioBasico);
		
		Object valorEdificacao = valorDaEdificacaoService.getValorDaEdificacao(this.map);
		this.map.put("valor_edificacao", valorEdificacao);
		
		} else {
			this.map.put("valor_edificacao", 0.0);
		}
		
		Object resultadoFinal = this.calculoFinalSimplificado(this.map);
		this.map.put("resultado", resultadoFinal);
		
		return this.map;
	}
	
	@SuppressWarnings("unchecked")
	public Object calculoFinal(Map<String, Object> objectMap) {
		
		Map<String, Object> resultado = new HashMap<String, Object>();
		
		Double valorTerrenoMinimo = (double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("area_terreno") * (double) objectMap.get("valor_metro_quadrado") * 0.85;
        Double valorTerrenoMedio = (double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("area_terreno") * (double) objectMap.get("valor_metro_quadrado");
        Double valorTerrenoMaximo = (double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("area_terreno") * (double) objectMap.get("valor_metro_quadrado") * 1.15;
		
        resultado.put("valorTerrenoMinimo", valorTerrenoMinimo);
        resultado.put("valorTerrenoMedio", valorTerrenoMedio);
        resultado.put("valorTerrenoMaximo", valorTerrenoMaximo);
        
        Double totalMinimo = (Double) objectMap.get("valor_edificacao") + valorTerrenoMinimo;
        Double totalMedio = (Double) objectMap.get("valor_edificacao") + valorTerrenoMedio;
        Double totalMaximo = (Double) objectMap.get("valor_edificacao") + valorTerrenoMaximo;
        
        resultado.put("valorTotalMinimo", totalMinimo);
        resultado.put("valorTotalMedio", totalMedio);
        resultado.put("valorTotalMaximo", totalMaximo);
        
		return resultado;
	}
	
	@SuppressWarnings({"unchecked", "rawtypes"})
	public Object calculoFinalSimplificado(Map<String, Object> objectMap) {
		
		Map<String, Object> resultado = new HashMap<String, Object>();
		
		Double valorTerreno = null;
	    Double dblAreaTerreno = null;
		
		Double valorUnit = (Double) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("nu_val_unit2");
		String areaTerreno = (String)  ((Map<String,Object>) ((ArrayList) ((Map<String,Object>) objectMap.get("imovelWSTINUS")).get("bci_componentes")).get(0)).get("componente_area");
		dblAreaTerreno = Double.parseDouble(areaTerreno.replace(".", "").replace(",","."));
	    
	    valorTerreno =  valorUnit * dblAreaTerreno;
	    
		Double valorTerrenoMinimo = valorTerreno * 0.85;
        Double valorTerrenoMedio = valorTerreno;
        Double valorTerrenoMaximo = valorTerreno * 1.15;
		
        resultado.put("valorTerrenoMinimo", valorTerrenoMinimo);
        resultado.put("valorTerrenoMedio", valorTerrenoMedio);
        resultado.put("valorTerrenoMaximo", valorTerrenoMaximo);
        
        Double totalMinimo = (Double) objectMap.get("valor_edificacao") + valorTerrenoMinimo;
        Double totalMedio = (Double) objectMap.get("valor_edificacao") + valorTerrenoMedio;
        Double totalMaximo = (Double) objectMap.get("valor_edificacao") + valorTerrenoMaximo;
        
        resultado.put("valorTotalMinimo", totalMinimo);
        resultado.put("valorTotalMedio", totalMedio);
        resultado.put("valorTotalMaximo", totalMaximo);
	    
		
		return resultado;
	}

}
