
exports.up = function(knex, Promise) {
  return knex.schema
        .createTable('tb_config', function(table) {
            table.bigincrements('id').primary();
            table.json('de_config');
            table.timestamp('dt_ultima_atualizacao');
        })
};

exports.down = function(knex, Promise) {
  
};
