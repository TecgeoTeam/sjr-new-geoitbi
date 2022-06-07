var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function BcfqModel() {
    Model.apply(this, arguments);
}

Model.extend(BcfqModel);
module.exports = BcfqModel;

// Table name is the only required property.
BcfqModel.tableName = 'tb_bcfq_mig';

BcfqModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
BcfqModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        'de_geocodigo': {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_face: {},
        'fl_arborizacao': {},
        'nu_cod_bairro': {},
        'de_bairro': {},
        'de_cep': {},
        'nu_codigo': {},
        'fl_coleta_lixo': {},
        'fl_emplacamento': {},
        'de_face_quadra': {},
        'fl_galerias_pluviais': {},
        'fl_guias_sarjetas': {},
        'de_iluminacao_publica': {},
        'fl_limpeza_urbana': {},
        'de_cod_logradouro': {},
        'de_logradouro': {},
        'fl_pavimentacao': {},
        'fl_rede_agua': {},
        'fl_rede_eletrica': {},
        'fl_rede_esgoto': {},
        'fl_rede_telefone': {},
        'nu_cod_regional': {},
        'nu_v0': {},
        'de_zoneamento': {},
        'dt_ultima_atualizacao_mig': {},
        'nu_cod_face_de_quadra': {},
        'de_pavimentacao': {}
    }
};
