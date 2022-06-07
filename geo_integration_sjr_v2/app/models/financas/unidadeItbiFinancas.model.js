var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function UnidadeItbiFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(UnidadeItbiFinancasModel);
module.exports = UnidadeItbiFinancasModel;

// Table name is the only required property.
UnidadeItbiFinancasModel.tableName = 'sde.tb_vw_itbi_';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
UnidadeItbiFinancasModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
        objectid: {},
        nu_sequencial: {},
        de_geocodigo: {},
        nu_inscricao_imobiliaria: {},
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
        de_situacao: {}
    }
};