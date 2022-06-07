var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function ItbiModel() {
    Model.apply(this, arguments);
}

Model.extend(ItbiModel);
module.exports = ItbiModel;

// Table name is the only required property.
ItbiModel.tableName = 'tb_itbi';

ItbiModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
ItbiModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_geocodigo: {},
        nu_sequencial: {},
        nu_inscricao: {},
        nu_codigo: {},
        nu_processo: {},
        nu_qtd_unidade: {},
        de_inscricao_imobiliaria:{},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        de_unidade: {},
        de_processo: {},
        de_processo_inclusao: {},
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

ItbiModel.relationMappings = {
    unidadesItbi: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/unidadeItbi.model',
        join: {
            from: 'tb_itbi.de_geocodigo',
            to: 'tb_unidade_itbi.de_geocodigo'
        }
    }
};
