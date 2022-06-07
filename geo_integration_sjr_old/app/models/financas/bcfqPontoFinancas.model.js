var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
 function BcfqPontoFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(BcfqPontoFinancasModel);
module.exports = BcfqPontoFinancasModel;

// Table name is the only required property.
BcfqPontoFinancasModel.tableName = 'sde.face_das_quadras_regulares';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
BcfqPontoFinancasModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
       objectid:{},
       gid:{},
       id:{},
       distrito:{},
       setor:{},
       quadra:{},
       face:{},
       dsqf_fmt:{},
       nu_sequencial:{},
       nu_inscricao_imobiliaria:{},
       nu_cod_face_de_quadra:{},
       de_logradouro_nome:{},
       de_nome_bairro:{},
       de_cep:{},
       de_zoneamento:{},
       nu_codigo_bairro:{},
       fl_rede_agua:{},
       fl_rede_esgoto:{},
       fl_limpeza_urbana:{},
       fl_pavimentacao:{},
       fl_galerias_pluviais:{},
       fl_guias_sarjetas:{},
       fl_rede_eletrica:{},
       de_iluminacao_publica:{},
       fl_rede_telefone:{},
       fl_coleta_lixo:{},
       fl_emplacamento:{},
       fl_arborizacao:{},
       nu_regional:{},
       nu_vo:{},
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
       de_codigo_logradouro:{},
       dt_ultima_atualizacao_mig:{},
       shape:{}
   }
};
