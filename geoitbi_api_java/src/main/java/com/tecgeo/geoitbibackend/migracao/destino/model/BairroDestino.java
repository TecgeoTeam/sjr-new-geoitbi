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
@Table(name="sde.TB_BAIRRO")
@SuppressWarnings("serial")
public class BairroDestino implements Serializable {
	
	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="nu_codigobairro", columnDefinition="SMALLINT")
	@Getter @Setter
	private Integer codigoBairro;
	
	@Column(name="de_nomebairro", columnDefinition="NVARCHAR(250)")
	@Getter @Setter
	private String nomeBairro;

	public BairroDestino() {
		// Construtor vazio Hibernate
	}
	
}
