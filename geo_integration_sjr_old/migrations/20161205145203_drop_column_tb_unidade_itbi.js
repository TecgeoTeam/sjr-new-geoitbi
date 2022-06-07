exports.up = function(knex, Promise) {
    return knex.schema.table('tb_unidade_itbi', function(t) {
        // t.dropColumn('nu_inscricao');
        t.dropColumn('id');
    }).table('tb_itbi', function(t) {
        t.dropColumn('id');
        t.dropColumn('de_unidade');
        t.dropColumn('nu_inscricao');
        t.renameColumn('nu_processo_inclusão', 'de_processo_inclusao');
    }).raw('alter table tb_itbi alter column de_processo_inclusao type character varying(255)');

};


exports.down = function(knex, Promise) {

};
