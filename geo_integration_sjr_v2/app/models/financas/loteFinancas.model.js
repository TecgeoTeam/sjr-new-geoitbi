var Model = require('objection').Model;

/**
* @extends Model
* @constructor
*/
function LoteFinancasModel() {
  Model.apply(this, arguments);
}

Model.extend(LoteFinancasModel);
module.exports = LoteFinancasModel;

// Table name is the only required property.
LoteFinancasModel.tableName = 'sde.TB_LOTES';

LoteFinancasModel.prototype.$beforeInsert = function() {
  this.dtultimaatualizacaomig = new Date().toISOString();
};

LoteFinancasModel.prototype.$beforeUpdate = function() {
  this.dtultimaatualizacaomig = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LoteFinancasModel.jsonSchema = {
  type: 'object',
  required: [

  ],

  properties: {
    OBJECTID: {},
    DE_GEOCODE_LOTE: {},
    DE_ID: {},
    DE_SETOR: {},
    DE_QUADRA: {},
    DE_LOTE: {},
    NU_AREA_TERRENO: {},
    DE_LIMITES: {},
    DE_CALCADA_PEDESTRE: {},
    DE_POSICAO_LOTE: {},
    DE_TOPOGRAFIA: {},
    DE_PEDOLOGIA: {},
    DE_ARBORIZACAO: {},
    DE_IRREGULARIDADE: {},
    NU_LOTE_VINCULANTE: {},
    NU_TESTADA_T1: {},
    DE_CODLOG_T1: {},
    NU_TESTADA_T2: {},
    DE_CODLOG_T2: {},
    NU_TESTADA_T3: {},
    DE_CODLOG_T3: {},
    NU_TESTADA_T4: {},
    DE_CODLOG_T4: {},
    NU_TESTADA_T5: {},
    DE_CODLOG_T5: {},
    NU_TESTADA_T6: {},
    DE_CODLOG_T6: {},
    NU_BAIRRO_ID: {},
    DT_DATA_MIGRACAO: {},
    DE_COD_SQCODLOG: {},
    DE_DISTRITO: {},
    DE_REALIZAR_MIGRACAO: {},
    DE_INSCRICAO_ANTERIOR: {},
    DE_PADRAO_CONSTRUCAO: {},
    DE_ISENTO: {},
    DE_REF_CADASTRAL: {}
}
}
