var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function LoteModel() {
    Model.apply(this, arguments);
}

Model.extend(LoteModel);
module.exports = LoteModel;

// Table name is the only required property.
LoteModel.tableName = 'tb_lote';

LoteModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

LoteModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LoteModel.jsonSchema = {
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
        nu_sequencial: {},
        de_geocodigo: {},
        de_inscricao_imobiliaria: {},
        de_cpf_cnpj: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        nu_cod_bairro: {},
        nu_cod_face_de_quadra: {},
        de_cod_logradouro: {},
        nu_area_terreno: {},
        nu_area_total_construida: {},
        nu_area_unidade: {},
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
        nu_qtd_unidade: {},
        nu_cod_regional: {},
        de_bairro: {},
        de_calcada: {},
        de_cep: {},
        de_cod_loteamento: {},
        de_complemento: {},
        de_edificio: {},
        de_imposto: {},
        de_limitacao_lote: {},
        de_limpeza: {},
        de_logradouro: {},
        de_loteamento: {},
        de_natureza: {},
        de_numero: {},
        de_padrao_qualidade: {},
        de_pedologia: {},
        de_proprietario: {},
        de_regional: {},
        de_situacao_exercicio_atual: {},
        de_topografia: {},
        de_utilizacao: {},
        nu_qtd_utili_religiosa: {},
        nu_qtd_utili_servico_publico: {},
        nu_qtd_utili_comercio: {},
        nu_qtd_utili_residencial: {},
        nu_qtd_transacao_itbi: {},
        fl_relacao_iptu_mercantil: {},
        dt_ultima_atualizacao_mig: {}
    }
}

LoteModel.relationMappings = {
    unidades: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/iptuMigracao.model',
        join: {
            from: 'tb_lote.de_geocodigo',
            to: 'tb_iptu_mig.de_geocodigo'
        }
    },
    mercantil: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/mercantil.model',
        join: {
            from: 'tb_lote.de_geocodigo',
            to: 'tb_mercantil.de_geocodigo'
        }
    },
    itbi: {
        relation: Model.BelongsToOneRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/itbi.model',
        join: {
            from: 'tb_lote.de_geocodigo',
            to: 'tb_itbi.de_geocodigo'
        }
    }
};
