var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function DistritoModel() {
    Model.apply(this, arguments);
}

Model.extend(DistritoModel);
module.exports = DistritoModel;

// Table name is the only required property.
DistritoModel.tableName = 'tb_distrito';

DistritoModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

DistritoModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
DistritoModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        de_geocodigo: {},
        nu_distrito: {},
        nu_area_terreno: {},
        nu_area_total_construida: {},
        nu_iptu_arrecadado_0: {},
        nu_iptu_arrecadado_1: {},
        nu_iptu_arrecadado_2: {},
        nu_iptu_arrecadado_3: {},
        nu_iptu_arrecadado_4: {},
        nu_iptu_arrecadado_5: {},
        nu_iptu_arrecadado_6: {},
        nu_iptu_lancado_0: {},
        nu_iptu_lancado_1: {},
        nu_iptu_lancado_2: {},
        nu_iptu_lancado_3: {},
        nu_iptu_lancado_4: {},
        nu_iptu_lancado_5: {},
        nu_iptu_lancado_6: {},
        nu_tlp_arrecadado_0: {},
        nu_tlp_arrecadado_1: {},
        nu_tlp_arrecadado_2: {},
        nu_tlp_arrecadado_3: {},
        nu_tlp_arrecadado_4: {},
        nu_tlp_arrecadado_5: {},
        nu_tlp_arrecadado_6: {},
        nu_tlp_lancado_0: {},
        nu_tlp_lancado_1: {},
        nu_tlp_lancado_2: {},
        nu_tlp_lancado_3: {},
        nu_tlp_lancado_4: {},
        nu_tlp_lancado_5: {},
        nu_tlp_lancado_6: {},
        nu_qtd_unidade: {},
        nu_qtd_lote: {},
        nu_qtd_quadra: {},
        nu_qtd_setor: {},
        dt_ultima_atualizacao_mig: {}
    }
}

DistritoModel.relationMappings = {
    setores: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/setor.model',
        join: {
            from: 'tb_distrito.nu_distrito',
            to: 'tb_setor.de_distrito'
        }
    }
};
