package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

import com.tecgeo.geoitbibackend.migracao.destino.model.FaceDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_FACE_DE_QUADRA")
@SuppressWarnings("serial")
public class FaceDSA implements Serializable {

	@Id
	@NotNull
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="de_n_id_face", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String idFace;
	
	@Column(name="de_n_setor", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String setor;
	
	@Column(name="de_n_qdr", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String quadra;
	
	@Column(name="de_n_codlog", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String codLog;
	
	@Column(name="de_n_face", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String face;
	
	@Column(name="nu_pavimento", columnDefinition="SMALLINT")
	@Getter @Setter
	private Integer pavimento;
	
	@Column(name="de_distrito", columnDefinition="NVARCHAR(5)")
	@Getter @Setter
	private String distrito;
	
	@Column(name="de_agua", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String agua;
	
	@Column(name="de_estacionamento", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String estacionamento;
	
	@Column(name="de_sentido_logradouro", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String sentidoLogradouro;
	
	@Column(name="de_drenagem", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String drenagem;
	
	@Column(name="de_esgoto", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String esgoto;
	
	@Column(name="de_iluminacao", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String iluminacao;
	
	@Column(name="de_meio_fio", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String meioFio;
	
	@Column(name="de_limpeza_publica", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String limpezaPublica;
	
	@Column(name="de_rede_eletrica", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String redeEletrica;
	
	@Column(name="de_rede_telefonica", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String redeTelefonica;
	
	@Column(name="de_conservacao_da_via", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String conservacaoDaVia;
	
	@Column(name="de_calcada", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String calcada;
	
	@Column(name="de_hidrante", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
	private String hidrante;
	
	@Column(name="de_pavimentacao", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String pavimentacao;
	
	@Column(name="de_tipo_via", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String tipoVia;
	
	@Column(name="de_arborizacao", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String arborizacao;
	
	@Column(name="de_coleta_de_lixo", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String coletaDeLixo;
	
	@Column(name="de_ponto_de_servico", columnDefinition="NVARCHAR(35)")
	@Getter @Setter
	private String pontoDeServico;	
	
	@Column(name="de_transporte", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String transporte;

	public FaceDSA() {
		// Construtor vazio Hibernate
	}

	public FaceDSA(FaceDestino faceDestino) {
		this.setObjectId(faceDestino.getObjectId());
		this.setAgua(faceDestino.getAgua());
		this.setArborizacao(faceDestino.getArborizacao());
		this.setCalcada(faceDestino.getCalcada());
		this.setCodLog(faceDestino.getCodLog());
		this.setColetaDeLixo(faceDestino.getColetaDeLixo());
		this.setConservacaoDaVia(faceDestino.getConservacaoDaVia());
		this.setDistrito(faceDestino.getDistrito());
		this.setDrenagem(faceDestino.getDrenagem());
		this.setEsgoto(faceDestino.getEsgoto());
		this.setEstacionamento(faceDestino.getEstacionamento());
		this.setFace(faceDestino.getFace());
		this.setHidrante(faceDestino.getHidrante());
		this.setIdFace(faceDestino.getIdFace());
		this.setIluminacao(faceDestino.getIluminacao());
		this.setLimpezaPublica(faceDestino.getLimpezaPublica());
		this.setMeioFio(faceDestino.getMeioFio());
		this.setPavimentacao(faceDestino.getPavimentacao());
		this.setPavimento(faceDestino.getPavimento());
		this.setPontoDeServico(faceDestino.getPontoDeServico());
		this.setQuadra(faceDestino.getQuadra());
		this.setRedeEletrica(faceDestino.getRedeEletrica());
		this.setRedeTelefonica(faceDestino.getRedeTelefonica());
		this.setSentidoLogradouro(faceDestino.getSentidoLogradouro());
		this.setSetor(faceDestino.getSetor());
		this.setTipoVia(faceDestino.getTipoVia());
		this.setTransporte(faceDestino.getTransporte());
	}

}
