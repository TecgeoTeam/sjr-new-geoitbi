var Model = require('objection').Model;

/**
 * @extends Model
 * @constructor
 */
 function BcfqLinhaFinancasModel() {
 	Model.apply(this, arguments);
 }

 Model.extend(BcfqLinhaFinancasModel);
 module.exports = BcfqLinhaFinancasModel;

// Table name is the only required property.
BcfqLinhaFinancasModel.tableName = 'sde.TB_FACE_DE_QUADRA';


// Optional JSON schema. This is not the database schema! Nothing is generated
// based on this. This is only used for validation. Whenever a model instance
// is created it is checked against this schema. http://json-schema.org/.
BcfqLinhaFinancasModel.jsonSchema = {
	type: 'object',
	required: [],

	properties: {
		OBJECTID:{},
		de_n_id_face:{},
		de_n_setor:{},
		de_n_qdr:{},
		de_n_CODLOG:{},
		de_n_face:{},
		nu_pavimento:{},
		de_distrito:{},
		de_agua:{},
		de_estacionamento:{},
		de_sentido_logradouro:{},
		de_drenagem:{},
		de_esgoto:{},
		de_iluminacao:{},
		de_meio_fio:{},
		de_limpeza_publica:{},
		de_rede_eletrica:{},
		de_rede_telefonica:{},
		de_conservacao_da_via:{},
		de_calcada:{},
		de_hidrante:{},
		de_pavimentacao:{},
		de_tipo_via:{},
		de_arborizacao:{},
		de_coleta_de_lixo:{},
		de_ponto_de_servico:{},
		de_transporte:{},
		de_face_v01:{},
		DE_COD_BAIRRO:{},
		de_bairro:{},
		de_cep:{},
		de_emplacamento:{},
		de_v0:{}
	}
};
