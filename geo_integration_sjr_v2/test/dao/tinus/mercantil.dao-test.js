var chai = require('chai');
var expect = chai.expect;
var assert = chai.assert;
var sinon = require('sinon');
var MercantilDAO = require('./../../../app/dao/tinus/mercantil.dao');

var mercantilDAO = new MercantilDAO();


describe('mercantilDAO', function() {
    describe('.fillListWithTop', function() {
        var value = 1;
        mercantilDAO.fillListWithTop(value);

        it('Deve retornar ' + value + ' valor', function() {
            expect(mercantilDAO.list).to.have.lengthOf(value);

        });

        describe('Deve ter os atributos do documento SIAT - INTEGRAÇÃO_FINANÇAS_V1.xlsx', function() {



            var mercantil = mercantilDAO.list[0];
            it('Deve ter \'Sequencial\' - \'NU_SEQUENCIAL\'', function() {
                expect(mercantil).to.have.property('NU_SEQUENCIAL');
            });
            it('Deve ter \'Inscricao\' - \'NU_INSCRICAO\'', function() {
                expect(mercantil).to.have.property('NU_INSCRICAO');
            });
            it('Deve ter \'Denominacao\' - \'DE_DENOMINACAO\'', function() {
                expect(mercantil).to.have.property('DE_DENOMINACAO');
            });
            it('Deve ter \'NomeFantasia\' - \'DE_NOME_FANTASIA\'', function() {
                expect(mercantil).to.have.property('DE_NOME_FANTASIA');
            });
            it('Deve ter \'LocalIgnorado\' - \'FL_LOCAL_IGNORADO\'', function() {
                expect(mercantil).to.have.property('FL_LOCAL_IGNORADO');
            });
            it('Deve ter \'Situacao\' - \'DE_SITUACAO\'', function() {
                expect(mercantil).to.have.property('DE_SITUACAO');
            });
            it('Deve ter \'CPF_CNPJ\' - \'DE_CPF_CNPJ\'', function() {
                expect(mercantil).to.have.property('DE_CPF_CNPJ');
            });
            it('Deve ter \'Endereco\' - \'DE_ENDERECO\'', function() {
                expect(mercantil).to.have.property('DE_ENDERECO');
            });
            it('Deve ter \'Atividade\' - \'DE_ATIVIDADE\'', function() {
                expect(mercantil).to.have.property('DE_ATIVIDADE');
            });
            it('Deve ter \'AtividadeTLL\' - \'DE_ATIVIDADE_TLL\'', function() {
                expect(mercantil).to.have.property('DE_ATIVIDADE_TLL');
            });
            it('Deve ter \'Licenciado\' - \'FL_LICENCIADO\'', function() {
                expect(mercantil).to.have.property('FL_LICENCIADO');
            });
            it('Deve ter \'AnunciosLetreiros\' - \'DE_ANUNCIOS_LETREIROS\'', function() {
                expect(mercantil).to.have.property('DE_ANUNCIOS_LETREIROS');
            });
            it('Deve ter \'DataCadastro\' - \'DT_DATA_CADASTRO\'', function() {
                expect(mercantil).to.have.property('DT_DATA_CADASTRO');
            });
            it('Deve ter \'SociedadeProfissional\' - \'FL_SOCIEDADE_PROFISSIONAL\'', function() {
                expect(mercantil).to.have.property('FL_SOCIEDADE_PROFISSIONAL');
            });
            it('Deve ter \'TipoAtividade\' - \'DE_TIPO_ATIVIDADE\'', function() {
                expect(mercantil).to.have.property('DE_TIPO_ATIVIDADE');
            });
            it('Deve ter \'IncentivoFiscal\' - \'FL_INCENTIVO_FISCAL\'', function() {
                expect(mercantil).to.have.property('FL_INCENTIVO_FISCAL');
            });
            it('Deve ter \'IncentivoBaseLegal\' - \'DE_INCENTIVO_BASE_LEGAL\'', function() {
                expect(mercantil).to.have.property('DE_INCENTIVO_BASE_LEGAL');
            });
            it('Deve ter \'IncentivoVigencia\' - \'DE_INCENTIVO_VIGENCIA\'', function() {
                expect(mercantil).to.have.property('DE_INCENTIVO_VIGENCIA');
            });
            it('Deve ter \'ReducaoAlíquota\' - \'FL_REDUCAO_ALÍQUOTA\'', function() {
                expect(mercantil).to.have.property('FL_REDUCAO_ALÍQUOTA');
            });
            it('Deve ter \'ReducaoBaseLegal\' - \'DE_REDUCAO_BASE_LEGAL\'', function() {
                expect(mercantil).to.have.property('DE_REDUCAO_BASE_LEGAL');
            });
            it('Deve ter \'RegimeISS\' - \'DE_REGIME_ISS\'', function() {
                expect(mercantil).to.have.property('DE_REGIME_ISS');
            });
            it('Deve ter \'RegimeTLF\' - \'DE_REGIME_TLF\'', function() {
                expect(mercantil).to.have.property('DE_REGIME_TLF');
            });
            it('Deve ter \'RegimePublicidade\' - \'DE_REGIME_PUBLICIDADE\'', function() {
                expect(mercantil).to.have.property('DE_REGIME_PUBLICIDADE');
            });
            it('Deve ter \'RegimeMaquinasAfins\' - \'DE_REGIME_MAQUINAS_AFINS\'', function() {
                expect(mercantil).to.have.property('DE_REGIME_MAQUINAS_AFINS');
            });
            it('Deve ter \'RegimeOcupacaoAreaPublica\' - \'DE_REGIME_OCUPACAO_AREA_PUBLICA\' (DE_REGIME_OCUPACAO_AREA_PUBLIC)', function() {
                expect(mercantil).to.have.property('DE_REGIME_OCUPACAO_AREA_PUBLIC');
            });
            it('Deve ter \'RegimeHorarioEspecial\' - \'DE_REGIME_HORARIO_ESPECIAL\'', function() {
                expect(mercantil).to.have.property('DE_REGIME_HORARIO_ESPECIAL');
            });
            it('Deve ter \'QtdMaquinas\' - \'NU_QUANTIDADE_MAQUINAS\'', function() {
                expect(mercantil).to.have.property('NU_QUANTIDADE_MAQUINAS');
            });
            it('Deve ter \'QtdMotores\' - \'NU_QUANTIDADE_MOTORES\'', function() {
                expect(mercantil).to.have.property('NU_QUANTIDADE_MOTORES');
            });
            it('Deve ter \'QtdFornos\' - \'NU_QUANTIDADE_FORNOS\'', function() {
                expect(mercantil).to.have.property('NU_QUANTIDADE_FORNOS');
            });
            it('Deve ter \'QtdGuindastes\' - \'NU_QUANTIDADE_GUINDASTES\'', function() {
                expect(mercantil).to.have.property('NU_QUANTIDADE_GUINDASTES');
            });









            expect(mercantilDAO.list).to.have.lengthOf(value);

        });




    });

});
