package com.tecgeo.geoitbibackend.migracao.destino.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.TB_TRANSMISSOES")
@SuppressWarnings("serial")
public class TransmissaoDestino implements Serializable {
	
	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
    @Column(name="de_inscricao", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String inscricao;
    
    @Column(name="de_endereco", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String endereco;
    
    @Column(name="nu_codigovendedor", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String codigoVendedor;
    
    @Column(name="de_vendedor", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String vendedor;
    
    @Column(name="nu_codigocomprador", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String codigoComprador;
    
    @Column(name="de_comprador", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String comprador;
    
    @Column(name="nu_aliquota", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String aliquota;
    
    @Column(name="nu_vvt", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String vvt;
    
    @Column(name="nu_vve", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String vve;
    
    @Column(name="nu_vvi", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String vvi;
    
    @Column(name="nu_valoritbi", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String valorItbi;
    
//	@Temporal(TemporalType.TIMESTAMP)
//	@JsonFormat(shape = JsonFormat.Shape.STRING, 
//	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
//	@Getter @Setter
//	private Date dataVencimento;
    
    @Column(name="dt_vencimento", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String dataVencimento;
    
    @Column(name="ID", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String id;
    
    @Column(name="CODIGO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String codigoImovel;
    
    @Column(name="DT_DATA_AVALIACAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String dtAvaliacao;
    
    @Column(name="DT_DATA_NEGOCIACAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String dtNegociacao;
    
    @Column(name="DE_MOEDA", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String moeda;
    
    @Column(name="NU_PROCESSO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String processo;
    
    @Column(name="NU_PROCESSO_INCLUSAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String processoInclusao;
    
    @Column(name="NU_SEQUENCIAL", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String sequencial;
    
    @Column(name="DE_SITUACAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String situacao;
    
    @Column(name="NU_VALOR_AVALIACAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String valorAvaliacao;
    
    @Column(name="NU_VALOR_OPERACAO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String valorOperacao;
    
    @Column(name="NU_VALOR_FINANCIADO", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String valorFinanciado;
    
    @Column(name="stg_geocode", columnDefinition="NVARCHAR(50)")
    @Getter @Setter
    private String stgGeocode;
	
	public TransmissaoDestino() {
		// Construtor vazio hibernate
	}
    
}
