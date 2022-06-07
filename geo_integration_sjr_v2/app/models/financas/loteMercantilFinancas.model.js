var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function LoteMercantilFinancasModel() {
    Model.apply(this, arguments);
}

Model.extend(LoteMercantilFinancasModel);
module.exports = LoteMercantilFinancasModel;

// Table name is the only required property.
LoteMercantilFinancasModel.tableName = 'sde.pl_compesa_lote_mercantil';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
LoteMercantilFinancasModel.jsonSchema = {
    type: 'object',
    required: [],

    properties: {
        objectid_1: {},
        de_observ: {},
        de_localizado: {},
        objectid: {},
        nu_sequencial: {},
        de_geocodigo: {},
        nu_inscricao_imobiliaria: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        de_unidade: {},
        nu_inscricao_mercantil: {},
        de_denominacao: {},
        de_nome_fantasia: {},
        fl_local_ignorado: {},
        de_situacao: {},
        de_cpf_cnpj: {},
        de_endereco: {},
        de_atividade_tll: {},
        fl_licenciado: {},
        de_anuncios_letreiros: {},
        dt_data_cadastro: {},
        fl_sociedade_profissional: {},
        de_tipo_atividade: {},
        fl_incentivo_fiscal: {},
        de_incentivo_base_legal: {},
        de_incentivo_vigencia: {},
        "fl_reducao_alíquota": {},
        de_reducao_base_legal: {},
        shape: {},
        de_regime_iss: {}
    }
};