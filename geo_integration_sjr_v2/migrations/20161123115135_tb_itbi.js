
exports.up = function(knex, Promise) {
	return knex.schema
	        .createTable('tb_itbi', function(table) {
        	table.biginteger('id');
        	table.biginteger('nu_codigo');
        	table.string('de_geocodigo', 12).primary();
        	table.biginteger('nu_inscricao');
            table.string('de_inscricao_imobiliaria', 25);
            table.string('de_distrito', 1);
            table.string('de_setor', 4);
            table.string('de_quadra', 3);
            table.string('de_lote', 4);
            table.string('de_unidade', 4);
            table.integer('nu_qtd_unidade');
        	table.date('dt_data_avaliacao');
        	table.date('dt_data_negociacao');
        	table.string('de_moeda', 10);
        	table.biginteger('nu_processo');
        	table.biginteger('nu_processo_inclusão');
        	table.biginteger('nu_sequencial');
        	table.string('de_situacao', 10);
        	table.decimal('nu_valor_avaliacao', 20);
        	table.decimal('nu_valor_operacao', 20);
        	table.decimal('nu_valor_financiado', 20);
            table.timestamp('dt_ultima_atualizacao_mig');
            //var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });
  
};

exports.down = function(knex, Promise) {
  
};
