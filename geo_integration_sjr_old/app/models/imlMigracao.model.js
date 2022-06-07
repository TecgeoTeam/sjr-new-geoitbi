var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function ImlMigracaoModel() {
    Model.apply(this, arguments);
}

Model.extend(ImlMigracaoModel);
module.exports = ImlMigracaoModel;

// Table name is the only required property.
ImlMigracaoModel.tableName = 'tb_iml_mig';

ImlMigracaoModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

ImlMigracaoModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
ImlMigracaoModel.jsonSchema = {
    type: 'object',
    required: [
        
    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
            fl_permite_apgi:{},
            nu_limite_face_final:{},
            nu_limite_face_inicial:{},
            de_codigo:{},
            de_codigo_anterior:{},
            de_limite_logradouro_final:{},
            de_limite_logradouro_inicial:{},
            de_nome:{},
            de_nome_completo:{},
            de_origem:{},
            de_prep:{},
            de_tipo:{},
            de_titulo:{},
            de_bairros:{},
            dt_ultima_atualizacao_mig:{}
    }
};



