var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
 function DistritoFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(DistritoFinancasModel);
module.exports = DistritoFinancasModel;

// Table name is the only required property.
DistritoFinancasModel.tableName = 'sde.distritos_cadastrais';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
DistritoFinancasModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
      objectid  : {},
      gid : {},
      id : {},
      distrito : {},
      bairros : {},
      de_geocodigo : {},
      nu_qtd_setor : {},
      nu_qtd_quadra : {},
      nu_qtd_lote : {},
      nu_qtd_unidade : {},
      nu_area_terreno : {},
      nu_area_total_construida : {},
      iptu_lancado_0 : {},
      tlp_lancado_0 : {},
      iptu_lancado_1 : {},
      tlp_lancado_1 : {},
      iptu_lancado_2 : {},
      tlp_lancado_2 : {},
      iptu_lancado_3 : {},
      tlp_lancado_3 : {},
      iptu_lancado_4 : {},
      tlp_lancado_4 : {},
      iptu_arrecadado_0 : {},
      tlp__arrecadado_0 : {},
      iptu_arrecadado_1 : {},
      tlp_arrecadado_1 : {},
      iptu_arrecadado_2 : {},
      tlp_arrecadado_2 : {},
      iptu_arrecadado_3 : {},
      tlp_arrecadado_3 : {},
      iptu_arrecadado_4 : {},
      tlp_arrecadado_4 : {},
      dt_ultima_atualizacao_mig : {},
      nu_distrito: {},
      shape: {}
  }
}
