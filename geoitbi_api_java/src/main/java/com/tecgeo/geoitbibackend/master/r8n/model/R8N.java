package com.tecgeo.geoitbibackend.master.r8n.model;

import java.io.Serializable;
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
@Table(name="tb_r8n")
@SuppressWarnings("serial")
public class R8N implements Serializable{

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="id")
	@JsonFormat(shape = JsonFormat.Shape.ANY)
	@Getter @Setter
	private Long id;
	
	@NotNull
	@Size(max=20)
	@Column(name="de_cod")
	@JsonFormat(shape = JsonFormat.Shape.STRING)
	@Getter @Setter
	private String cod;
	
	@NotNull
	@Column(name="nu_valor")
	@JsonFormat(shape = JsonFormat.Shape.NUMBER_FLOAT)
	@Getter @Setter
	private Double valor;
	
	@NotNull
	@Size(max=50)
	@Column(name="de_descricao")
	@JsonFormat(shape = JsonFormat.Shape.STRING)
	@Getter @Setter
	private String descricao;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(name="dt_data_atualizacao")
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Getter @Setter
	private Date dataAtualizacao;
	
	@NotNull
	@Column(name="de_mes_referente")
	@JsonFormat(shape = JsonFormat.Shape.ANY)
	@Getter @Setter
	private Integer mesReferencia;
	
	@NotNull
	@Column(name="de_ano_referente")
	@JsonFormat(shape = JsonFormat.Shape.ANY)
	@Getter @Setter
	private Integer anoReferencia;
	
	public R8N() {
		//Construtor vazio
	}
	
	public R8N(String cod, Double valor,
			String descricao, Date dataAtualizacao,
			Integer mesReferencia, Integer anoReferencia) {
		this.cod = cod;
		this.valor = valor;
		this.descricao = descricao;
		this.dataAtualizacao = dataAtualizacao;
		this.mesReferencia = mesReferencia;
		this.anoReferencia = anoReferencia;
	}
	
}
