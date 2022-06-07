package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.tecgeo.geoitbibackend.migracao.destino.model.BairroDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_BAIRRO")
@SuppressWarnings("serial")
public class BairroDSA implements Serializable {
	
	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="nu_codigobairro")
	@Getter @Setter
	private Integer codigoBairro;
	
	@Column(name="de_nomebairro", columnDefinition="NVARCHAR(250)")
	@Getter @Setter
	private String nomeBairro;

	public BairroDSA() {
		// Construtor vazio Hibernate
	}

	public BairroDSA(BairroDestino bairroDestino) {
		this.setObjectId(bairroDestino.getObjectId());
		this.setCodigoBairro(bairroDestino.getCodigoBairro());
		this.setNomeBairro(bairroDestino.getNomeBairro());
	}
	
}
