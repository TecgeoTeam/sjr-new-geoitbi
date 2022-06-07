
exports.up = function(knex, Promise) {
	return knex.schema.raw('alter table tb_bcfq_mig alter column nu_codigo type bigint');
  
};

exports.down = function(knex, Promise) {
  
};
