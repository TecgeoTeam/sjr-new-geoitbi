var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function BairroMigracaoModel() {
    Model.apply(this, arguments);
}

Model.extend(BairroMigracaoModel);
module.exports = BairroMigracaoModel;

// Table name is the only required property.
BairroMigracaoModel.tableName = 'tb_bairro_mig';

BairroMigracaoModel.prototype.$beforeInsert = function() {
    this.dt_criacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
BairroMigracaoModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        nu_codigo: {},
        de_descricao: {},
        dt_criacao:{}
    }
};
