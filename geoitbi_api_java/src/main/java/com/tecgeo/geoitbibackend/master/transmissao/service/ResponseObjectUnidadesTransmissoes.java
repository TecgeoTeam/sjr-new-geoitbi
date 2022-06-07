package com.tecgeo.geoitbibackend.master.transmissao.service;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

public class ResponseObjectUnidadesTransmissoes implements Serializable {
	
//	@JsonFormat(shape = JsonFormat.Shape.STRING, 
//	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
//	@Getter @Setter
//	private Date dt_solicitacao;
	
    @Getter @Setter
    private String dt_solicitacao;

    @Getter @Setter
    private String nu_idtransmissao;
    
/*    @Getter @Setter
    private String de_exercicio;*/
    
    @Getter @Setter
    private String nu_vvi;
    
    @Getter @Setter
    private String nu_vvt;
    
    @Getter @Setter
    private String nu_vve;
    
    @Getter @Setter
    private String NU_VALOR_OPERACAO;
    
    @Getter @Setter
    private String nu_valoritbi;
    
    @Getter @Setter
    private String de_naturezatransmissao;

	@Getter @Setter
	private String DE_GEOCODE_LOTE;
	
	@Getter @Setter
	private String DE_GEOCODE_STM;
	
	@Getter @Setter
	private String DE_TIPO_IMOVEL;
	
	@Getter @Setter
	private String DE_TIPOLOGIA;
	
	@Getter @Setter
	private String DE_PADRAO_CONSTRUCAO;
	
	@Getter @Setter
	private String DE_IDADE;
	
	@Getter @Setter
	private BigDecimal NU_AREA_CONSTRUIDA;
	
	@Getter @Setter
	private String DE_CONSERVACAO;
	
	@Getter @Setter
	private String DE_PAVIMENTOS;
	
	@Getter @Setter
	private String DE_PROP_NOME;


	public ResponseObjectUnidadesTransmissoes() {
		super();
	}
}
