
exports.up = function(knex, Promise) {
	return knex.schema.table('tb_bcfq_mig', function (t) {
        t.dropColumn('fl_pavimentacao');
        t.string('de_pavimentacao');
  });
  
};

exports.down = function(knex, Promise) {
  
};
