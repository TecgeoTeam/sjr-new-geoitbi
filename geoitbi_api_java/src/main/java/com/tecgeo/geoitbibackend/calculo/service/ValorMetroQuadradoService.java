package com.tecgeo.geoitbibackend.calculo.service;

import java.util.ArrayList;
import java.util.Map;

import org.apache.commons.lang3.StringUtils;
import org.springframework.stereotype.Service;

@Service
public class ValorMetroQuadradoService {
	
	private Double coodY;
	private Double coodX;
	private Double areaPadrao;
	private String pavimentacao;
	private Double testadaMedia;
	private Double rendaSetor;
	private Double areaConst;
	private Double idade;
	private String drenagem;
	private String bloco;
	private String zonaUrbana;
    private boolean tipoUso;
    private String pedologia;
    private Integer ATME;

	@SuppressWarnings({ "unchecked", "rawtypes" })
	public Object calcularValorMetroQuadrado(Map<String, Object> objectMap) {
		
		this.coodY = (Double) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("nu_y");
		this.coodX = (Double) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("nu_x");
	    this.areaPadrao = (Double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("area_terreno");
	    this.pavimentacao = (String) ((Map<String,Object>) objectMap.get("caracteristicas")).get("pavimentacao");
	    this.rendaSetor = Double.parseDouble(((Map<String,Object>) objectMap.get("dadosPlanta")).get("nu_renda_v02").toString());
	    //this.areaConst = (Double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("area_construida");
	    //this.idade = (Double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("idade");
	    this.areaConst = 0.0;
	    this.idade = 0.0;
	    this.testadaMedia = (Double) ((Map<String,Object>) objectMap.get("caracteristicas")).get("testada");
	    this.drenagem = (String) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("de_drenagem");
	    //this.bloco = (String) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("sjr_cadastro.SDE.ln_face_de_quadra.nu_bloco");
	    this.bloco = (String) ((Map<String, Object>) objectMap.get("dadosPlanta")).get("de_zona_calculo");
	    this.zonaUrbana = (String) ((Map<String,Object>) objectMap.get("dadosPlanta")).get("de_zona");
	    this.zonaUrbana = StringUtils.substringAfter(this.zonaUrbana, "- ");
	    this.tipoUso = (Boolean)((Map<String,Object>) objectMap.get("caracteristicas")).get("predial");
	    this.pedologia = (String) ((Map<String,Object>) objectMap.get("caracteristicas")).get("pedologia");

	    this.ATME = (Integer) ((Map<String, Object>) ((Map<String, Object>) ((Map<String, Object>) objectMap.get("zona")).get("ZONEAMENTO")).get(this.zonaUrbana)).get("ATME");

		Double dblDrenagem = null;
		Double dblPedologia = null;
		Double dblPavimentacao = null;
		Double dblATME = this.ATME / 100.0;
		Double dblTestada = null;
		//Double dblIdade = Double.parseDouble(this.idade);
		
	    System.out.println(this.testadaMedia);
	    dblTestada = this.testadaMedia;
	   

	    if (pavimentacao.equals("SEM PAVIMENTAÇÃO")) {
	    	dblPavimentacao = 1.0;
	    } else {
	    	dblPavimentacao = 2.0;
	    }

	    if (drenagem.equals("não tem")) {
	        dblDrenagem = 0.0;
	    } else {
	    	dblDrenagem = 1.0;
	    }

	    if(pedologia.equals("FIRME")) {
	    	dblPedologia = 1.0;
	    } else {
	    	dblPedologia = 2.0;
	    }
		
	    Double valorUnit = 0.0;

	    if (bloco.equals("ZONA CALCULO 01")) {
	    	valorUnit = 1.0 / Math.pow((2.9408787 - 3.6391608e-14 * Math.pow(coodY, 2) + 1.7637093e-12 * 
	    			Math.pow(coodX, 2) - 0.0061244639 * Math.log(areaPadrao) - 0.0067556626 * dblPavimentacao -
	    			0.0082314667 * dblDrenagem - 1.8714962 * 1/(Math.pow(dblTestada, 2)) +
	    			11421.995 * 1/rendaSetor - 0.0054046031 * 1/dblATME), 2);
	    }
	    if (bloco.equals("ZONA CALCULO 02")) {
	    	valorUnit = -909.28984 + 9.8403863e12 * (coodY * coodY) + -3.9880026e-11 * (coodX * coodX) - 0.51088573 *
	    			Math.log(areaPadrao) + 0.44641052 * dblPavimentacao + 0.13254816 * dblTestada/2 + 245.7449/(rendaSetor/2) -
	    			0.62549788 * dblPedologia + 0.64981452 * 1/dblATME;
	    	return Math.log(valorUnit);
	    }
	    if(bloco.equals("ZONA CALCULO 03")) {
	    	valorUnit =  -328853.42 + 3.1307276e+19 * 1/(coodY * coodY) + -9.064312e+14 * 1/(coodX * coodX) + 1.3020109e-5 *
	    			(areaPadrao * areaPadrao) + -1776.4398 * 1/(dblTestada * dblTestada) + 14.233483 * areaConst/2 +
	    			-0.018403858 * (idade * idade) +  2.3550851e-5 * (rendaSetor * rendaSetor) + 10.602951 * (dblATME * dblATME);
	    	return (valorUnit/2) / areaPadrao;
	    }
	    
		return valorUnit;
	}
}
