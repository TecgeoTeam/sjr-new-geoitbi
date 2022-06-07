
exports.up = function(knex, Promise) {
      return knex.schema
        .createTable('Type', function(table) {
            table.bigincrements('id').primary();
            table.string('name');
            table.string('alias');
        });
};

exports.down = function(knex, Promise) {
  
};
