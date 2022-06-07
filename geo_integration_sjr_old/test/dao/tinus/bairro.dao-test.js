var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var BairroDAO = require('./../../../app/dao/tinus/bairro.dao');

var bairroDAO = new BairroDAO();


describe('bairroDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        bairroDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(bairroDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var bairro = bairroDAO.list[0];

            it('Deve ter \'Codigo\' - \'NU_CODIGO\'', function() {
                expect(bairro).to.have.property('NU_CODIGO');
            });
            it('Deve ter \'Descricao\' - \'DE_DESCRICAO\'', function() {
                expect(bairro).to.have.property('DE_DESCRICAO');
            });
            
        });




    });

});
