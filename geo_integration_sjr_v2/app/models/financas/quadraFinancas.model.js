var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
 function QuadraFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(QuadraFinancasModel);
module.exports = QuadraFinancasModel;

// Table name is the only required property.
QuadraFinancasModel.tableName = 'sde.quadras_regulares';

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
QuadraFinancasModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
       objectid:{},
       gid:{},
       id:{},
       distrito:{},
       setor:{},
       quadra:{},
       loteamento:{},
       quad_strin:{},
       observacao:{},
       dsqf:{},
       de_geocodigo:{},
       de_distrito:{},
       de_setor:{},
       de_quadra:{},
       nu_qtd_lote:{},
       nu_qtd_unidade:{},
       nu_cod_regional:{},
       de_regional:{},
       nu_cod_bairro:{},
       de_bairro:{},
       de_cod_loteamento:{},
       de_loteamento:{},
       nu_area_terreno:{},
       nu_area_total_construida:{},
       iptu_lancado_0:{},
       tlp_lancado_0:{},
       iptu_lancado_1:{},
       tlp_lancado_1:{},
       iptu_lancado_2:{},
       tlp_lancado_2:{},
       iptu_lancado_3:{},
       tlp_lancado_3:{},
       iptu_lancado_4:{},
       tlp_lancado_4:{},
       iptu_arrecadado_0:{},
       tlp__arrecadado_0:{},
       iptu_arrecadado_1:{},
       tlp_arrecadado_1:{},
       iptu_arrecadado_2:{},
       tlp_arrecadado_2:{},
       iptu_arrecadado_3:{},
       tlp_arrecadado_3:{},
       iptu_arrecadado_4:{},
       tlp_arrecadado_4:{},
       de_cod_face_de_quadra:{},
       dt_ultima_atualizacao_mig:{},
       esri_oid:{},
       shape:{}
   }
}
