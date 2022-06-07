exports.up = function(knex) {
    return knex.schema
        .alterTable('User', function(t) {
            t.unique('email');
            t.unique('userName');
        })
        .alterTable('Group', function(t) {
            t.unique('name');
        })
};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('User')
        .dropTableIfExists('Group')
        .dropTableIfExists('Resources')
        .dropTableIfExists('Group_Resource');
};
