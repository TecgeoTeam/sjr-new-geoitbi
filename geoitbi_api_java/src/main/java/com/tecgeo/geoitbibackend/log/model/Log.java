package com.tecgeo.geoitbibackend.log.model;

import lombok.Getter;
import lombok.Setter;

public class Log {
	
	@Getter @Setter
	private String mensagem;
 	
	@Getter @Setter
	private String nomeTabela;
	
	@Getter @Setter
	private String tipo;
	
	@Getter @Setter
	private String numeroRegistros;

	public Log(String mensagem, String nomeTabela, String tipo, String numeroRegistros) {
		super();
		this.mensagem = mensagem;
		this.nomeTabela = nomeTabela;
		this.tipo = tipo;
		this.numeroRegistros = numeroRegistros;
	}
	
}
