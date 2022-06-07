var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var async = require('async');


// var ItbiMigracaoDAO = require('./../../../app/dao/tec/itbiMigracao.dao');
// var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');
// var MercantilMigracaoDAO = require('./../../../app/dao/tec/iptuMigracao.dao');
// var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');
var MercantilMigracaoDAO = require('./../../../app/dao/tec/mercantilMigracao.dao');



describe('MercantilMigracaoDao', function() {
    this.timeout(0);

    describe('#migrateLatest()', function() {
        it('Deve atualizar a tabela de tb_mercantil_mig', function(done) {
            MercantilMigracaoDAO.fillFinancas(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
