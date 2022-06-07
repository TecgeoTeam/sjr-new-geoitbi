exports.up = function(knex) {
    return knex.schema
        .createTable('Group', function(table) {
            table.bigincrements('id').primary();
            table.string('name');
        })
        .createTable('User', function(table) {
            table.bigincrements('id').primary();
            table.string('firstName', 30);
            table.string('lastName', 30);
            table.string('userName', 100);
            table.string('password');
            table.string('token', 500);
            table.boolean('isActive');
            table.biginteger('groupId').references('id').inTable('Group').onDelete('CASCADE');
        })
        .createTable('Resource', function(table) {
            table.bigincrements('id').primary();
            table.string('name');
            table.string('type');
        })
        .createTable('Group_Resource', function(table) {
            table.bigincrements('id').primary();
            table.biginteger('resourceId').unsigned().references('id').inTable('Resource').onDelete('CASCADE');
            table.biginteger('groupId').unsigned().references('id').inTable('Group').onDelete('CASCADE');
        });
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('User')
        .dropTableIfExists('Group')
        .dropTableIfExists('Resources')
        .dropTableIfExists('Group_Resource');
};
