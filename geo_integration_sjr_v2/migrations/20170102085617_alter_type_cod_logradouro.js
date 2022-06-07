exports.up = function(knex, Promise) {
	return knex.schema
		.raw('alter table tb_bcfq_mig alter column nu_cod_logradouro type character varying(10)')
		.table('tb_bcfq_mig', function(t) {
			t.renameColumn('nu_cod_logradouro', 'de_cod_logradouro');
		})
		.raw('alter table tb_bcfq alter column nu_cod_logradouro type character varying(10)')
		.table('tb_bcfq', function(t) {
			t.renameColumn('nu_cod_logradouro', 'de_cod_logradouro');
		})
		.raw('alter table tb_bcfq_iptu alter column nu_cod_logradouro type character varying(10)')
		.table('tb_bcfq_iptu', function(t) {
			t.renameColumn('nu_cod_logradouro', 'de_cod_logradouro');
		})
		.raw('alter table tb_iptu_mig alter column nu_cod_logradouro type character varying(10)')
		.table('tb_iptu_mig', function(t) {
			t.renameColumn('nu_cod_logradouro', 'de_cod_logradouro');
		})
		.raw('alter table tb_lote alter column nu_cod_logradouro type character varying(10)')
		.table('tb_lote', function(t) {
			t.renameColumn('nu_cod_logradouro', 'de_cod_logradouro');
		});

};

exports.down = function(knex, Promise) {

};