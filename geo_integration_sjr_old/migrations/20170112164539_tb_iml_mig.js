exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_iml_mig', function(table) {
            table.biginteger('id').primary();
            table.string('de_bairros', 350);
            table.string('de_codigo', 10);
            table.string('de_codigo_anterior', 10);
            table.biginteger('nu_limite_face_inicial');
            table.biginteger('nu_limite_face_final');
            table.string('de_limite_logradouro_inicial',70);
            table.string('de_limite_logradouro_final',70);
            table.string('de_tipo',10);
            table.string('de_nome',70);
            table.string('de_nome_completo',70);
            table.string('de_origem',25);
            table.boolean('fl_permite_apgi');
            table.string('de_prep',10);
            table.string('de_titulo',10);
            table.timestamp('dt_ultima_atualizacao_mig');


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
