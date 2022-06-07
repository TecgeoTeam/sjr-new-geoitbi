
exports.up = function(knex, Promise) {
	return knex.schema
	.table('Resource', function (t) {
        t.biginteger('typeId').references('id').inTable('Group').onDelete('CASCADE');
  })
	.raw('UPDATE public."Resource" AS r SET "typeId"=t.id FROM public."Type" AS t WHERE t.name = r.type;')
	.table('Resource', function (t) {
        t.dropColumn('type');
  })
  
};

exports.down = function(knex, Promise) {
  
};
