
exports.up = function(knex, Promise) {
	return knex.schema.raw('alter table tb_unidade_itbi alter column de_processo_inclusao type character varying(255)');
  
};

exports.down = function(knex, Promise) {
  
};
