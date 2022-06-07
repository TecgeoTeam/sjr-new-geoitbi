var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var Knex = require('knex');
var Model = require('objection').Model;

var knexConfig = require('./../../../knexfile');

/** Inicializa knex. */
var knex = Knex(knexConfig.development);

var ImlMigracaoDAO = require('./../../../app/dao/tec/imlMigracao.dao');

var ImlDAO = require('./../../../app/dao/tinus/iml.dao');

var imlDAO = new ImlDAO();

/**  Vincula todos os modelos a uma instância KNEX. 
Se você tiver apenas um banco de dados em seu servidor isso é tudo que você tem que fazer. */
Model.knex(knex);

describe('ImlMigracaoDao', function() {
    this.timeout(0);

    describe('#migrateLatest()', function() {
        it('Deve atualizar a tabela de tb_iml_mig', function(done) {
        	console.log(imlDAO.count());
            ImlMigracaoDAO.migrateLatest(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
