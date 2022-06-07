
exports.up = function(knex, Promise) {
	return knex.schema.table('Resource', function (t) {
        t.string('alias');
  })
  
};

exports.down = function(knex, Promise) {
  
};
