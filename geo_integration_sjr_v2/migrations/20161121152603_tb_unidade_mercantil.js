
exports.up = function(knex, Promise) {
	return knex.schema
        .createTable('tb_unidade_mercantil', function(table) {
        	table.biginteger('id').primary();
        	table.biginteger('nu_sequencial');
        	table.string('de_geocodigo', 12);
        	table.biginteger('nu_inscricao');
            table.string('de_inscricao_imobiliaria', 25);
            table.string('de_distrito', 1);
            table.string('de_setor', 4);
            table.string('de_quadra', 3);
            table.string('de_lote', 4);
            table.string('de_unidade', 4);
            table.biginteger('nu_codigo');
            table.boolean('fl_incentivo_fiscal');
            table.boolean('fl_licenciado');
            table.boolean('fl_local_ignorado');
            table.boolean('fl_reducao_aliquota');
            table.boolean('fl_sociedade_profissional');
            table.date('dt_data_cadastro');
            table.integer('nu_quantidade_fornos');
            table.integer('nu_quantidade_guindastes');
            table.integer('nu_quantidade_maquinas');
            table.integer('nu_quantidade_motores');
            table.string('de_anuncios_letreiros');
            table.string('de_atividade', 9);
            table.string('de_atividade_tll');
            table.string('de_cpf_cnpj');
            table.string('de_denominacao');
            table.string('de_endereco');
            table.string('de_incentivo_base_legal');
            table.string('de_incentivo_vigencia');
            table.string('de_nome_fantasia');
            table.string('de_reducao_base_legal');
            table.string('de_regime_horario_especial');
            table.string('de_regime_iss');
            table.string('de_regime_maquinas_afins');
            table.string('de_regime_ocupacao_area_public');
            table.string('de_regime_publicidade');
            table.string('de_regime_tlf');
            table.string('de_situacao');
            table.string('de_tipo_atividade');
            table.timestamp('dt_ultima_atualizacao_mig');
            //var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });
  
};

exports.down = function(knex, Promise) {
	return knex.schema
        .dropTableIfExists('tb_imobiliario_mig')
        .dropTableIfExists('tb_erro_log')
        .dropTableIfExists('tb_log')
        .dropTableIfExists('tb_bairro_mig')
        .dropTableIfExists('tb_loteamento_mig')
        .dropTableIfExists('tb_itbi_mig');
  
};
