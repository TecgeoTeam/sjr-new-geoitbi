package com.tecgeo.geoitbibackend.master.migracao.dsa.model;

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
import com.tecgeo.geoitbibackend.migracao.destino.model.LoteDestino;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="mig.TEMP_SL_CADASTRO_SDE_TB_LOTES")
@SuppressWarnings("serial")
public class LoteDSA implements Serializable {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="cod_reduzido")
	@Getter @Setter
	private Integer codReduzido;
	
	@Column(name="inscricao_imobiliaria")
	@Getter @Setter
	@Size(max = 50)
	private String inscricaoImobiliaria;

	@Column(name="tipo_imovel")
	@Getter @Setter
	private String tipoImovel;

	@Column(name="tipo_edificacao")
	@Getter @Setter
	private String tipoEdificacao;

	@Column(name="logradouro_id")
	@Getter @Setter
	private String logradouroId;

	@Column(name="endereco_numero")
	@Getter @Setter
	private String enderecoNumero;

	@Column(name="endereco_complemento")
	@Getter @Setter
	private String enderecoComplemento;

	@Column(name="loteamento_nome")
	@Getter @Setter
	private String loteamentoNome;

	@Column(name="loteamento_lote")
	@Getter @Setter
	@Size(max = 50)
	private String loteamentoLote;

	@Column(name="loteamento_quadra")
	@Getter @Setter
	private String loteamentoQuadra;

	@Column(name="id_pessoa")
	@Getter @Setter
	@Size(max = 50)
	private String idPessoa;

	@Column(name="nome_pessoa")
	@Getter @Setter
	private String nomePessoa;

	@Column(name="tipo_pessoa")
	@Getter @Setter
	private String tipoPessoa;

	@Column(name="cpf_cnpj_pessoa")
	@Getter @Setter
	private String cpfCnpjPessoa;

	@Column(name="endereco_logradouro_pessoa")
	@Getter @Setter
	private String enderecoLogradouroPessoa;

	@Column(name="endereco_numero_pessoa")
	@Getter @Setter
	private String enderecoNumeroPessoa;

	@Column(name="endereco_complemento_pessoa")
	@Getter @Setter
	private String enderecoComplementoPessoa;

	@Column(name="endereco_bairro_pessoa")
	@Getter @Setter
	private String enderecoBairroPessoa;

	@Column(name="endereco_municipio_pessoa")
	@Getter @Setter
	private String enderecoMunicipioPessoa;

	@Column(name="endereco_uf_pessoa")
	@Getter @Setter
	private String enderecoUfPessoa;

	@Column(name="ocup_do_lote")
	@Getter @Setter
	private String ocupDoLote;

	@Column(name="limites")
	@Getter @Setter
	private String limites;

	@Column(name="topografia")
	@Getter @Setter
	private String topografia;

	@Column(name="pedologia")
	@Getter @Setter
	private String pedologia;

	@Column(name="posicao_lote")
	@Getter @Setter
	private String posicaoLote;

	@Column(name="calcada")
	@Getter @Setter
	private String calcada;

	@Column(name="patrimonio")
	@Getter @Setter
	private String patrimonio;

	@Column(name="area_terreno")
	@Getter @Setter
	@Size(max = 50)
	private String areaTerreno;

	@Column(name="tipologia")
	@Getter @Setter
	private String tipologia;

	@Column(name="destinacao")
	@Getter @Setter
	private String destinacao;

	@Column(name="alinhamento")
	@Getter @Setter
	private String alinhamento;

	@Column(name="situacao")
	@Getter @Setter
	private String situacao;

	@Column(name="estrutura")
	@Getter @Setter
	private String estrutura;

	@Column(name="paredes_ext")
	@Getter @Setter
	private String paredesExt;

	@Column(name="revest_externo")
	@Getter @Setter
	private String revestExterno;

	@Column(name="esquadrias")
	@Getter @Setter
	private String esquadrias;

	@Column(name="cobertura")
	@Getter @Setter
	private String cobertura;

	@Column(name="conserv")
	@Getter @Setter
	private String conserv;

	@Column(name="vagas_gar")
	@Getter @Setter
	private String vagasGar;

	@Column(name="ano_construcao")
	@Getter @Setter
	private String anoConstrucao;

	@Column(name="elevador")
	@Getter @Setter
	private String elevador;

	@Column(name="piscina")
	@Getter @Setter
	private String piscina;

	@Column(name="quant_pav_und_principal")
	@Getter @Setter
	private String quantPavUndPrincipal;

	@Column(name="area_privativa")
	@Size(max = 50)
	private String areaPrivativa;
	
	public LoteDSA() {
		//Construtor vazio Hibernate
	}

	public LoteDSA(LoteDestino loteDestino) {
		this.setObjectId(loteDestino.getObjectId());
		this.setAlinhamento(loteDestino.getAlinhamento());
		this.setAnoConstrucao(loteDestino.getAnoConstrucao());
		this.setAreaTerreno(loteDestino.getAreaTerreno());
		this.setCalcada(loteDestino.getCalcada());
		this.setCobertura(loteDestino.getCobertura());
		this.setCodReduzido(loteDestino.getCodReduzido());
		this.setConserv(loteDestino.getConserv());
		this.setCpfCnpjPessoa(loteDestino.getCpfCnpjPessoa());
		this.setDestinacao(loteDestino.getDestinacao());
		this.setElevador(loteDestino.getElevador());
		this.setEnderecoBairroPessoa(loteDestino.getEnderecoBairroPessoa());
		this.setEnderecoComplemento(loteDestino.getEnderecoComplemento());
		this.setEnderecoComplementoPessoa(loteDestino.getEnderecoComplementoPessoa());
		this.setEnderecoLogradouroPessoa(loteDestino.getEnderecoLogradouroPessoa());
		this.setEnderecoMunicipioPessoa(loteDestino.getEnderecoMunicipioPessoa());
		this.setEnderecoNumero(loteDestino.getEnderecoNumero());
		this.setEnderecoNumeroPessoa(loteDestino.getEnderecoNumeroPessoa());
		this.setEnderecoUfPessoa(loteDestino.getEnderecoUfPessoa());
		this.setEsquadrias(loteDestino.getEsquadrias());
		this.setEstrutura(loteDestino.getEstrutura());
		this.setIdPessoa(loteDestino.getIdPessoa());
		this.setInscricaoImobiliaria(loteDestino.getInscricaoImobiliaria());
		this.setLimites(loteDestino.getLimites());
		this.setLogradouroId(loteDestino.getLogradouroId());
		this.setLoteamentoLote(loteDestino.getLoteamentoLote());
		this.setLoteamentoNome(loteDestino.getLoteamentoNome());
		this.setLoteamentoQuadra(loteDestino.getLoteamentoQuadra());
		this.setNomePessoa(loteDestino.getNomePessoa());
		this.setOcupDoLote(loteDestino.getOcupDoLote());
		this.setParedesExt(loteDestino.getParedesExt());
		this.setPatrimonio(loteDestino.getPatrimonio());
		this.setPedologia(loteDestino.getPedologia());
		this.setPiscina(loteDestino.getPiscina());
		this.setPosicaoLote(loteDestino.getPosicaoLote());
		this.setQuantPavUndPrincipal(loteDestino.getQuantPavUndPrincipal());
		this.setRevestExterno(loteDestino.getRevestExterno());
		this.setSituacao(loteDestino.getSituacao());
		this.setTipoEdificacao(loteDestino.getTipoEdificacao());
		this.setTipoImovel(loteDestino.getTipoImovel());
		this.setTipologia(loteDestino.getTipologia());
		this.setTipoPessoa(loteDestino.getTipoPessoa());
		this.setTopografia(loteDestino.getTopografia());
		this.setVagasGar(loteDestino.getVagasGar());
	}

}
