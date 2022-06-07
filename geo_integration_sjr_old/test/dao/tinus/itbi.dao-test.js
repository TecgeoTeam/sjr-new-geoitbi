var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var ItbiDAO = require('./../../../app/dao/tinus/itbi.dao');

var itbiDAO = new ItbiDAO();


describe('itbiDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        itbiDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(itbiDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var itbi = itbiDAO.list[0];
            it('Deve ter \'Sequencial\' - \'NU_SEQUENCIAL\'', function() {
                expect(itbi).to.have.property('NU_SEQUENCIAL');
            });
            it('Deve ter \'ProcITBI\' - \'NU_PROCESSO\'', function() {
                expect(itbi).to.have.property('NU_PROCESSO');
            });
            it('Deve ter \'Moeda\' - \'DE_MOEDA\'', function() {
                expect(itbi).to.have.property('DE_MOEDA');
            });
            it('Deve ter \'ValOperacao\' - \'NU_VALOR_OPERACAO\'', function() {
                expect(itbi).to.have.property('NU_VALOR_OPERACAO');
            });
            it('Deve ter \'ValorFinanciado\' - \'NU_VALOR_FINANCIADO\'', function() {
                expect(itbi).to.have.property('NU_VALOR_FINANCIADO');
            });
            it('Deve ter \'ValAvaliacao\' - \'NU_VALOR_AVALIACAO\'', function() {
                expect(itbi).to.have.property('NU_VALOR_AVALIACAO');
            });
            it('Deve ter \'ProcInclusao\' - \'NU_PROCESSO_INCLUSAO\'', function() {
                expect(itbi).to.have.property('NU_PROCESSO_INCLUSAO');
            });
            it('Deve ter \'DataAvaliacao\' - \'DT_DATA_AVALIACAO\'', function() {
                expect(itbi).to.have.property('DT_DATA_AVALIACAO');
            });
            it('Deve ter \'DataNegociacao\' - \'DT_DATA_NEGOCIACAO\'', function() {
                expect(itbi).to.have.property('DT_DATA_NEGOCIACAO');
            });
            it('Deve ter \'Situacao\' - \'DE_SITUACAO\'', function() {
                expect(itbi).to.have.property('DE_SITUACAO');
            });












            expect(itbiDAO.list).to.have.lengthOf(value);

        });




    });

});
