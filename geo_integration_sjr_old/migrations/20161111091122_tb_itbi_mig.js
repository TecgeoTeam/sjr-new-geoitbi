exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_itbi_mig', function(table) {
            table.biginteger('id').primary();
            table.biginteger('nu_codigo');
            table.biginteger('nu_processo');
            table.biginteger('nu_sequencial');
            table.date('dt_data_avaliacao');
            table.date('dt_data_negociacao');
            table.decimal('nu_valor_avaliacao',20);
            table.decimal('nu_valor_financiado',20);
            table.decimal('nu_valor_operacao',20);
            table.string('de_moeda', 10);
            table.string('de_processo_inclusao');
            table.string('de_situacao', 5);
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
        .dropTableIfExists('tb_loteamento_mig');

};
