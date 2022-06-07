var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
function ItbiMigracaoModel() {
    Model.apply(this, arguments);
}

Model.extend(ItbiMigracaoModel);
module.exports = ItbiMigracaoModel;

// Table name is the only required property.
ItbiMigracaoModel.tableName = 'tb_itbi_mig';

ItbiMigracaoModel.prototype.$beforeInsert = function() {
    this.dt_ultima_atualizacao = new Date().toISOString();
};

// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
ItbiMigracaoModel.jsonSchema = {
    type: 'object',
    required: [

    ],

    properties: {
        id:{},
        nu_codigo:{},
        nu_processo:{},
        nu_processo_inclusao:{},
        nu_sequencial:{},
        dt_data_avaliacao:{},
        dt_data_negociacao:{},
        nu_valor_avaliacao:{},
        nu_valor_financiado:{},
        nu_valor_operacao:{},
        de_moeda:{},
        de_situacao:{},
        dt_ultima_atualizacao_mig:{}
    }
};
