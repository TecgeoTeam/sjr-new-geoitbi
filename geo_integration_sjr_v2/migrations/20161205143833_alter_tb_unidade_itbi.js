
exports.up = function(knex, Promise) {
	return knex.schema.table('tb_unidade_itbi', function (t) {
        t.renameColumn('nu_processo_inclusão','de_processo_inclusao');
  });
  
};

exports.down = function(knex, Promise) {
  
};
