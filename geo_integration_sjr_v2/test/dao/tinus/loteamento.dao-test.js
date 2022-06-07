var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var LoteamentoDAO = require('./../../../app/dao/tinus/loteamento.dao');

var loteamentoDAO = new LoteamentoDAO();


describe('loteamentoDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        loteamentoDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(loteamentoDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var loteamento = loteamentoDAO.list[0];

            it('Deve ter \'Codigo\' - \'NU_CODIGO\'', function() {
                expect(loteamento).to.have.property('NU_CODIGO');
            });
            it('Deve ter \'Descricao\' - \'DE_DESCRICAO\'', function() {
                expect(loteamento).to.have.property('DE_DESCRICAO');
            });
            
        });




    });

});
