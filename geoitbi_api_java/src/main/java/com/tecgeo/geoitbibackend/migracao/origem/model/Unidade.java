package com.tecgeo.geoitbibackend.migracao.origem.model;

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

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name="TB_UNIDADES_PROP")
@SuppressWarnings("serial")
public class Unidade implements Serializable {
	
	@Id
	@GeneratedValue(strategy=GenerationType.AUTO)
	@Column(name="OBJECTID")
	@Getter @Setter
	private Integer objectId;

	@Column(name="ID_IMOVEL")
	@Getter @Setter
	private Integer idImovel;
	
	@Column(name="DE_INSCRICAO", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String inscricao;
	
	@Column(name="DE_REF_CADASTRAL", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String refCadastral;
	
	@Column(name="DE_DISTRITO", columnDefinition="NVARCHAR(2)")
	@Getter @Setter
	private String distrito;
	
	@Column(name="DE_SETOR", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String setor;
	
	@Column(name="DE_QUADRA_FISCAL", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String quadraFiscal;
	
	@Column(name="DE_LOTE_FISCAL", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String loteFiscal;
	
	@Column(name="DE_UNIDADE", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String unidade;
	
	@Column(name="NU_COD_LOGRADOURO")
	@Getter @Setter
	private Integer codLogradouro;
	
	@Column(name="DE_LOGRADOURO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String logradouro;
	
	@Column(name="DE_NUMERO", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String numero;
	
	@Column(name="DE_COMPLEMENTO", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String complemento;
	
	@Column(name="DE_CEP", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String cep;
	
	@Column(name="DE_BAIRRO", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String bairro;
	
	@Column(name="DE_IDADE", columnDefinition="NVARCHAR(3)")
	@Getter @Setter
	private String idade;
	
	@Column(name="NU_EDIFICACACOES", columnDefinition="SMALLINT")
	@Getter @Setter
	private Integer edificacoes;
	
	@Column(name="DE_TIPO_CONDOMINIO", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String tipoCondominio;
	
	@Column(name="DE_CONDOMINIO", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
	private String condominio;
	
	@Column(name="DE_USO", columnDefinition="NVARCHAR(45)")
	@Getter @Setter
	private String uso;
	
	@Column(name="DE_ZONA_REFERENCIA", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String zonaReferencia;
	
	@Column(name="DE_ZONA_FISCAL", columnDefinition="SMALLINT")
	@Getter @Setter
	private Integer zonaFiscal;
	
	@Column(name="NU_TESTADA_T1")
	@Getter @Setter
	private BigDecimal testadaT1;
	
	@Column(name="NU_AREA_TERRENO")
	@Getter @Setter
	private BigDecimal areaTerreno;
	
	@Column(name="DE_TIPO_TERRENO", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String tipoTerreno;
	
	@Column(name="DE_ANO_TERRENO", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String anoTerreno;
	
	@Column(name="NU_VALOR_TERRENO")
	@Getter @Setter
	private BigDecimal valorTerreno;
	
	@Column(name="DE_AGUA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String agua;
	
	@Column(name="DE_ESTACIONAMENTO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String estacionamento;
	
	@Column(name="DE_TRANSPORTE_COLETIVO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String transporteColetivo;
	
	@Column(name="DE_CONSERVACAO_VIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String conservacaoVia;
	
	@Column(name="DE_LIMPEZA_PUBLICA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String limpezaPublica;
	
	@Column(name="DE_OCUPACAO_DO_LOTE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String ocupacaoDoLote;
	
	@Column(name="DE_PEDOLOGIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String pedologia;
	
	@Column(name="DE_DRENAGEM", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String drenagem;
	
	@Column(name="DE_REDE_ELETRICA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String redeEletrica;
	
	@Column(name="DE_COLETA_LIXO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String coletaLixo;
	
	@Column(name="DE_SITUACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String situacao;
	
	@Column(name="DE_ILUMINACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String iluminacao;
	
	@Column(name="DE_TIPO_VIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String tipoVia;
	
	@Column(name="DE_SENTIDO_LOGRADOURO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String sentidoLogradouro;
	
	@Column(name="DE_PAVIMENTACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String pavimentacao;
	
	@Column(name="DE_CODIGO_MENSAGEM", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String codigoMensagem;
	
	@Column(name="DE_COBRANCA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String cobranca;
	
	@Column(name="DE_LIMITE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String limite;
	
	@Column(name="DE_REDE_TELEFONICA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String redeTelefonica;
	
	@Column(name="DE_HIDRANTE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String hidrante;
	
	@Column(name="DE_TOPOGRAFIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String topografia;
	
	@Column(name="DE_PATRIMONIO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String patrimonio;
	
	@Column(name="DE_ARBORIZACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String arborizacao;
	
	@Column(name="DE_PONTO_SERVICO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String pontoServico;
	
	@Column(name="DE_ESGOTO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String esgoto;
	
	@Column(name="DE_CALCADA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String calcada;
	
	@Column(name="DE_MEIOFIO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String meiofio;
	
	@Column(name="NU_AREA_CONSTRUIDA")
	@Getter @Setter
	private BigDecimal areaConstruida;
	
	@Column(name="DE_TIPO_IMOVEL", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String tipoImovel;
	
	@Column(name="DE_ANO_PREDIAL", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String anoPredial;
	
	@Column(name="NU_CARAC_VALOR_PREDIAL")
	@Getter @Setter
	private BigDecimal caracValorPredial;
	
	@Column(name="DE_PAVIMENTOS", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String pavimentos;
	
	@Column(name="DE_CONSERVACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String conservacao;
	
	@Column(name="DE_USO_IMOVEL", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String usoimovel;
	
	@Column(name="DE_DESTINACAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String destinacao;
	
	@Column(name="DE_TIPOLOGIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String tipologia;
	
	@Column(name="DE_PADRAO_CONSTRUCAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String padraoConstrucao;
	
	@Column(name="DE_SENTIDO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String sentido;
	
	@Column(name="DE_ELEVADOR", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String elevador;
	
	@Column(name="DE_ESTRUTURA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String estrutura;
	
	@Column(name="DE_SITUACAO_PREFEITURA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String situacaoPrefeitura;
	
	@Column(name="DE_PAR", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String par;
	
	@Column(name="DE_POSICAO_CONSTRUCAO", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String posicaoConstrucao;
	
	@Column(name="DE_IRREGULARIDADE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String irregularidade;
	
	@Column(name="DE_CALCADA_PEDESTRE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String calcadaPedestre;
	
	@Column(name="DE_ESQUADRIA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String esquadria;
	
	@Column(name="DE_AREA_VERDE", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String areaVerde;
	
	@Column(name="DE_IMOVEL_NA_PLANTA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String imovelNaPlanta;
	
	@Column(name="DE_FACHADA_PRINCIPAL", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String fachadaPrincipal;
	
	@Column(name="DE_COBERTURA", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String cobertura;
	
	@Column(name="NU_IMO_VALOR_TERRITORIO")
	@Getter @Setter
	private BigDecimal imoValorTerritorio;
	
	@Column(name="NU_IMO_VALOR_PREDIAL")
	@Getter @Setter
	private BigDecimal imoValorPredial;
	
	@Column(name="NU_IMO_VALOR_VENAL")
	@Getter @Setter
	private BigDecimal imoValorVenal;
	
	@Column(name="NU_IMO_VALOR_IPTU")
	@Getter @Setter
	private BigDecimal imoValorIptu;
	
	@Column(name="NU_FRACAO_IDEAL")
	@Getter @Setter
	private BigDecimal fracaoIdeal;
	
	@Column(name="DE_PROP_NOME", columnDefinition="NVARCHAR(255)")
	@Getter @Setter
	private String propNome;
	
	@Column(name="DE_PROP_CPF", columnDefinition="NVARCHAR(14)")
	@Getter @Setter
	private String propCpf;
	
	@Column(name="DE_PROP_CIDADE", columnDefinition="NVARCHAR(50)")
	@Getter @Setter
	private String propCidade;
	
	@Column(name="DE_PROP_UF", columnDefinition="NVARCHAR(2)")
	@Getter @Setter
	private String propUf;
	
	@Column(name="DE_PROP_AQUISICAO", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String propAquisicao;
	
	@Column(name="DE_PROP_ENDERECO", columnDefinition="NVARCHAR(120)")
	@Getter @Setter
	private String propEndereco;
	
	@Column(name="DE_PROP_NUMERO", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String propNumero;
	
	@Column(name="DE_PROP_COMPLEMENTO", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String propComplemento;
	
	@Column(name="DE_PROP_CEP", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String propCep;
	
	@Column(name="DE_PROP_BAIRRO", columnDefinition="NVARCHAR(60)")
	@Getter @Setter
	private String propBairro;
	
	@Column(name="DE_PROP_QUADRA", columnDefinition="NVARCHAR(4)")
	@Getter @Setter
	private String propQuadra;
	
	@Column(name="DE_PROP_FONE", columnDefinition="NVARCHAR(30)")
	@Getter @Setter
	private String propFone;
	
	@Column(name="DE_PROP_EMAIL", columnDefinition="NVARCHAR(100)")
	@Getter @Setter
	private String propEmail;
	
	@Temporal(TemporalType.TIMESTAMP)
	@JsonFormat(shape = JsonFormat.Shape.STRING, 
	pattern = "dd/MM/yyyy HH:mm:ss", locale = "pt-BR", timezone = "Brazil/East")
	@Column(name="DT_DATA_MIGRACAO")
	@Getter @Setter
    private Date dataMigracao;
	
	@Column(name="DE_GEOCODE_STM", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String geocodeStm;
	
	@Column(name="DE_COD_SQCODLOG", columnDefinition="NVARCHAR(15)")
	@Getter @Setter
	private String codSqCodLog;
	
	@Column(name="DE_INSCRICAO_ANTERIOR", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String inscricaoAnterior;
	
	@Column(name="DE_ISENTO", columnDefinition="NVARCHAR(10)")
	@Getter @Setter
	private String isento;
	
	@Column(name="GEOCODE_ID", columnDefinition="NVARCHAR(18)")
	@Getter @Setter
	private String geocodeId;
	
	@Column(name="DE_GEOCODE_LOTE", columnDefinition="NVARCHAR(20)")
	@Getter @Setter
	private String geocodeLote;

	public Unidade() {
		// Construtor vazio Hibernate
	}
}
