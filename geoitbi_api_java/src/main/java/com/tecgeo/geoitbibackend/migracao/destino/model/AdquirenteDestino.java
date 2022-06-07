package com.tecgeo.geoitbibackend.migracao.destino.model;

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

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.TB_ADQUIRENTE")
@SuppressWarnings("serial")
public class AdquirenteDestino implements Serializable {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="de_observacao", columnDefinition="NVARCHAR(800)")
	@Getter @Setter
    private String observacao;
	
	@Column(name="nu_idctacte", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String idCtacte;
	
	@Column(name="parcelada", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String parcelada;
	
	@Column(name="de_terceiraavaliacao", columnDefinition="NVARCHAR(12)")
	@Getter @Setter
    private String terceiraAvaliacao;
	
	@Column(name="de_cpfcnpj", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String cpfCnpj;
	
	@Column(name="de_nome_pessoa", columnDefinition="NVARCHAR(200)")
	@Getter @Setter
    private String nomePessoa;
	
	@Column(name="nu_idpessoa")
	@Getter @Setter
    private Integer idPessoa;
	
	@Column(name="nu_idtransmissao", columnDefinition="NVARCHAR(9)")
	@Getter @Setter
    private String idTransmissao;
	
	@Column(name="nu_percentualrecebido", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String percentualRecebido;
	
	@Column(name="nu_idmunicipio")
	@Getter @Setter
    private Integer idMunicipio;
	
	@Column(name="nu_protocolo", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
    private String protocolo;
	
	@Column(name="nu_idunidadecartorio", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
    private String idUnidadeCartorio;
	
	@Column(name="nu_valortransacao", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
    private String valorTransacao;
	
	@Column(name="nu_possuicorretagem", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String possuiCorretagem;
	
	@Column(name="nu_iddocapagar", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String idDocApagar;
	
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Column(name="dt_solicitacao")
	@Getter @Setter
    private Date dataSolicitacao;
	
	@Column(name="de_idusuariosolicitacao", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String idUsuarioSolicitacao;
	
	@Column(name="de_situacao", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String situacao;
	
	@Column(name="fl_possuifinanciamento", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
    private String possuiFinanciamento;
	
	@Column(name="nu_aliquotaitbi", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String aliquotaItbi;
	
	@Column(name="de_naturezatransmissao", columnDefinition="NVARCHAR(210)")
	@Getter @Setter
    private String naturezaTransmissao;
	
	@Column(name="nu_idimovel", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
    private String idImovel;
	
	@Column(name="nu_valorbase", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String valorBase;
	
	@Column(name="fl_emiteguiaitbi", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
    private String emiteGuiaItbi;
	
	@Column(name="fl_emiteguiaiss", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
    private String emiteGuiaIss;
	
	@Column(name="nu_idqrcode", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
    private String idQrCode;
	
	@Column(name="fl_primeiratransmissao", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
    private String primeiraTransmissao;
	
	@Column(name="nu_valoritbi", columnDefinition="NVARCHAR(28)")
	@Getter @Setter
    private String valorItbi;
	
	@Column(name="nu_idpessoasacado", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
    private String idPessoaSacado;
	
	@Column(name="nu_incidelaudemio", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String incidelaudemio;
	
	@Column(name="de_valorbaseutilizado", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
    private String valorBaseUtilizado;
	
	@Column(name="nu_valorvenal", columnDefinition="NVARCHAR(28)")
	@Getter @Setter
    private String valorVenal;
	
	@Column(name="nu_idold", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
    private String idOld;
	
	@Column(name="nu_migrado", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
    private String migrado;
	
	@Column(name="nu_valorvenalterreno", columnDefinition="NVARCHAR(28)")
	@Getter @Setter
    private String valorVenalTerreno;
	
	@Column(name="nu_valorvenaledificacao", columnDefinition="NVARCHAR(28)")
	@Getter @Setter
    private String valorVenalEdificacao;
	
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Column(name="dt_ultima_atualizacao_mig")
	@Getter @Setter
	private Date dataUltimaAtualizacaoMig;
	
	public AdquirenteDestino() {
		// Construtor vazio Hibernate
	}
	
}
