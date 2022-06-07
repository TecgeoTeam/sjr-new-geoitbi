exports.up = function(knex) {
    return knex.schema
        .table('User', function(table) {
            table.string('resetPasswordToken');
            table.dateTime('resetPasswordExpires');
        })

};

exports.down = function(knex) {
    return knex.schema
        .dropTableIfExists('User')
        .dropTableIfExists('Group')
        .dropTableIfExists('Resources')
        .dropTableIfExists('Group_Resource');
};
