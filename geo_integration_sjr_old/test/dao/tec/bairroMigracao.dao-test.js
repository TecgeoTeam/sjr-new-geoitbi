var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var Knex = require('knex');
var Model = require('objection').Model;

var knexConfig = require('./../../../knexfile');

/** Inicializa knex. */
var knex = Knex(knexConfig.development);

var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');

var BairroDAO = require('./../../../app/dao/tinus/bairro.dao');

var bairroDAO = new BairroDAO();

/**  Vincula todos os modelos a uma instância KNEX. 
Se você tiver apenas um banco de dados em seu servidor isso é tudo que você tem que fazer. */
Model.knex(knex);

describe('bairroMigracaoDao', function() {
    describe('.migrate', function() {
        BairroMigracaoDAO.migrate();
    });

});
