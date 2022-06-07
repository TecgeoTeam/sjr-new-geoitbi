var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var Knex = require('knex');
var Model = require('objection').Model;

var knexConfig = require('./../../../knexfile');

/** Inicializa knex. */
var knex = Knex(knexConfig.development);

var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');

var LoteamentoDAO = require('./../../../app/dao/tinus/loteamento.dao');

var loteamentoDAO = new LoteamentoDAO();

/**  Vincula todos os modelos a uma instância KNEX. 
Se você tiver apenas um banco de dados em seu servidor isso é tudo que você tem que fazer. */
Model.knex(knex);

describe('loteamentoMigracaoDao', function() {
    describe('.migrate', function() {
        LoteamentoMigracaoDAO.migrate();
    });

});
