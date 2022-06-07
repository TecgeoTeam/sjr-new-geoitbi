package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.tecgeo.geoitbibackend.migracao.destino.model.LogradouroDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_LOGRADOURO")
@SuppressWarnings("serial")
public class LogradouroDSA implements Serializable {

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

	public LogradouroDSA() {
		// Construtor vazio Hibernate
	}

	public LogradouroDSA(LogradouroDestino logradouroDestino) {
		this.setObjectId(logradouroDestino.getObjectId());
		this.setCep(logradouroDestino.getCep());
		this.setCodLogradouro(logradouroDestino.getCodLogradouro());
		this.setIdBairro(logradouroDestino.getIdBairro());
		this.setIdLogradouroFim(logradouroDestino.getIdLogradouroFim());
		this.setIdLogradouroIni(logradouroDestino.getIdLogradouroIni());
		this.setIdTipoLogradouro(logradouroDestino.getIdTipoLogradouro());
		this.setNomeLogradouro(logradouroDestino.getNomeLogradouro());
	}
	
}
