var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var async = require('async');


// var ItbiMigracaoDAO = require('./../../../app/dao/tec/itbiMigracao.dao');
// var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');
// var BcfqMigracaoDAO = require('./../../../app/dao/tec/iptuMigracao.dao');
// var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');
var BcfqMigracaoDAO = require('./../../../app/dao/tec/bcfqMigracao.dao');



describe('BcfqMigracaoDao', function() {
    this.timeout(0);

    describe('#migrateLatest()', function() {
        it('Deve atualizar a tabela de tb_bcfq_mig', function(done) {
            BcfqMigracaoDAO.fillFinancas(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
