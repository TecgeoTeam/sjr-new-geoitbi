var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
 function LogradouroModel() {
    Model.apply(this, arguments);
}

Model.extend(LogradouroModel);
module.exports = LogradouroModel;

// Table name is the only required property.
LogradouroModel.tableName = 'sde.TB_LOGRADOURO';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LogradouroModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      OBJECTID: {},
      de_codlogradouro: {},
      nu_idtipologr: {},
      de_nomelogradouro: {},
      nu_idlogradouroini: {},
      nu_idlogradourofim: {},
      de_cep: {},
      nu_idbairro: {}
   }
};
