exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_erro_log', function(table) {
        	table.bigincrements('id').primary();
            table.string('de_nome_tabela');
            table.string('de_nome_coluna_chave');
        	table.biginteger('nu_valor_coluna_chave');
        	table.string('de_nome_coluna_erro');
        	table.string('de_valor_coluna_erro', 1000);
        	table.string('de_tipo');
        	table.string('de_mensagem',500);
        	table.string('de_criticidade');
        	table.timestamp('dt_criacao');
        	//var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('tb_imobiliario_mig');

};
