var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function UnidadeFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(UnidadeFinancasModel);
module.exports = UnidadeFinancasModel;

// Table name is the only required property.
UnidadeFinancasModel.tableName = 'sde.TB_UNIDADES_PROP';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
UnidadeFinancasModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
        OBJECTID: {},
        ID_IMOVEL: {},
        DE_INSCRICAO: {},
        DE_REF_CADASTRAL: {},
        DE_DISTRITO: {},
        DE_SETOR: {},
        DE_QUADRA_FISCAL: {},
        DE_LOTE_FISCAL: {},
        DE_UNIDADE: {},
        NU_COD_LOGRADOURO: {},
        DE_LOGRADOURO: {},
        DE_NUMERO: {},
        DE_COMPLEMENTO: {},
        DE_CEP: {},
        DE_BAIRRO: {},
        DE_IDADE: {},
        NU_EDIFICACACOES: {},
        DE_TIPO_CONDOMINIO: {},
        DE_CONDOMINIO: {},
        DE_USO: {},
        DE_ZONA_REFERENCIA: {},
        DE_ZONA_FISCAL: {},
        NU_TESTADA_T1: {},
        NU_AREA_TERRENO: {},
        DE_TIPO_TERRENO: {},
        DE_ANO_TERRENO: {},
        NU_VALOR_TERRENO: {},
        DE_AGUA: {},
        DE_ESTACIONAMENTO: {},
        DE_TRANSPORTE_COLETIVO: {},
        DE_CONSERVACAO_VIA: {},
        DE_LIMPEZA_PUBLICA: {},
        DE_OCUPACAO_DO_LOTE: {},
        DE_PEDOLOGIA: {},
        DE_DRENAGEM: {},
        DE_REDE_ELETRICA: {},
        DE_COLETA_LIXO: {},
        DE_SITUACAO: {},
        DE_ILUMINACAO: {},
        DE_TIPO_VIA: {},
        DE_SENTIDO_LOGRADOURO: {},
        DE_PAVIMENTACAO: {},
        DE_CODIGO_MENSAGEM: {},
        DE_COBRANCA: {},
        DE_LIMITE: {},
        DE_REDE_TELEFONICA: {},
        DE_HIDRANTE: {},
        DE_TOPOGRAFIA: {},
        DE_PATRIMONIO: {},
        DE_ARBORIZACAO: {},
        DE_PONTO_SERVICO: {},
        DE_ESGOTO: {},
        DE_CALCADA: {},
        DE_MEIOFIO: {},
        NU_AREA_CONSTRUIDA: {},
        DE_TIPO_IMOVEL: {},
        DE_ANO_PREDIAL: {},
        NU_CARAC_VALOR_PREDIAL: {},
        DE_PAVIMENTOS: {},
        DE_CONSERVACAO: {},
        DE_USO_IMOVEL: {},
        DE_DESTINACAO: {},
        DE_TIPOLOGIA: {},
        DE_PADRAO_CONSTRUCAO: {},
        DE_SENTIDO: {},
        DE_ELEVADOR: {},
        DE_ESTRUTURA: {},
        DE_SITUACAO_PREFEITURA: {},
        DE_PAR: {},
        DE_POSICAO_CONSTRUCAO: {},
        DE_IRREGULARIDADE: {},
        DE_CALCADA_PEDESTRE: {},
        DE_ESQUADRIA: {},
        DE_AREA_VERDE: {},
        DE_IMOVEL_NA_PLANTA: {},
        DE_FACHADA_PRINCIPAL: {},
        DE_COBERTURA: {},
        NU_IMO_VALOR_TERRITORIO: {},
        NU_IMO_VALOR_PREDIAL: {},
        NU_IMO_VALOR_VENAL: {},
        NU_IMO_VALOR_IPTU: {},
        NU_FRACAO_IDEAL: {},
        DT_DATA_MIGRACAO: {},
        DE_GEOCODE_STM: {},
        DE_COD_SQCODLOG: {},
        DE_INSCRICAO_ANTERIOR: {},
        DE_ISENTO: {},
        GEOCODE_ID: {},
        DE_PROP_NOME: {},
        DE_PROP_CPF: {},
        DE_PROP_CIDADE: {},
        DE_PROP_UF: {},
        DE_PROP_AQUISICAO: {},
        DE_PROP_ENDERECO: {},
        DE_PROP_NUMERO: {},
        DE_PROP_COMPLEMENTO: {},
        DE_PROP_CEP: {},
        DE_PROP_BAIRRO: {},
        DE_PROP_QUADRA: {},
        DE_PROP_FONE: {},
        DE_PROP_EMAIL: {},
        DE_GEOCODE_LOTE: {},
        de_face: {},
        DE_COD_LOG_ANT: {},
        DE_SEQUENCIAL_ANTERIOR: {},
        NU_GEO_FACE: {}
    }
};
