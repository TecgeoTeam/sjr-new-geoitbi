var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var ImlDAO = require('./../../../app/dao/tinus/iml.dao');

var imlDAO = new ImlDAO();


describe('imlDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        imlDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(imlDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var iml = imlDAO.list[0];

            it('Deve ter \'Codigo\' - \'NU_CODIGO\'', function() {
                expect(iml).to.have.property('NU_CODIGO');
            });
            it('Deve ter \'CodAnt\' - \'NU_CODIGO_ANTERIOR\'', function() {
                expect(iml).to.have.property('NU_CODIGO_ANTERIOR');
            });
            it('Deve ter \'Logradouro(Nome,Prep,Tit,Tipo)\' - \'DE_LOGRADOURO\'', function() {
                expect(iml).to.have.property('DE_LOGRADOURO');
            });
            it('Deve ter \'Nome\' - \'DE_NOME\'', function() {
                expect(iml).to.have.property('DE_NOME');
            });
            it('Deve ter \'Prep\' - \'DE_PREP\'', function() {
                expect(iml).to.have.property('DE_PREP');
            });
            it('Deve ter \'Tit\' - \'DE_TITULO\'', function() {
                expect(iml).to.have.property('DE_TITULO');
            });
            it('Deve ter \'Tipo\' - \'DE_TIPO\'', function() {
                expect(iml).to.have.property('DE_TIPO');
            });
            it('Deve ter \'NomeCompleto\' - \'DE_NOME_COMPLETO\'', function() {
                expect(iml).to.have.property('DE_NOME_COMPLETO');
            });
            it('Deve ter \'Bairro(s)\' - \'DE_BAIRROS\'', function() {
                expect(iml).to.have.property('DE_BAIRROS');
            });
            it('Deve ter \'PermiteAPGI\' - \'FL_PERMITE_APGI\'', function() {
                expect(iml).to.have.property('FL_PERMITE_APGI');
            });
            it('Deve ter \'Origem\' - \'DE_ORIGEM\'', function() {
                expect(iml).to.have.property('DE_ORIGEM');
            });
            it('Deve ter \'LimiteLogradInicial\' - \'DE_LIMITE_LOGRADOURO_INICIAL\'', function() {
                expect(iml).to.have.property('DE_LIMITE_LOGRADOURO_INICIAL');
            });
            it('Deve ter \'LimiteLogradFinal\' - \'DE_LIMITE_LOGRADOURO_FINAL\'', function() {
                expect(iml).to.have.property('DE_LIMITE_LOGRADOURO_FINAL');
            });
            it('Deve ter \'LimiteFaceInicial\' - \'NU_LIMITE_FACE_INICIAL\'', function() {
                expect(iml).to.have.property('NU_LIMITE_FACE_INICIAL');
            });
            it('Deve ter \'LimiteFaceFinal\' - \'NU_LIMITE_FACE_FINAL\'', function() {
                expect(iml).to.have.property('NU_LIMITE_FACE_FINAL');
            });

            expect(imlDAO.list).to.have.lengthOf(value);

        });




    });

});
