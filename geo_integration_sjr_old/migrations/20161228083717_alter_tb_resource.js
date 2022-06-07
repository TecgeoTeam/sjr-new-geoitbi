
exports.up = function(knex, Promise) {
	return knex.schema.table('Resource', function (t) {
        t.json('extra');
  })
  
};

exports.down = function(knex, Promise) {
  
};
