package com.tecgeo.geoitbibackend.migracao.destino.model;

import java.awt.Polygon;
import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.LOTE")
@SuppressWarnings("serial")
public class LoteGEODestino implements Serializable {

	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="INS_ANT", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String insAnt;
	
	@Column(name="GEOCODE", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String geocode;
	
	@Column(name="GEOC_RENU", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
	private String geocRenu;
	
	@Column(name="Foto_Link", columnDefinition="NVARCHAR(250)")
	@Getter @Setter
	private String fotoLink;
	
	@Column(name="de_cod_sqcodlog", columnDefinition="NVARCHAR(50)")
	@Getter @Setter
	private String codSqCodLog;
	
	@Column(name="de_tipo_transmissao", columnDefinition="NVARCHAR(50)")
	@Getter @Setter
	private String tipoTransmissao;
	
	@Column(name="de_tipologia_transmissao", columnDefinition="NVARCHAR(50)")
	@Getter @Setter
	private String tipologiaTransmissao;
	
	@Column(name="de_tem_transmissao", columnDefinition="NVARCHAR(50)")
	@Getter @Setter
	private String temTransmissao;
	
	@Column(name="tem_comercial", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String temComercial;
	
	@Column(name="de_observacao", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String observacao;
	
	@Column(name="de_geocodificado", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
	private String geocodificado;
	
	@Column(name="de_distrito", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String distrito;
	
	@Column(name="DE_USO", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
	private String uso;
	
	@Column(name="DE_TIPOLOGIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String tipologia;
	
	@Transient
	private Polygon shape;

	public LoteGEODestino() {
		// Construtor vazio
	}
	
}
