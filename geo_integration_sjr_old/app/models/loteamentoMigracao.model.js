var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function LoteamentoMigracaoModel() {
    Model.apply(this, arguments);
}

Model.extend(LoteamentoMigracaoModel);
module.exports = LoteamentoMigracaoModel;

// Table name is the only required property.
LoteamentoMigracaoModel.tableName = 'tb_loteamento_mig';

LoteamentoMigracaoModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LoteamentoMigracaoModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        de_codigo: {},
        de_descricao: {},
        dt_ultima_atualizacao:{}
    }
};
