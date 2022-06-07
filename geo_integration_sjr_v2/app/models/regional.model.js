var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function RegionalModel() {
    Model.apply(this, arguments);
}

Model.extend(RegionalModel);
module.exports = RegionalModel;

// Table name is the only required property.
RegionalModel.tableName = 'tb_regional';

RegionalModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

RegionalModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
RegionalModel.jsonSchema = {
    type: 'object',
    required: [
        
    ],

    properties: {
        de_geocodigo: {},
        nu_cod_regional: {},
        de_regional: {},
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
        dt_ultima_atualizacao_mig: {}
    }
}

RegionalModel.relationMappings = {
    quadras: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/quadra.model',
        join: {
            from: 'tb_regional.nu_cod_regional',
            to: 'tb_quadra.nu_cod_regional'
        }
    }
};
