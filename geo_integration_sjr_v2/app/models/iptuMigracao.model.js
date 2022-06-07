var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function IptuMigracaoModel() {
    Model.apply(this, arguments);
}

Model.extend(IptuMigracaoModel);
module.exports = IptuMigracaoModel;

// Table name is the only required property.
IptuMigracaoModel.tableName = 'tb_iptu_mig';

IptuMigracaoModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

IptuMigracaoModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
IptuMigracaoModel.jsonSchema = {
    type: 'object',
    required: [
        'nu_aliquota',
        'nu_area_terreno',
        'nu_area_total_construida',
        'nu_area_unidade',
        'nu_fracao_ideal',
        'nu_iptu_lancado_6',
        'nu_iptu_lancado_5',
        'nu_iptu_lancado_4',
        'nu_iptu_lancado_3',
        'nu_iptu_lancado_2',
        'nu_iptu_lancado_1',
        'nu_iptu_lancado_0',
        'nu_iptu_arrecadado_6',
        'nu_iptu_arrecadado_5',
        'nu_iptu_arrecadado_4',
        'nu_iptu_arrecadado_3',
        'nu_iptu_arrecadado_2',
        'nu_iptu_arrecadado_1',
        'nu_iptu_arrecadado_0',
        'nu_tlp_lancado_6',
        'nu_tlp_lancado_5',
        'nu_tlp_lancado_4',
        'nu_tlp_lancado_3',
        'nu_tlp_lancado_2',
        'nu_tlp_lancado_1',
        'nu_tlp_lancado_0',
        'nu_sequencial',
        'nu_tlp_arrecadado_6',
        'nu_tlp_arrecadado_5',
        'nu_tlp_arrecadado_4',
        'nu_tlp_arrecadado_3',
        'nu_tlp_arrecadado_2',
        'nu_tlp_arrecadado_1',
        'nu_tlp_arrecadado_0',
        'nu_testada_ficticia',
        'nu_v0',
        'nu_vu',
        'nu_vulp',
        'nu_valor_venal'
    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_geocodigo: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_face_quadra: {},
        de_lote: {},
        de_unidade: {},
        fl_carne_devolvido: { type: 'boolean' },
        dt_datacadastro: {},
        dt_datahabite_se: {},
        nu_aliquota: {},
        nu_area_terreno: {},
        nu_area_total_construida: {},
        nu_area_unidade: {},
        nu_fracao_ideal: {},
        nu_iptu_arrecadado_0: {},
        nu_iptu_arrecadado_1: {},
        nu_iptu_arrecadado_2: {},
        nu_iptu_arrecadado_3: {},
        nu_iptu_arrecadado_4: {},
        nu_iptu_arrecadado_5: {},
        nu_iptu_arrecadado_6: {},
        nu_iptu_lancado_0: {},
        nu_iptu_lancado_1: {},
        nu_iptu_lancado_2: {},
        nu_iptu_lancado_3: {},
        nu_iptu_lancado_4: {},
        nu_iptu_lancado_5: {},
        nu_iptu_lancado_6: {},
        nu_sequencial: {},
        nu_testada_ficticia: {},
        nu_tlp_arrecadado_0: {},
        nu_tlp_arrecadado_1: {},
        nu_tlp_arrecadado_2: {},
        nu_tlp_arrecadado_3: {},
        nu_tlp_arrecadado_4: {},
        nu_tlp_arrecadado_5: {},
        nu_tlp_arrecadado_6: {},
        nu_tlp_lancado_0: {},
        nu_tlp_lancado_1: {},
        nu_tlp_lancado_2: {},
        nu_tlp_lancado_3: {},
        nu_tlp_lancado_4: {},
        nu_tlp_lancado_5: {},
        nu_tlp_lancado_6: {},
        nu_v0: {},
        nu_valor_venal: {},
        nu_vu: {},
        nu_vulp: {},
        nu_codigo: {},
        nu_cod_bairro: {},
        nu_cod_face_de_quadra: {},
        de_cod_logradouro: {},
        nu_cod_regional: {},
        de_bairro: { maxLength: 500 },
        de_calcada: { maxLength: 9 },
        de_cep: { maxLength: 20 },
        de_cod_loteamento: {},
        de_codigo_vu: {},
        de_complemento: { maxLength: 500 },
        de_edificio: { maxLength: 500 },
        de_estado_conservacao: {},
        de_estrutura: {},
        de_imposto: {},
        de_inscricao_imobiliaria: { maxLength: 30 },
        de_limitacao_lote: {},
        de_limpeza: {},
        de_logradouro: { maxLength: 500 },
        de_loteamento: { maxLength: 500 },
        de_natureza: { maxLength: 500 },
        de_numero: {},
        de_padrao_qualidade: {},
        de_pavimentacao: {},
        de_pedologia: {},
        de_proprietario: {},
        de_regional: {},
        de_revestimento: {},
        de_situacao_exercicio_atual: {},
        de_tipo_imovel: {},
        de_topografia: {},
        de_utilizacao: {},
        de_cpf_cnpj: {},
        dt_ultima_atualizacao_mig: {}
    }
};

IptuMigracaoModel.relationMappings = {
    lotePai: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/lote.model',
        join: {
            from: 'tb_iptu_mig.de_geocodigo',
            to: 'tb_lote.de_geocodigo'
        }
    }
};

