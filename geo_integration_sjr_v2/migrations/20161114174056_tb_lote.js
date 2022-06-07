exports.up = function(knex, Promise) {
	   return knex.schema
        .createTable('tb_lote', function(table) {
        	table.string('de_geocodigo', 12).primary();
            table.biginteger('nu_sequencial').unique();
            table.string('de_inscricao_imobiliaria', 25);
            table.string('de_distrito', 1);
            table.string('de_setor', 4);
            table.string('de_quadra', 3);
            table.string('de_lote', 4);
            table.integer('nu_qtd_unidade');
            table.string('de_natureza', 15);
            table.integer('nu_regional');
            table.string('de_regional', 20);
            table.biginteger('nu_cod_bairro');
            table.string('de_bairro', 25);
            table.string('de_cod_loteamento', 5);
            table.string('de_loteamento', 150);
            table.string('de_limitacao_lote', 12);
            table.string('de_calcada', 4);
            table.string('de_utilizacao', 35);
            table.string('de_topografia', 20);
            table.string('de_pedologia', 20);
            table.string('de_limpeza', 50);
            table.decimal('nu_area_terreno', 20);
            table.decimal('nu_area_unidade', 20);
            table.decimal('nu_area_total_construida', 20);
            table.decimal('nu_iptu_lancado_0', 20);
            table.decimal('nu_tlp_lancado_0', 20);
            table.decimal('nu_iptu_lancado_1', 20);
            table.decimal('nu_tlp_lancado_1', 20);
            table.decimal('nu_iptu_lancado_2', 20);
            table.decimal('nu_tlp_lancado_2', 20);
            table.decimal('nu_iptu_lancado_3', 20);
            table.decimal('nu_tlp_lancado_3', 20);
            table.decimal('nu_iptu_lancado_4', 20);
            table.decimal('nu_tlp_lancado_4', 20);
            table.decimal('nu_iptu_lancado_5', 20);
            table.decimal('nu_tlp_lancado_5', 20);
            table.decimal('nu_iptu_lancado_6', 20);
            table.decimal('nu_tlp_lancado_6', 20);
            table.decimal('nu_iptu_arrecadado_0', 20);
            table.decimal('nu_tlp_arrecadado_0', 20);
            table.decimal('nu_iptu_arrecadado_1', 20);
            table.decimal('nu_tlp_arrecadado_1', 20);
            table.decimal('nu_iptu_arrecadado_2', 20);
            table.decimal('nu_tlp_arrecadado_2', 20);
            table.decimal('nu_iptu_arrecadado_3', 20);
            table.decimal('nu_tlp_arrecadado_3', 20);
            table.decimal('nu_iptu_arrecadado_4', 20);
            table.decimal('nu_tlp_arrecadado_4', 20);
            table.decimal('nu_iptu_arrecadado_5', 20);
            table.decimal('nu_tlp_arrecadado_5', 20);
            table.decimal('nu_iptu_arrecadado_6', 20);
            table.decimal('nu_tlp_arrecadado_6', 20);
            table.string('de_situacao_exercicio_atual');
            table.string('de_imposto');
            table.string('de_padrao_qualidade');
            table.string('de_cpf_cnpj',20)
            table.string('de_proprietario');
            table.biginteger('nu_cod_logradouro');
            table.string('de_logradouro', 255);
            table.string('de_numero');
            table.string('de_complemento', 255);
            table.biginteger('nu_cod_face_de_quadra');
            table.string('de_edificio', 255);
            table.string('de_cep', 20);
            table.timestamp('dt_ultima_atualizacao_mig');
        });
  
};

exports.down = function(knex, Promise) {
	return knex.schema
        .dropTableIfExists('tb_imobiliario_mig')
        .dropTableIfExists('tb_erro_log')
        .dropTableIfExists('tb_log')
        .dropTableIfExists('tb_bairro_mig')
        .dropTableIfExists('tb_loteamento_mig')
        .dropTableIfExists('tb_itbi_mig')
        .dropTableIfExists('tb_lote');
  
};
