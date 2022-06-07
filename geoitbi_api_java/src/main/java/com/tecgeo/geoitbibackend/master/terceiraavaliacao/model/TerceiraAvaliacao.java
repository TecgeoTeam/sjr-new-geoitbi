package com.tecgeo.geoitbibackend.master.terceiraavaliacao.model;

import java.io.Serializable;
import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;


@Entity
@Table(name="tb_terceira_avaliacao")
@SuppressWarnings("serial")
public class TerceiraAvaliacao implements Serializable {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="nu_abrigo_id")
	@Getter @Setter
	private Long id;
	
	@NotNull
	@Size(max = 50)
	@Column(name="de_geocodigo")
	@Getter @Setter
	private String geocodigo;
    
	@Size(max = 40)
	@Column(name="de_imovel_id")
	@Getter @Setter
	private String imovelId;
	
	@NotNull
	@Column(name="nu_valor_avaliacao")
	@Getter @Setter
	private BigDecimal valorAvaliacao;
	
	@Column(name="nu_avaliacao_bancaria")
	@Getter @Setter
	private BigDecimal avaliacaoBancaria;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="dt_cadastro")
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Getter @Setter
	private Date dataCadastro;
		
	@NotNull
	@Size(max = 100)
	@Column(name="de_username")
	@Getter @Setter
	private String username;
	
	@Column(name="nu_est_terreno_min")
	@Getter @Setter
	private BigDecimal valorMinimoTerreno;
	
	@Column(name="nu_est_terreno_med")
	@Getter @Setter
	private BigDecimal valorMedioTerreno;
	
	@Column(name="nu_est_terreno_max")
	@Getter @Setter
	private BigDecimal valorMaximoTerreno;
	
	@Column(name="nu_est_edificacao")
	@Getter @Setter
	private BigDecimal valorEdificacao;
	
	@Column(name="nu_est_total_min")
	@Getter @Setter
	private BigDecimal valorMinimoTotal;
	
	@Column(name="nu_est_total_med")
	@Getter @Setter
	private BigDecimal valorMedioTotal;
	
	@Column(name="nu_est_total_max")
	@Getter @Setter
	private BigDecimal valorMaximoTotal;
	
	public TerceiraAvaliacao() {
		// Construtor vazio Hibernate
	}

	public TerceiraAvaliacao(String geocodigo, BigDecimal valorAvaliacao,
			Date dataCadastro, String username, BigDecimal valorEdificacao,
			BigDecimal valorMinimoTerreno, BigDecimal valorMedioTerreno,
			BigDecimal valorMaximoTerreno) {
		this.geocodigo = geocodigo;
		this.valorAvaliacao = valorAvaliacao;
		this.dataCadastro = dataCadastro;
		this.username = username;
		this.valorEdificacao = valorEdificacao;
		this.valorMinimoTerreno = valorMinimoTerreno;
		this.valorMedioTerreno = valorMedioTerreno;
		this.valorMaximoTerreno = valorMaximoTerreno;
	}

	public void calcularValorMinimoTotal() {
		this.valorMinimoTotal = this.valorMinimoTerreno.add(this.valorEdificacao);
	}

	public void calcularValorMedioTotal() {
		this.valorMedioTotal = this.valorMedioTerreno.add(this.valorEdificacao);
	}

	public void calcularValorMaximoTotal() {
		this.valorMaximoTotal = this.valorMaximoTerreno.add(this.valorEdificacao);
	}
	
}
