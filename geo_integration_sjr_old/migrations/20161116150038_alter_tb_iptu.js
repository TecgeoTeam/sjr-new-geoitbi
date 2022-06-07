exports.up = function(knex, Promise) {
    return knex.schema
        .alterTable('tb_iptu_mig', function(table) {
            table.renameColumn('nu_cpf_cnpj', 'de_cpf_cnpj');
            table.renameColumn('nu_regional', 'nu_cod_regional');
            table.renameColumn('de_geocodigo_lote', 'de_geocodigo');


        })
        .alterTable('tb_lote', function(table) {
            table.renameColumn('nu_regional', 'nu_cod_regional');
            table.dropColumn('nu_area_unidade');
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
