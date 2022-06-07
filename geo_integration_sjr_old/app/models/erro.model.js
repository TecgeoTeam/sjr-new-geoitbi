var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function ErroModel() {
    Model.apply(this, arguments);
}

Model.extend(ErroModel);
module.exports = ErroModel;

// Table name is the only required property.
ErroModel.tableName = 'tb_erro_log';

ErroModel.prototype.$beforeInsert = function() {
    this.dt_criacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
ErroModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_nome_tabela: {},
        de_nome_coluna_chave: {},
        nu_valor_coluna_chave: {},
        de_nome_coluna_erro: {},
        de_valor_coluna_erro: {},
        de_tipo: {},
        de_mensagem: {},
        de_criticidade: {},
        dt_criacao: {}
    }
};
