var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function UnidadeItbiModel() {
    Model.apply(this, arguments);
}

Model.extend(UnidadeItbiModel);
module.exports = UnidadeItbiModel;

// Table name is the only required property.
UnidadeItbiModel.tableName = 'tb_unidade_itbi';

UnidadeItbiModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
UnidadeItbiModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_geocodigo: {},
        nu_sequencial: {},
        nu_inscricao_imobiliaria:{},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        de_unidade: {},
        de_processo: {},
        de_moeda: {},
        nu_valor_operacao: {},
        nu_valor_financiado: {},
        nu_valor_avaliacao: {},
        nu_processo_inclusao: {},
        dt_data_avaliacao: {},
        dt_data_negociacao: {},
        de_situacao: {},
        dt_ultima_atualizacao_mig: {}
    }
};
