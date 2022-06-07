package com.tecgeo.geoitbibackend.migracao.destino.model;

import java.io.Serializable;
import java.math.BigDecimal;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;
import javax.validation.constraints.NotNull;

import org.springframework.data.geo.Polygon;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.LOTE_NAO_PRIORITARIO_V04")
@SuppressWarnings("serial")
public class LoteGEONaoPrioritarioDestino implements Serializable {

	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="SETOR", columnDefinition="NVARCHAR(2)")
	@Getter @Setter
	private String setor;
	
	@Column(name="QUADRA", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
	private String quadra;
	
	@Column(name="DISTRITO", columnDefinition="NVARCHAR(2)")
	@Getter @Setter
	private String distrito;
	
	@Column(name="SETOR_NOV", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String setorNov;
	
	@Column(name="QDR_NPV", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String qdrNpv;
	
	@Column(name="GEOCODE", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
	private String geocode;
	
	@Column(name="INS_ANT", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String insAnt;
	
	@Column(name="AREA")
	@Getter @Setter
	private BigDecimal area;
	
	@Column(name="Shape_Leng")
	@Getter @Setter
	private BigDecimal shapeLeng;
	
	@Column(name="de_observacao", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String observacao;
	
	@Column(name="de_geocodificado", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
	private String geocodificado;
	
	@Column(name="DE_USO", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
	private String uso;
	
	@Column(name="DE_TIPOLOGIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String tipologia;
	
	@Transient
	private Polygon shape;

	public LoteGEONaoPrioritarioDestino() {
		// Construtor vazio hibernate
	}
	
}
