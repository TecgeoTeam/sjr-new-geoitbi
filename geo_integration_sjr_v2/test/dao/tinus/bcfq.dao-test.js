var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var BcfqDAO = require('./../../../app/dao/tinus/bcfq.dao');

var bcfqDAO = new BcfqDAO();


describe('bcfqDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        bcfqDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(bcfqDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var bcfq = bcfqDAO.list[0];

            it('Deve ter \'FaceQuadra\' - \'NU_FACE_QUADRA\'', function() {
                expect(bcfq).to.have.property('NU_FACE_QUADRA');
            });
            it('Deve ter \'Logradouro-Nome\' - \'DE_LOGRADOURO_NOME\'', function() {
                expect(bcfq).to.have.property('DE_LOGRADOURO_NOME');
            });
            it('Deve ter \'Bairro-Nome\' - \'DE_NOME_BAIRRO\'', function() {
                expect(bcfq).to.have.property('DE_NOME_BAIRRO');
            });
            it('Deve ter \'CEP\' - \'DE_CEP\'', function() {
                expect(bcfq).to.have.property('DE_CEP');
            });
            it('Deve ter \'Zoneamento\' - \'DE_ZONEAMENTO\'', function() {
                expect(bcfq).to.have.property('DE_ZONEAMENTO');
            });
            it('Deve ter \'Logradouro-Codigo\' - \'NU_CODIGO_LOGRADOURO\'', function() {
                expect(bcfq).to.have.property('NU_CODIGO_LOGRADOURO');
            });
            it('Deve ter \'Bairro-Codigo\' - \'NU_CODIGO_BAIRRO\'', function() {
                expect(bcfq).to.have.property('NU_CODIGO_BAIRRO');
            });
            it('Deve ter \'RedeAgua\' - \'FL_REDE_AGUA\'', function() {
                expect(bcfq).to.have.property('FL_REDE_AGUA');
            });
            it('Deve ter \'RedeEsgoto\' - \'FL_REDE_ESGOTO\'', function() {
                expect(bcfq).to.have.property('FL_REDE_ESGOTO');
            });
            it('Deve ter \'LimpezaUrbana\' - \'FL_LIMPEZA_URBANA\'', function() {
                expect(bcfq).to.have.property('FL_LIMPEZA_URBANA');
            });
            it('Deve ter \'Pavimentacao\' - \'FL_PAVIMENTACAO\'', function() {
                expect(bcfq).to.have.property('FL_PAVIMENTACAO');
            });
            it('Deve ter \'GaleriasPluviais\' - \'FL_GALERIAS_PLUVIAIS\'', function() {
                expect(bcfq).to.have.property('FL_GALERIAS_PLUVIAIS');
            });
            it('Deve ter \'GuiasSarjetas\' - \'FL_GUIAS_SARJETAS\'', function() {
                expect(bcfq).to.have.property('FL_GUIAS_SARJETAS');
            });
            it('Deve ter \'RedeEletrica\' - \'FL_REDE_ELETRICA\'', function() {
                expect(bcfq).to.have.property('FL_REDE_ELETRICA');
            });
            it('Deve ter \'IluminacaoPublica\' - \'DE_ILUMINACAO_PUBLICA\'', function() {
                expect(bcfq).to.have.property('DE_ILUMINACAO_PUBLICA');
            });
            it('Deve ter \'RedeTelefone\' - \'FL_REDE_TELEFONE\'', function() {
                expect(bcfq).to.have.property('FL_REDE_TELEFONE');
            });
            it('Deve ter \'ColetaLixo\' - \'FL_COLETA_LIXO\'', function() {
                expect(bcfq).to.have.property('FL_COLETA_LIXO');
            });
            it('Deve ter \'Emplacamento\' - \'FL_EMPLACAMENTO\'', function() {
                expect(bcfq).to.have.property('FL_EMPLACAMENTO');
            });
            it('Deve ter \'Arborizacao\' - \'FL_ARBORIZACAO\'', function() {
                expect(bcfq).to.have.property('FL_ARBORIZACAO');
            });
            it('Deve ter \'Regional\' - \'NU_REGIONAL\'', function() {
                expect(bcfq).to.have.property('NU_REGIONAL');
            });
            it('Deve ter \'Vo\' - \'NU_VO\'', function() {
                expect(bcfq).to.have.property('NU_VO');
            });

        });




    });

});
