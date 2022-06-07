exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_log', function(table) {
        	table.bigincrements('id').primary();
        	table.string('de_mensagem',500);
        	table.timestamp('dt_criacao');
        	//var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('tb_imobiliario_mig')
        .dropTableIfExists('tb_erro_log');

};
