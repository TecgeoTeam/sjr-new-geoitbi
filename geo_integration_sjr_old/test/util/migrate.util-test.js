var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');


// var ItbiMigracaoDAO = require('./../../../app/dao/tec/itbiMigracao.dao');
// var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');
var migrateUtil = require('./../../app/util/migrate.util');
// var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');
// var MercantilMigracaoDAO = require('./../../../app/dao/tec/mercantilMigracao.dao');

// var IptuDAO = require('./../../../app/dao/tinus/iptu.dao');

// var iptuDAO = new IptuDAO();


describe('migrateUtil', function() {
    this.timeout(0);

    describe('#migrateAllData()', function() {
        it('Deve migrar todos os dados', function(done) {
            migrateUtil.migrateAllData(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
