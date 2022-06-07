var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function UnidadeMercantilModel() {
    Model.apply(this, arguments);
}

Model.extend(UnidadeMercantilModel);
module.exports = UnidadeMercantilModel;

// Table name is the only required property.
UnidadeMercantilModel.tableName = 'tb_unidade_mercantil';

UnidadeMercantilModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
UnidadeMercantilModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id: {}, //Armazenado com string por que Number não suporta números grande
        de_geocodigo: {},
        de_distrito: {},
        de_setor: {},
        de_quadra: {},
        de_lote: {},
        de_unidade: {},
        nu_codigo: {},
        nu_inscricao: {},
        nu_sequencial: {},
        fl_incentivo_fiscal: {},
        fl_licenciado: {},
        fl_local_ignorado: {},
        fl_reducao_aliquota: {},
        fl_sociedade_profissional: {},
        dt_data_cadastro: {},
        nu_quantidade_fornos: {},
        nu_quantidade_guindastes: {},
        nu_quantidade_maquinas: {},
        nu_quantidade_motores: {},
        de_anuncios_letreiros: {},
        de_atividade: {},
        de_atividade_tll: {},
        de_cpf_cnpj: {},
        de_denominacao: {},
        de_endereco: {},
        de_incentivo_base_legal: {},
        de_incentivo_vigencia: {},
        de_nome_fantasia: {},
        de_reducao_base_legal: {},
        de_regime_horario_especial: {},
        de_regime_iss: {},
        de_regime_maquinas_afins: {},
        de_regime_ocupacao_area_public: {},
        de_regime_publicidade: {},
        de_regime_tlf: {},
        de_situacao: {},
        de_tipo_atividade: {},
        dt_ultima_atualizacao_mig: {}
    }
};
