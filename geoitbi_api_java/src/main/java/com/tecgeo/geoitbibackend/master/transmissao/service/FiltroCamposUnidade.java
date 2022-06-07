package com.tecgeo.geoitbibackend.master.transmissao.service;

import java.math.BigDecimal;

import lombok.Getter;
import lombok.Setter;

public class FiltroCamposUnidade {
	
	@Getter @Setter
	private String geocodeStm;
	
	@Getter @Setter
	private String tipoImovel;
	
	@Getter @Setter
	private String tipologia;
	
	@Getter @Setter
	private String padraoConstrucao;
	
	@Getter @Setter
	private String idade;
	
	@Getter @Setter
	private BigDecimal areaConstruida;
	
	@Getter @Setter
	private String conservacao;
	
	@Getter @Setter
	private String pavimentos;
	
	@Getter @Setter
	private String inscricao;
	
	@Getter @Setter
	private String operador;

	public FiltroCamposUnidade() {
		super();
	}
	
}
