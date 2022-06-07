var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var IptuDAO = require('./../../../app/dao/tinus/iptu.dao');

var iptuDAO = new IptuDAO();


describe('iptuDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        iptuDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(iptuDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {

            var iptu = iptuDAO.list[0];

            it('Deve ter \'\' - \'NU_SEQUENCIAL\'', function() {
                expect(iptu).to.have.property('NU_SEQUENCIAL');
            });
            it('Deve ter \'\' - \'NU_INSCRICAO_IMOBILIARIA\'', function() {
                expect(iptu).to.have.property('CODIGO');
                expect(iptu).to.have.property('DE_INSCRICAO_IMOBILIARIA');
            });
            it('Deve ter \'\' - \'NU_COD_FACE_DE_QUADRA\'', function() {
                expect(iptu).to.have.property('NU_COD_FACE_DE_QUADRA');
            });
            it('Deve ter \'\' - \'DE_PROPRIETÁRIO\'', function() {
                expect(iptu).to.have.property('DE_PROPRIETARIO');
            });
            it('Deve ter \'\' - \'NU_CPF_CNPJ\'', function() {
                expect(iptu).to.have.property('NU_CPF_CNPJ');
            });
            it('Deve ter \'\' - \'DE_NATUREZA\'', function() {
                expect(iptu).to.have.property('DE_NATUREZA');
            });
            it('Deve ter \'\' - \'NU_COD_LOGRADOURO\'', function() {
                expect(iptu).to.have.property('NU_COD_LOGRADOURO');
            });
            it('Deve ter \'\' - \'DE_LOGRADOURO\'', function() {
                expect(iptu).to.have.property('DE_LOGRADOURO');
            });
            it('Deve ter \'\' - \'NU_NUMERO\'', function() {
                expect(iptu).to.have.property('NU_NUMERO');
            });
            it('Deve ter \'\' - \'DE_COMPLEM\'', function() {
                expect(iptu).to.have.property('DE_COMPLEM');
            });
            it('Deve ter \'\' - \'NU_COD_BAIRRO\'', function() {
                expect(iptu).to.have.property('NU_COD_BAIRRO');
            });
            it('Deve ter \'\' - \'DE_BAIRRO\'', function() {
                expect(iptu).to.have.property('DE_BAIRRO');
            });
            it('Deve ter \'\' - \'DE_CEP\'', function() {
                expect(iptu).to.have.property('DE_CEP');
            });
            it('Deve ter \'\' - \'NU_COD_LOTEAMENTO\'', function() {
                expect(iptu).to.have.property('NU_COD_LOTEAMENTO');
            });
            it('Deve ter \'\' - \'DE_LOTEAMENTO\'', function() {
                expect(iptu).to.have.property('DE_LOTEAMENTO');
            });
            it('Deve ter \'\' - \'DE_LIMITACAO_LOTE\'', function() {
                expect(iptu).to.have.property('DE_LIMITACAO_LOTE');
            });
            it('Deve ter \'\' - \'DE_CALCADA\'', function() {
                expect(iptu).to.have.property('DE_CALCADA');
            });
            it('Deve ter \'\' - \'DE_UTILIZACAO\'', function() {
                expect(iptu).to.have.property('DE_UTILIZACAO');
            });
            it('Deve ter \'\' - \'NU_AREA_TERRENO\'', function() {
                expect(iptu).to.have.property('NU_AREA_TERRENO');
            });
            it('Deve ter \'\' - \'NU_AREA_UNIDADE\'', function() {
                expect(iptu).to.have.property('NU_AREA_UNIDADE');
            });
            it('Deve ter \'\' - \'NU_AREA_TOTAL_CONSTRUIDA\'', function() {
                expect(iptu).to.have.property('NU_AREA_TOTAL_CONSTRUIDA');
            });
            it('Deve ter \'\' - \'NU_VALOR_VENAL\'', function() {
                expect(iptu).to.have.property('NU_VALOR_VENAL');
            });
            it('Deve ter \'\' - \'NU_REGIONAL\'', function() {
                expect(iptu).to.have.property('NU_REGIONAL');
            });
            it('Deve ter \'\' - \'DE_REGIONAL\'', function() {
                expect(iptu).to.have.property('DE_REGIONAL');
            });
            it('Deve ter \'\' - \'DE_TOPOGRAFIA\'', function() {
                expect(iptu).to.have.property('DE_TOPOGRAFIA');
            });
            it('Deve ter \'\' - \'DE_PEDOLOGIA\'', function() {
                expect(iptu).to.have.property('DE_PEDOLOGIA');
            });
            it('Deve ter \'\' - \'DE_PADRAO_QUALIDADE\'', function() {
                expect(iptu).to.have.property('DE_PADRAO_QUALIDADE');
            });
            it('Deve ter \'\' - \'DE_ESTADO_CONSERVACAO\'', function() {
                expect(iptu).to.have.property('DE_ESTADO_CONSERVACAO');
            });
            it('Deve ter \'\' - \'DE_ESTRUTURA\'', function() {
                expect(iptu).to.have.property('DE_ESTRUTURA');
            });
            it('Deve ter \'\' - \'DE_REVESTIMENTO\'', function() {
                expect(iptu).to.have.property('DE_REVESTIMENTO');
            });
            it('Deve ter \'\' - \'DT_DATACADASTRO\'', function() {
                expect(iptu).to.have.property('DT_DATACADASTRO');
            });
            it('Deve ter \'\' - \'DT_DATAHABITE_SE\'', function() {
                expect(iptu).to.have.property('DT_DATAHABITE_SE');
            });
            it('Deve ter \'\' - \'DE_IMPOSTO\'', function() {
                expect(iptu).to.have.property('DE_IMPOSTO');
            });
            it('Deve ter \'\' - \'DE_LIMPEZA\'', function() {
                expect(iptu).to.have.property('DE_LIMPEZA');
            });
            it('Deve ter \'\' - \'DE_TIPO_IMOVEL\'', function() {
                expect(iptu).to.have.property('DE_TIPO_IMOVEL');
            });
            it('Deve ter \'\' - \'NU_TESTADA_FICTICIA\'', function() {
                expect(iptu).to.have.property('NU_TESTADA_FICTICIA');
            });
            it('Deve ter \'\' - \'DE_CODIGO_VU\'', function() {
                expect(iptu).to.have.property('DE_CODIGO_VU');
            });
            it('Deve ter \'\' - \'NU_ALIQUOTA\'', function() {
                expect(iptu).to.have.property('NU_ALIQUOTA');
            });
            it('Deve ter \'\' - \'DE_EDIFICIO\'', function() {
                expect(iptu).to.have.property('DE_EDIFICIO');
            });
            it('Deve ter \'\' - \'FL_CARNE_DEVOLVIDO\'', function() {
                expect(iptu).to.have.property('FL_CARNE_DEVOLVIDO');
            });
            it('Deve ter \'\' - \'NU_FRACAO_IDEAL\'', function() {
                expect(iptu).to.have.property('NU_FRACAO_IDEAL');
            });
            it('Deve ter \'\' - \'DE_PAVIMENTACAO\'', function() {
                expect(iptu).to.have.property('DE_PAVIMENTACAO');
            });
            it('Deve ter \'\' - \'NU_V0\'', function() {
                expect(iptu).to.have.property('NU_V0');
            });
            it('Deve ter \'\' - \'NU_VU\'', function() {
                expect(iptu).to.have.property('NU_VU');
            });
            it('Deve ter \'\' - \'NU_VULP\'', function() {
                expect(iptu).to.have.property('NU_VULP');
            });
            it('Deve ter \'\' - \'DE_SITUACAO_EXERCICIO_ATUAL\'', function() {
                expect(iptu).to.have.property('DE_SITUACAO_EXERCICIO_ATUAL');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_0\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_0');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_0\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_0');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_1\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_1');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_1\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_1');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_2\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_2');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_2\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_2');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_3\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_3');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_3\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_3');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_4\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_4');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_4\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_4');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_5\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_5');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_5\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_5');
            });
            it('Deve ter \'\' - \'NU_IPTU_LANCADO_6\'', function() {
                expect(iptu).to.have.property('NU_IPTU_LANCADO_6');
            });
            it('Deve ter \'\' - \'NU_TLP_LANCADO_6\'', function() {
                expect(iptu).to.have.property('NU_TLP_LANCADO_6');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_0\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_0');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_0\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_0');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_1\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_1');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_1\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_1');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_2\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_2');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_2\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_2');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_3\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_3');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_3\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_3');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_4\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_4');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_4\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_4');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_5\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_5');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_5\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_5');
            });
            it('Deve ter \'\' - \'NU_IPTU_ARRECADADO_6\'', function() {
                expect(iptu).to.have.property('NU_IPTU_ARRECADADO_6');
            });
            it('Deve ter \'\' - \'NU_TLP_ARRECADADO_6\'', function() {
                expect(iptu).to.have.property('NU_TLP_ARRECADADO_6');
            });




        });




    });

});
