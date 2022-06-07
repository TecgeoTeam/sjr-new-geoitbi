var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function LogModel() {
    Model.apply(this, arguments);
}

Model.extend(LogModel);
module.exports = LogModel;

// Table name is the only required property.
LogModel.tableName = 'tb_log';

LogModel.prototype.$beforeInsert = function() {
    this.dt_criacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LogModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_mensagem: {},
        dt_criacao: {},
        de_nome_tabela:{},
        de_tipo:{},
        nu_registro:{}
    }
};
