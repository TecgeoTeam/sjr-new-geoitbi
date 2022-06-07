var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');


// var ItbiMigracaoDAO = require('./../../../app/dao/tec/itbiMigracao.dao');
// var BairroMigracaoDAO = require('./../../../app/dao/tec/bairroMigracao.dao');
var IptuMigracaoDAO = require('./../../../app/dao/tec/iptuMigracao.dao');
// var LoteamentoMigracaoDAO = require('./../../../app/dao/tec/loteamentoMigracao.dao');
// var MercantilMigracaoDAO = require('./../../../app/dao/tec/mercantilMigracao.dao');

var IptuDAO = require('./../../../app/dao/tinus/iptu.dao');

var iptuDAO = new IptuDAO();


describe('iptuMigracaoDao', function() {
    this.timeout(0);

    describe('#migrateLatest()', function() {
        it('Deve atualizar a tabela de tb_iptu_mig e tb_lote sem erros', function(done) {
            IptuMigracaoDAO.fillFinancas(function(err) {
                if (err) done(err);
                else done();
            });
        });


    });

});
