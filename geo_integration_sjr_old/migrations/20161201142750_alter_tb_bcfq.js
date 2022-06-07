
exports.up = function(knex, Promise) {
	return knex.schema.table('tb_bcfq', function (t) {
        t.renameColumn('fl_galerias_pluvias','fl_galerias_pluviais');
        t.dropColumn('fl_pavimentacao');
        t.string('de_pavimentacao');
  })
	.raw('alter table tb_bcfq alter column nu_codigo type bigint')
	.raw('alter table tb_bcfq alter column nu_cod_face_de_quadra type bigint');
  
};

exports.down = function(knex, Promise) {
  
};
