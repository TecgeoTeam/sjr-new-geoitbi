exports.up = function(knex) {
    return knex.schema
        .table('User', function(table) {
            table.string('email', 30).notNullable();
        })

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('User')
        .dropTableIfExists('Group')
        .dropTableIfExists('Resources')
        .dropTableIfExists('Group_Resource');
};
