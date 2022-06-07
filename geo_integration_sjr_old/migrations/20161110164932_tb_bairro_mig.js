exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_bairro_mig', function(table) {
            table.biginteger('id').primary();
            table.biginteger('nu_codigo');
            table.string('de_descricao', 30);
            table.timestamp('dt_ultima_atualizacao_mig');
            //var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });

};

exports.down = function(knex, Promise) {
    return knex.schema
        .dropTableIfExists('tb_imobiliario_mig')
        .dropTableIfExists('tb_erro_log')
        .dropTableIfExists('tb_log');


};
