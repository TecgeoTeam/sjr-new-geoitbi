exports.up = function(knex, Promise) {
	   return knex.schema
        .createTable('tb_regional', function(table) {
        	table.integer('de_geocodigo').primary();
            table.integer('nu_cod_regional');
            table.string('de_regional', 20);
            table.integer('nu_qtd_quadra');
            table.integer('nu_qtd_lote');
            table.integer('nu_qtd_unidade');
            table.decimal('nu_area_terreno', 20);
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
        .dropTableIfExists('tb_lote')
        .dropTableIfExists('tb_quadra')
        .dropTableIfExists('tb_setor');
  
};
