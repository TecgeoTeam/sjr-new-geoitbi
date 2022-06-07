exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_bcfq_mig', function(table) {
            table.biginteger('id').primary();
            table.boolean('fl_arborizacao');
            table.integer('nu_cod_bairro');
            table.string('de_bairro');
            table.string('de_cep');
            table.integer('nu_codigo');
            table.boolean('fl_coleta_lixo');
            table.boolean('fl_emplacamento');
            table.string('de_face_quadra');
            table.boolean('fl_galerias_pluvias');
            table.boolean('fl_guias_sarjetas');
            table.string('de_iluminacao_publica');
            table.boolean('fl_limpeza_urbana');
            table.integer('nu_cod_logradouro');
            table.string('de_logradouro');
            table.boolean('fl_pavimentacao');
            table.boolean('fl_rede_agua');
            table.boolean('fl_rede_eletrica');
            table.boolean('fl_rede_esgoto');
            table.boolean('fl_rede_telefone');
            table.integer('nu_cod_regional');
            table.decimal('nu_v0', 20);
            table.string('de_zoneamento');
            table.timestamp('dt_ultima_atualizacao_mig');
            //var error = {iptuId: data.id, column: key, value: o.toString(), type:'Data Inválida'}

        });

};

exports.down = function(knex, Promise) {

};
