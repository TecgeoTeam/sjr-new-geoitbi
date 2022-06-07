
exports.up = function(knex, Promise) {
  return knex.schema
      .table('tb_lote', function(table) {
          table.integer('nu_qtd_transacao_itbi');
          table.boolean('fl_relacao_iptu_mercantil');
      });
};

exports.down = function(knex, Promise) {

};
