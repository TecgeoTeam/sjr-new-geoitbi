package com.tecgeo.geoitbibackend.migracao.destino.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.TB_LOGRADOURO")
@SuppressWarnings("serial")
public class LogradouroDestino implements Serializable {

	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="de_codlogradouro", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String codLogradouro;
	
	@Column(name="nu_idtipologr", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String idTipoLogradouro;
	
	@Column(name="de_nomelogradouro", columnDefinition="NVARCHAR(250)")
	@Getter @Setter
	private String nomeLogradouro;
	
	@Column(name="nu_idlogradouroini")
	@Getter @Setter
	private Integer idLogradouroIni;
	
	@Column(name="nu_idlogradourofim")
	@Getter @Setter
	private Integer idLogradouroFim;
	
	@Column(name="de_cep", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String cep;
	
	@Column(name="nu_idbairro")
	@Getter @Setter
	private Integer idBairro;

	public LogradouroDestino() {
		// Construtor vazio Hibernate
	}
	
}
