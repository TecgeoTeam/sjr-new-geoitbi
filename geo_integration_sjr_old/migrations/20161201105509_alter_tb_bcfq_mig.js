
exports.up = function(knex, Promise) {
	return knex.schema.table('tb_bcfq_mig', function (t) {
        t.renameColumn('fl_galerias_pluvias','fl_galerias_pluviais');
  });
  
};

exports.down = function(knex, Promise) {
  
};
