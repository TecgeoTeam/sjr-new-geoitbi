var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');

var Knex = require('knex');
var Model = require('objection').Model;

var knexConfig = require('./../../../knexfile');

/** Inicializa knex. */
var knex = Knex(knexConfig.development);

var ItbiMigracaoDAO = require('./../../../app/dao/tec/itbiMigracao.dao');
var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');
var IptuMigracaoDAO = require('./../../../app/dao/tec/iptuMigracao.dao');
var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');

var ItbiDAO = require('./../../../app/dao/tinus/itbi.dao');

var itbiDAO = new ItbiDAO();

/**  Vincula todos os modelos a uma instância KNEX.
Se você tiver apenas um banco de dados em seu servidor isso é tudo que você tem que fazer. */
Model.knex(knex);

describe('ItbiMigracaoDao', function() {
    this.timeout(0);

    describe('#migrateLatest()', function() {
        it('Deve atualizar a tabela de tb_itbi_mig', function(done) {
        	console.log(itbiDAO.count());
            ItbiMigracaoDAO.fillFinancas(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
