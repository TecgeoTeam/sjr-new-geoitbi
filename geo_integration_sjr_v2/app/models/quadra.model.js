var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function QuadraModel() {
    Model.apply(this, arguments);
}

Model.extend(QuadraModel);
module.exports = QuadraModel;

// Table name is the only required property.
QuadraModel.tableName = 'tb_quadra';

QuadraModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

QuadraModel.prototype.$beforeUpdate = function() {
    this.dt_ultima_atualizacao_mig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
QuadraModel.jsonSchema = {
    type: 'object',
    required: [
        
    ],

    properties: {
        de_geocodigo: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        nu_cod_bairro: {},
        de_cod_face_de_quadra: {},
        nu_area_terreno: {},
        nu_area_total_construida: {},
        nu_area_unidade: {},
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
        nu_cod_regional: {},
        de_bairro: {},
        de_cod_loteamento: {},
        de_loteamento: {},
        de_regional: {},
        dt_ultima_atualizacao_mig: {}
    }
}

QuadraModel.relationMappings = {
    lotes: {
        relation: Model.HasManyRelation,
        // The related model. This can be either a Model
        // subclass constructor or an absolute file path
        // to a module that exports one. We use the file
        // path version in this example to prevent require
        // loops.
        modelClass: __dirname + '/lote.model',
        join: {
            from: ['tb_quadra.de_distrito','tb_quadra.de_setor','tb_quadra.de_quadra'],
            to: ['tb_lote.de_distrito','tb_lote.de_setor','tb_lote.de_quadra']
        }
    }
};
