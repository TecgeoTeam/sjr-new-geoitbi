
exports.up = function(knex, Promise) {
  return knex.schema
      .table('tb_lote', function(table) {
          table.integer('nu_qtd_utili_religiosa');
          table.integer('nu_qtd_utili_servico_publico');
          table.integer('nu_qtd_utili_comercio');
          table.integer('nu_qtd_utili_residencial');
      });
};

exports.down = function(knex, Promise) {

};
