exports.up = function(knex, Promise) {
    return knex.schema
        .createTable('tb_bcfq_iptu', function(table) {
            table.string('de_geocodigo', 12).primary();
            table.biginteger('nu_sequencial').unique();
            table.biginteger('nu_cod_face_de_quadra');
            table.integer('nu_qtd_unidade');
            table.string('de_inscricao_imobiliaria', 25);
            table.string('de_logradouro');
            table.string('de_bairro');
            table.string('de_cep');
            table.string('de_zoneamento');
            table.integer('nu_cod_logradouro');
            table.integer('nu_cod_bairro');
            table.boolean('fl_rede_agua');
            table.boolean('fl_rede_esgoto');
            table.boolean('fl_limpeza_urbana');
            table.string('de_pavimentacao');
            table.boolean('fl_galerias_pluviais');
            table.boolean('fl_guias_sarjetas');
            table.boolean('fl_rede_eletrica');
            table.string('de_iluminacao_publica');
            table.boolean('fl_rede_telefone');
            table.boolean('fl_coleta_lixo');
            table.boolean('fl_emplacamento');
            table.boolean('fl_arborizacao');
            table.integer('nu_cod_regional');
            table.decimal('nu_v0', 20);
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
        })
        .table('tb_bcfq', function(t) {
            t.renameColumn('nu_codigo', 'nu_cod_face_de_quadra');
        })
        .table('tb_bcfq_mig', function(t) {
            t.renameColumn('nu_codigo', 'nu_cod_face_de_quadra');
        });

};

exports.down = function(knex, Promise) {

};
