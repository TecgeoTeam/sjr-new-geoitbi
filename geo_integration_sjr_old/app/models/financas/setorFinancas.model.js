var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function SetorFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(SetorFinancasModel);
module.exports = SetorFinancasModel;

// Table name is the only required property.
SetorFinancasModel.tableName = 'sde.setor';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
SetorFinancasModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        objectid: {},
        num_setor: {},
        num_distrito: {},
        de_geocodigo_: {},
        objectid_1: {},
        de_geocodigo: {},
        de_distrito: {},
        de_setor: {},
        de_qtd_quadra: {},
        de_qtd_lote: {},
        de_qtd_unidade: {},
        nu_area_terreno: {},
        nu_area_unidade: {},
        nu_area_total_construida: {},
        iptu_lancado_0: {},
        tlp_lancado_0: {},
        iptu_lancado_1: {},
        tlp_lancado_1: {},
        iptu_lancado_2: {},
        tlp_lancado_2: {},
        iptu_lancado_3: {},
        tlp_lancado_3: {},
        iptu_lancado_4: {},
        tlp_lancado_4: {},
        iptu_lancado_5: {},
        tlp_lancado_5: {},
        iptu_lancado_6: {},
        tlp_lancado_6: {},
        iptu_arrecadado_0: {},
        tlp__arrecadado_0: {},
        iptu_arrecadado_1: {},
        tlp_arrecadado_1: {},
        iptu_arrecadado_2: {},
        tlp_arrecadado_2: {},
        iptu_arrecadado_3: {},
        tlp_arrecadado_3: {},
        iptu_arrecadado_4: {},
        tlp_arrecadado_4: {},
        iptu_arrecadado_5: {},
        tlp_arrecadado_5: {},
        iptu_arrecadado_6: {},
        tlp_arrecadado_6: {},
        shape: {}
    }
}
