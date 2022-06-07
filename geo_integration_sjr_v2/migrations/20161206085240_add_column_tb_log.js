
exports.up = function(knex, Promise) {
  return knex.schema.table('tb_log', function (t) {
        t.string('de_nome_tabela');
        t.string('de_tipo');
        t.integer('nu_registro');
  });
};

exports.down = function(knex, Promise) {
  
};
