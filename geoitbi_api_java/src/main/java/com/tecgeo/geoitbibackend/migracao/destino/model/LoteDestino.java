package com.tecgeo.geoitbibackend.migracao.destino.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="sde.TB_LOTES")
@SuppressWarnings("serial")
public class LoteDestino implements Serializable {

	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;
	
	@Column(name="cod_reduzido")
	@Getter @Setter
	private Integer codReduzido;
	
	@Column(name="inscricao_imobiliaria", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String inscricaoImobiliaria;

	@Column(name="tipo_imovel", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String tipoImovel;

	@Column(name="tipo_edificacao", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String tipoEdificacao;

	@Column(name="logradouro_id", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String logradouroId;

	@Column(name="endereco_numero", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoNumero;

	@Column(name="endereco_complemento", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoComplemento;

	@Column(name="loteamento_nome", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String loteamentoNome;

	@Column(name="loteamento_lote", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String loteamentoLote;

	@Column(name="loteamento_quadra", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String loteamentoQuadra;

	@Column(name="id_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String idPessoa;

	@Column(name="nome_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String nomePessoa;

	@Column(name="tipo_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String tipoPessoa;

	@Column(name="cpf_cnpj_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String cpfCnpjPessoa;

	@Column(name="endereco_logradouro_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoLogradouroPessoa;

	@Column(name="endereco_numero_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoNumeroPessoa;

	@Column(name="endereco_complemento_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoComplementoPessoa;

	@Column(name="endereco_bairro_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoBairroPessoa;

	@Column(name="endereco_municipio_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoMunicipioPessoa;

	@Column(name="endereco_uf_pessoa", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String enderecoUfPessoa;

	@Column(name="ocup_do_lote", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String ocupDoLote;

	@Column(name="limites", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String limites;

	@Column(name="topografia", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String topografia;

	@Column(name="pedologia", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String pedologia;

	@Column(name="posicao_lote", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String posicaoLote;

	@Column(name="calcada", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String calcada;

	@Column(name="patrimonio", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String patrimonio;

	@Column(name="area_terreno", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String areaTerreno;

	@Column(name="tipologia", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String tipologia;

	@Column(name="destinacao", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String destinacao;

	@Column(name="alinhamento", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String alinhamento;

	@Column(name="situacao", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String situacao;

	@Column(name="estrutura", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String estrutura;

	@Column(name="paredes_ext", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String paredesExt;

	@Column(name="revest_externo", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String revestExterno;

	@Column(name="esquadrias", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String esquadrias;

	@Column(name="cobertura", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String cobertura;

	@Column(name="conserv", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String conserv;

	@Column(name="vagas_gar", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String vagasGar;

	@Column(name="ano_construcao", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String anoConstrucao;

	@Column(name="elevador", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String elevador;

	@Column(name="piscina", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String piscina;

	@Column(name="quant_pav_und_principal", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String quantPavUndPrincipal;

	@Column(name="area_privativa", columnDefinition="NVARCHAR(255)")
	private String areaPrivativa;
	
	public LoteDestino() {
		//Construtor vazio Hibernate
	}

}
