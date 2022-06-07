var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function BcfqIptuModel() {
    Model.apply(this, arguments);
}

Model.extend(BcfqIptuModel);
module.exports = BcfqIptuModel;

// Table name is the only required property.
BcfqIptuModel.tableName = 'tb_bcfq_iptu';

BcfqIptuModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
BcfqIptuModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        'id': {},
        nu_sequencial: {},
        de_inscricao_imobiliaria: {},
        nu_area_terreno: {},
        nu_qtd_unidade:{},
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
        'fl_arborizacao': {},
        'nu_cod_bairro': {},
        'de_bairro': {},
        'de_cep': {},
        'nu_cod_face_de_quadra': {},
        'fl_coleta_lixo': {},
        'fl_emplacamento': {},
        'de_face_quadra': {},
        'fl_galerias_pluviais': {},
        'fl_guias_sarjetas': {},
        'de_iluminacao_publica': {},
        'fl_limpeza_urbana': {},
        'de_cod_logradouro': {},
        'de_logradouro': {},
        'de_pavimentacao': {},
        'fl_rede_agua': {},
        'fl_rede_eletrica': {},
        'fl_rede_esgoto': {},
        'fl_rede_telefone': {},
        'nu_cod_regional': {},
        'nu_v0': {},
        'de_zoneamento': {},
        'dt_ultima_atualizacao_mig': {}
    }
};

BcfqIptuModel.relationMappings = {
    unidades: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/iptuMigracao.model',
        join: {
            from: 'tb_bcfq_iptu.nu_cod_face_de_quadra',
            to: 'tb_iptu_mig.nu_cod_face_de_quadra'
        }
    }
};
