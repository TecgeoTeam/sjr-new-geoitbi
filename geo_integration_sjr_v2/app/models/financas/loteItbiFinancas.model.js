var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function LoteItbiFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(LoteItbiFinancasModel);
module.exports = LoteItbiFinancasModel;

// Table name is the only required property.
LoteItbiFinancasModel.tableName = 'sde.pl_compesa_lote_itbi';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LoteItbiFinancasModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
        objectid_1: {},
        de_observ: {},
        de_localizado: {},
        objectid: {},
        nu_sequencial: {},
        nu_inscricao_imobiliaria: {},
        de_geocodigo: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        de_qtd_unidade: {},
        de_processo: {},
        de_moeda: {},
        nu_valor_operacao: {},
        nu_valor_financiado: {},
        nu_valor_avaliacao: {},
        dt_data_avaliacao: {},
        dt_data_negociacao: {},
        de_situacao: {},
        shape: {},
        de_processo_inclusao: {}
    }
};