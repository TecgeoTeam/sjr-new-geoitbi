var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function ConfigModel() {
    Model.apply(this, arguments);
}

Model.extend(ConfigModel);
module.exports = ConfigModel;

// Table name is the only required property.
ConfigModel.tableName = 'tb_config';

ConfigModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

ConfigModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
ConfigModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_config: {},
        dt_ultima_atualizacao: {}
        
    }
};
