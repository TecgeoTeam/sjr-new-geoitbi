var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var Knex = require('knex');

var knexConfig = require('./../../../knexfile');
var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);

var IptuDAO = require('./../../../app/dao/tinus/iptu.dao');

var iptuDAO = new IptuDAO();

var logMessageUtil = require('./../../../app/util/logMessage.util');

var BairroFinancasModel = require('../../models/financas/bairroFinancas.model.js');
var BairroModel = require('../../models/bairro.model.js');
var DistritoFinancasModel = require('../../models/financas/distritoFinancas.model.js');
var DistritoModel = require('../../models/distrito.model.js');
var ErroModel = require('../../models/erro.model.js');
var IptuMigracaoModel = require('../../models/iptuMigracao.model.js');
var LogModel = require('../../models/log.model.js');
var LoteFinancasModel = require('../../models/financas/loteFinancas.model.js');
var LoteModel = require('../../models/lote.model.js');
var QuadraFinancasModel = require('../../models/financas/quadraFinancas.model.js');

var QuadraSobrepostaFinancasModel = require('../../models/financas/quadraSobrepostaFinancas.model.js');
var QuadraModel = require('../../models/quadra.model.js');
var RegionalFinancasModel = require('../../models/financas/regionalFinancas.model.js');
var RegionalModel = require('../../models/regional.model.js');
var SetorFinancasModel = require('../../models/financas/setorFinancas.model.js');
var SetorModel = require('../../models/setor.model.js');
var UnidadeFinancasModel = require('../../models/financas/unidadeFinancas.model.js');



BairroFinancasModel.knex(null);
BairroModel.knex(null);
DistritoFinancasModel.knex(null);
DistritoModel.knex(null);
ErroModel.knex(null);
IptuMigracaoModel.knex(null);
LogModel.knex(null);
LoteFinancasModel.knex(null);
LoteModel.knex(null);
QuadraFinancasModel.knex(null);

QuadraSobrepostaFinancasModel.knex(null);
QuadraModel.knex(null);
RegionalFinancasModel.knex(null);
RegionalModel.knex(null);
SetorFinancasModel.knex(null);
SetorModel.knex(null);
UnidadeFinancasModel.knex(null);

var boundBairroFinancasModel = BairroFinancasModel.bindKnex(knexFinancas);
var boundBairroModel = BairroModel.bindKnex(knexGeoAuth);
var boundDistritoFinancasModel = DistritoFinancasModel.bindKnex(knexFinancas);
var boundDistritoModel = DistritoModel.bindKnex(knexGeoAuth);
var boundErroModel = ErroModel.bindKnex(knexGeoAuth);
var boundIptuMigracaoModel = IptuMigracaoModel.bindKnex(knexGeoAuth);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);
var boundLoteFinancasModel = LoteFinancasModel.bindKnex(knexFinancas);
var boundLoteModel = LoteModel.bindKnex(knexGeoAuth);
var boundQuadraFinancasModel = QuadraFinancasModel.bindKnex(knexFinancas);

var boundQuadraSobrepostaFinancasModel = QuadraSobrepostaFinancasModel.bindKnex(knexFinancas);
var boundQuadraModel = QuadraModel.bindKnex(knexGeoAuth);
var boundRegionalFinancasModel = RegionalFinancasModel.bindKnex(knexFinancas);
var boundRegionalModel = RegionalModel.bindKnex(knexGeoAuth);
var boundSetorFinancasModel = SetorFinancasModel.bindKnex(knexFinancas);
var boundSetorModel = SetorModel.bindKnex(knexGeoAuth);
var boundUnidadeFinancasModel = UnidadeFinancasModel.bindKnex(knexFinancas);
var configModel = require('../../models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);

var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
var logLevel;



var IptuMigracaoDao = {
    migrateAll: migrateAll,
    removeAll: removeAll,
    generateTables: generateTables,
    fillFinancas: fillFinancas,
    generateLote: generateLote,
    generateDistrito: generateDistrito
};

module.exports = IptuMigracaoDao;

function migrateAll(next) {

    async.waterfall([
        //remove os dados antigos
        function (callback) {
            boundConfigModel
                .query()
                .first()
                .then(function (row) {
                    var configJson = row.de_config;
                    logLevel = configJson.logLevel;
                    var qtdIptu = iptuDAO.count();
                    //console.log("Quantidade de feições que serão migradas do banco da TINUS: ", qtdIptu);
                    if (qtdIptu > 0) {
                        removeAll(callback);
                    } else {
                        callback('A tabela usada para migração está vazia', null);
                    }
                });
        },
        function (result, callback) {
            migrate(callback);
        }

    ], function (err, result) {
        if (err) {
            if (next) {
                next(err, null);
            } else {
                console.log(err);
            }

        } else {
            if (next) {
                next(null, result);
            } else {
                console.log(result);
            }
        }
        // result now equals 'done'
    });

}

function generateTables(next) {
    async.waterfall([
        function (callback) {
            generateLote(callback);
        },
        // function(result, callback) {
        //     generateLoteWithoutImposto(callback);
        // },
        // //através de Lotes gera a tabela de Quadras
        // function(result, callback) {
        //     generateQuadra(callback);
        // },
        // function(result, callback) {
        //     generateBairro(callback);
        // },
        // function(result, callback) {
        //     generateRegional(callback);
        // },
        // function(result, callback) {
        //     generateSetor(callback);
        // },
        // function(result, callback) {
        //     generateDistrito(callback);
        // }
    ], function (err, result) {
        if (err) {
            if (next) {
                next(err, null);
            } else {
                console.log(err);
            }

        } else {
            if (next) {
                next(null, result);
            } else {
                console.log(result);
            }
        }
        // result now equals 'done'
    });
}

function fillFinancas(next) {
    var financasResults = [];
    async.parallel([
        function (callback) {
            //UNIDADES
            console.log("====== Update de UNIDADES ======")
            fillTableFinancas(boundUnidadeFinancasModel, boundIptuMigracaoModel, callback);
        },
        function (callback, results) {
            financasResults.push(results);
            //LOTES
            console.log("====== Update de LOTES ======")
            // USAR TIMEOUT QDO GERAR TB_LOTES DO 0.
            setTimeout(function () { 
            updateTableLoteFinancas(boundLoteFinancasModel, boundLoteModel, 'geocoding', 'de_geocodigo', callback);
            }, 180000);
            // CASO DÊ REQUEST TIMEOUT, SUGERE-SE AUMENTAR O TEMPO, A FUNÇÃO PARALLEL FAZ 2 REQUISICOES AO MESMO
            // TEMPO, ENTÃO O SETTIMEOUT ATRASA ESSAS REQUISICOES.
        },
        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundQuadraFinancasModel, boundQuadraModel, 'dsqf', 'de_geocodigo', callback);
        // },
        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundQuadraSobrepostaFinancasModel, boundQuadraModel, 'dsqf', 'de_geocodigo', callback);
        // },

        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundBairroFinancasModel, boundBairroModel, 'nu_cod_bairro', 'de_geocodigo', callback);
        // },

        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundRegionalFinancasModel, boundRegionalModel, 'nu_cod_regional', 'de_geocodigo', callback);
        // },

        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundSetorFinancasModel, boundSetorModel, 'de_geocodigo', 'de_geocodigo', callback);
        // },
        // function(callback, results) {
        //     financasResults.push(results);
        //     updateTableFinancas(boundDistritoFinancasModel, boundDistritoModel, 'distrito', 'de_geocodigo', callback);
        // }
    ],
        // optional callback
        function (err, results) {
            if (err) {
                if (next) {
                    next(err, null);
                } else {
                    console.log(err);
                }

            } else {
                var logs = [];
                for (var i = 0; i < results.length; i++) {
                    //TODO mensagem de finança
                    console.log(results);
                    logs.push(logMessageUtil.updateMessage(results[i][1].tableName, results[i][0]));
                }
                for (var i = 0; i < logs.length; i++) {
                    console.log(logs[i].de_mensagem);
                }

                //TODO Criar DAO para IptuErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function (logDB) { })
                    .catch(function (err) {
                        next(err);
                        console.log(err);
                    });
                if (next) {
                    next(null, results);
                }

            }
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });
}

//UNIDADES
function fillTableFinancas(boundObjectFinancasModel, boundObjectModel, next) {
    boundObjectFinancasModel
        .query()
        .delete()
        .then(function (deletedRows) {
            var loteLimit = 100000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            async.whilst(
                function () {
                    return !wereAllInserted;
                },
                function (done) {
                    boundObjectModel
                        .query()
                        .limit(loteLimit).offset(offset)
                        .then(function (list) {
                            console.log("Trabalhando no De-para de Unidades");
                            for (var i = 0; i < list.length; i++) {
                                list[i].objectid = offset + i + 1;
                                //alimentar um campo com o stg_geocode
                                list[i] = _.mapKeys(list[i], function (value, key) {
                                    if (key === 'objectid') {
                                        return 'OBJECTID';
                                    }
                                    if (key === 'id') {
                                        return 'ID_IMOVEL';
                                    }
                                    if (key === 'de_geocodigo') {
                                        return 'DE_GEOCODE_LOTE';
                                    }
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'DE_REF_CADASTRAL';
                                    }
                                    if (key === 'de_distrito') {
                                        return 'DE_DISTRITO';
                                    }
                                    if (key === 'de_setor') {
                                        return 'DE_SETOR';
                                    }
                                    if (key === 'de_quadra') {
                                        return 'DE_QUADRA_FISCAL';
                                    }
                                    if (key === 'de_lote') {
                                        return 'DE_LOTE_FISCAL';
                                    }
                                    if (key === 'de_unidade') {
                                        return 'DE_UNIDADE';
                                    }
                                    if (key === 'de_cod_logradouro') {
                                        return 'NU_COD_LOGRADOURO';
                                    }
                                    if (key === 'de_logradouro') {
                                        return 'DE_LOGRADOURO';
                                    }
                                    if (key === 'de_numero') {
                                        return 'DE_NUMERO';
                                    }
                                    if (key === 'de_complemento') {
                                        return 'DE_COMPLEMENTO';
                                    }
                                    if (key === 'de_cep') {
                                        return 'DE_CEP';
                                    }
                                    if (key === 'de_bairro') {
                                        return 'DE_BAIRRO';
                                    }
                                    if (key === 'dt_datacadastro') {
                                        return 'DE_IDADE';
                                    }
                                    // Não existe quantidade de edificações no lote, criar.
                                    // if (key === 'nu_edificacoes') {
                                    //     return 'NU_EDIFICACACOES';
                                    // }
                                    // Não existe tipo do condomínio, solicitar ou criar.
                                    // if (key === 'de_tipo_condominio') {
                                    //     return 'DE_TIPO_CONDOMINIO';
                                    // }
                                    // Não existe condomínio, solicitar ou criar.
                                    // if (key === 'de_condominio') {
                                    //     return 'DE_CONDOMINIO';
                                    // }
                                    if (key === 'de_natureza') {
                                        return 'DE_USO';
                                    }
                                    // Não existe zona referencia, solicitar.
                                    // if (key === 'de_zona_referencia') {
                                    //     return 'DE_ZONA_REFERENCIA';
                                    // }
                                    // Não existe zona fiscal, solicitar.
                                    // if (key === 'de_zona_fiscal') {
                                    //     return 'DE_ZONA_FISCAL';
                                    // }
                                    if (key === 'nu_testada_ficticia') {
                                        return 'NU_TESTADA_T1';
                                    }
                                    if (key === 'nu_area_terreno') {
                                        return 'NU_AREA_TERRENO';
                                    }
                                    // Não existe tipo terreno, solicitar.
                                    // if (key === 'de_tipo_terreno') {
                                    //     return 'DE_TIPO_TERRENO';
                                    // }
                                    // Não existe ano terreno, solicitar
                                    // if (key === 'de_ano_terreno') {
                                    //     return 'DE_ANO_TERRENO';
                                    // }
                                    // Não existe valor terreno, solicitar.
                                    // if (key === 'nu_valor_terreno') {
                                    //     return 'NU_VALOR_TERRENO';
                                    // }
                                    // Não existe de_agua, solicitar.
                                    // if (key === 'de_agua') {
                                    //     return 'DE_AGUA';
                                    // }
                                    // Não existe estacionamento, solicitar
                                    // if (key === 'de_estacionamento') {
                                    //     return 'DE_ESTACIONAMENTO';
                                    // }
                                    // Não existe transporte coletivo, solicitar.
                                    // if (key === 'de_transporte_coletivo') {
                                    //     return 'DE_TRANSPORTE_COLETIVO';
                                    // }
                                    // Não existe conservação da via, solcilitar.
                                    // if (key === 'de_conservacao_via') {
                                    //     return 'DE_CONSERVACAO_VIA';
                                    // }
                                    if (key === 'de_limpeza') {
                                        return 'DE_LIMPEZA_PUBLICA';
                                    }
                                    // Não existe ocupação do lote, solicitar.
                                    // if (key === 'de_ocupacao_do_lote') {
                                    //     return 'DE_OCUPACAO_DO_LOTE';
                                    // }
                                    if (key === 'de_pedologia') {
                                        return 'DE_PEDOLOGIA';
                                    }
                                    // Não existe drenagem, solicitar.
                                    // if (key === 'de_drenagem') {
                                    //     return 'DE_DRENAGEM';
                                    // }
                                    // Não existe rede eletrica, solicitar. 
                                    // if (key === 'de_rede_eletrica') {
                                    //     return 'DE_REDE_ELETRICA';
                                    // }
                                    // Não existe coleta de lixo, solicitar.
                                    // if (key === 'de_coleta_lixo') {
                                    //     return 'DE_COLETA_LIXO';
                                    // }
                                    if (key === 'de_situacao_exercicio_atual') {
                                        return 'DE_SITUACAO';
                                    }
                                    // Não existe iluminação, solicitar.
                                    // if (key === 'de_iluminacao') {
                                    //     return 'DE_ILUMINACAO';
                                    // }
                                    // Não existe tipo de via, solicitar.
                                    // if (key === 'de_tipo_via') {
                                    //     return 'DE_TIPO_VIA';
                                    // }
                                    // Não existe sentido do logradouro, solicitar.
                                    // if (key === 'de_sentido_logradouro') {
                                    //     return 'DE_SENTIDO_LOGRADOURO';
                                    // }
                                    if (key === 'de_pavimentacao') {
                                        return 'DE_PAVIMENTACAO';
                                    }
                                    // Não existe codigo mensagem.
                                    // if (key === 'de_codigo_mensagem') {
                                    //     return 'DE_CODIGO_MENSAGEM';
                                    // }
                                    // Não existe cobrança.
                                    // if (key === 'de_cobranca') {
                                    //     return 'DE_COBRANCA';
                                    // }
                                    if (key === 'de_limitacao_lote') {
                                        return 'DE_LIMITE';
                                    }
                                    // Não existe rede telefonica
                                    // if (key === 'de_rede_telefonica') {
                                    //     return 'DE_REDE_TELEFONICA';
                                    // }
                                    // Não existe hidrante, solicitar.
                                    // if (key === 'de_hidrante') {
                                    //     return 'DE_HIDRANTE';
                                    // }
                                    if (key === 'de_topografia') {
                                        return 'DE_TOPOGRAFIA';
                                    }
                                    // Não existe patrimonio, solicitar.
                                    // if (key === 'de_patrimonio') {
                                    //     return 'DE_PATRIMONIO';
                                    // }
                                    // Não existe arborização, solicitar.
                                    // if (key === 'de_arborizacao') {
                                    //     return 'DE_ARBORIZACAO';
                                    // }
                                    // Não existe ponto serviço.
                                    // if (key === 'de_ponto_servico') {
                                    //     return 'DE_PONTO_SERVICO';
                                    // }
                                    // Não existe esgoto, solicitar.
                                    // if (key === 'de_esgoto') {
                                    //     return 'DE_ESGOTO';
                                    // }
                                    if (key === 'de_calcada') {
                                        return 'DE_CALCADA';
                                    }
                                    // Não existe meio fio.
                                    // if (key === 'de_meiofio') {
                                    //     return 'DE_MEIOFIO';
                                    // }
                                    if (key === 'nu_area_total_construida') {
                                        return 'NU_AREA_CONSTRUIDA';
                                    }
                                    if (key === 'de_tipo_imovel') {
                                        return 'DE_TIPO_IMOVEL';
                                    }
                                    // Não existe ano predial.
                                    // if (key === 'de_ano_predial') {
                                    //     return 'DE_ANO_PREDIAL';
                                    // }
                                    // Não existe carac valor predial.
                                    // if (key === 'nu_carac_valor_predial') {
                                    //     return 'NU_CARAC_VALOR_PREDIAL';
                                    // }
                                    //Não existe pavimentos, solicitar.
                                    // if (key === 'de_pavimentos') {
                                    //     return 'DE_PAVIMENTOS';
                                    // }
                                    if (key === 'de_estado_conservacao') {
                                        return 'DE_CONSERVACAO';
                                    }
                                    // Não existe de_uso_imovel
                                    // if (key === 'de_uso_imovel') {
                                    //     return 'DE_USO_IMOVEL';
                                    // }
                                    // Não existe de_destinacao
                                    // if (key === 'de_destinacao') {
                                    //     return 'DE_DESTINACAO';
                                    // }
                                    if (key === 'de_tipo_imovel') {
                                        return 'DE_TIPOLOGIA';
                                    }
                                    if (key === 'nu_padrao_construcao') {
                                        return 'DE_PADRAO_CONSTRUCAO';
                                    }
                                    if (key === 'de_padrao_qualidade') {
                                        return 'DE_SENTIDO';
                                    }
                                    // Não existe elevador, solicitar.
                                    // if (key === 'de_elevador') {
                                    //     return 'DE_ELEVADOR';
                                    // }
                                    if (key === 'de_estrutura') {
                                        return 'DE_ESTRUTURA';
                                    }
                                    // Não existe situação prefeitura.
                                    // if (key === 'de_situacao_prefeitura') {
                                    //     return 'DE_SITUACAO_PREFEITURA';
                                    // }
                                    // Não existe PAR.
                                    // if (key === 'de_par') {
                                    //     return 'DE_PAR';
                                    // }
                                    // Não existe posicao da construcao
                                    // if (key === 'de_posicao_construcao') {
                                    //     return 'DE_POSICAO_CONSTRUCAO';
                                    // }
                                    // Não existe irregularidade, solicitar.
                                    // if (key === 'de_irregularidade') {
                                    //     return 'DE_IRREGULARIDADE';
                                    // }
                                    // Não existe calcada pedestre.
                                    // if (key === 'de_calcada_pedestre') {
                                    //     return 'DE_CALCADA_PEDESTRE';
                                    // }
                                    // Não existe esquadria
                                    // if (key === 'de_esquadria') {
                                    //     return 'DE_ESQUADRIA';
                                    // }
                                    // Não existe area verde.
                                    // if (key === 'de_area_verde') {
                                    //     return 'DE_AREA_VERDE';
                                    // }
                                    // Não existe imovel na planta.
                                    // if (key === 'de_imovel_na_planta') {
                                    //     return 'DE_IMOVEL_NA_PLANTA';
                                    // }
                                    // Não existe fachada principal, solicitar.
                                    // if (key === 'de_fachada_principal') {
                                    //     return 'DE_FACHADA_PRINCIPAL';
                                    // }
                                    // Não existe cobertura, solicitar.
                                    // if (key === 'de_cobertura') {
                                    //     return 'DE_COBERTURA';
                                    // }
                                    // Não existe esse campo.
                                    // if (key === 'nu_imo_valor_territorio') {
                                    //     return 'NU_IMO_VALOR_TERRITORIO';
                                    // }
                                    // Não existe esse campo.
                                    // if (key === 'nu_imo_valor_predial') {
                                    //     return 'NU_IMO_VALOR_PREDIAL';
                                    // }
                                    if (key === 'nu_valor_venal') {
                                        return 'NU_IMO_VALOR_VENAL';
                                    }
                                    if (key === 'nu_iptu_arrecadado_0') {
                                        return 'NU_IMO_VALOR_IPTU';
                                    }
                                    if (key === 'nu_fracao_ideal') {
                                        return 'NU_FRACAO_IDEAL';
                                    }
                                    if (key === 'dt_ultima_atualizacao_mig') {
                                        return 'DT_DATA_MIGRACAO';
                                    }
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'DE_GEOCODE_STM';
                                    }
                                    // MONTAR ESSE CAMPO MAIS TARDE
                                    // if (key === 'de_cod_sqcodlog') {
                                    //     return 'DE_COD_SQCODLOG';
                                    // }
                                    if (key === 'nu_inscricao_anterior') {
                                        return 'DE_INSCRICAO_ANTERIOR';
                                    }
                                    // Não existe isento, solicitar.
                                    // if (key === 'de_isento') {
                                    //     return 'DE_ISENTO';
                                    // }
                                    // Não existe geocodeid
                                    // if (key === 'geocode_id') {
                                    //     return 'GEOCODE_ID';
                                    // }
                                    if (key === 'de_proprietario') {
                                        return 'DE_PROP_NOME';
                                    }
                                    if (key === 'de_cpf_cnpj') {
                                        return 'DE_PROP_CPF';
                                    }
                                    // Não existe cidade do proprietario, solicitar ou gerar.
                                    // if (key === 'de_prop_cidade') {
                                    //     return 'DE_PROP_CIDADE';
                                    // }
                                    // Não existe o UF.
                                    // if (key === 'de_prop_uf') {
                                    //     return 'DE_PROP_UF';
                                    // }
                                    // Não existe proprietario aquisicao
                                    // if (key === 'de_prop_aquisicao') {
                                    //     return 'DE_PROP_AQUISICAO';
                                    // }
                                    // Não existe endereço do proprietário
                                    // if (key === 'de_prop_endereco') {
                                    //     return 'DE_PROP_ENDERECO';
                                    // }
                                    // Não existe numero do enredeço do proprietario, solicitar ou gerar
                                    // if (key === 'de_prop_numero') {
                                    //     return 'DE_PROP_NUMERO';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_complemento') {
                                    //     return 'DE_PROP_COMPLEMENTO';
                                    // }
                                    // Não existe cep do proprietario
                                    // if (key === 'de_prop_cep') {
                                    //     return 'DE_PROP_CEP';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_cep') {
                                    //     return 'DE_PROP_CEP';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_bairro') {
                                    //     return 'DE_PROP_BAIRRO';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_quadra') {
                                    //     return 'DE_PROP_QUADRA';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_nome') {
                                    //     return 'DE_PROP_FONE';
                                    // }
                                    // Não existe este campo.
                                    // if (key === 'de_prop_email') {
                                    //     return 'DE_PROP_EMAIL';
                                    // }
                                    // Gerar esse campo.
                                    if (key === 'de_geocodigo') {
                                        return 'DE_GEOCODE_LOTE';
                                    }
                                    if (key === 'de_face_quadra') {
                                        return 'de_face';
                                    }
                                    if (key === 'nu_sequencial_anterior') {
                                        return 'DE_SEQUENCIAL_ANTERIOR';
                                    }
                                    if (key === 'nu_logradouro_anterior') {
                                        return 'DE_COD_LOG_ANT';
                                    }
                                    if (key === 'nu_geoface') {
                                        return 'NU_GEO_FACE';
                                    }
                                    return key
                                });
                                if (list[i].fl_carne_devolvido === true) {
                                    list[i].fl_carne_devolvido = 'Sim';
                                } else if (list[i].fl_carne_devolvido === false) {
                                    list[i].fl_carne_devolvido = 'Não';
                                }
                                delete list[i].de_padrao_construcao;
                                delete list[i].nu_cod_regional;
                                delete list[i].de_regional;
                                delete list[i].nu_cod_bairro;
                                delete list[i].de_cod_loteamento;
                                delete list[i].de_loteamento;
                                delete list[i].de_utilizacao;
                                delete list[i].nu_area_unidade;
                                delete list[i].nu_aliquota;
                                delete list[i].nu_v0;
                                delete list[i].nu_vu;
                                delete list[i].nu_vulp;
                                delete list[i].nu_iptu_lancado_0;
                                delete list[i].nu_tlp_lancado_0;
                                delete list[i].nu_iptu_lancado_1;
                                delete list[i].nu_tlp_lancado_1;
                                delete list[i].nu_iptu_lancado_2;
                                delete list[i].nu_tlp_lancado_2;
                                delete list[i].nu_iptu_lancado_3;
                                delete list[i].nu_tlp_lancado_3;
                                delete list[i].nu_iptu_lancado_4;
                                delete list[i].nu_tlp_lancado_4;
                                delete list[i].nu_iptu_lancado_5;
                                delete list[i].nu_tlp_lancado_5;
                                delete list[i].nu_iptu_lancado_6;
                                delete list[i].nu_tlp_lancado_6;
                                delete list[i].nu_tlp_arrecadado_0;
                                delete list[i].nu_iptu_arrecadado_1;
                                delete list[i].nu_tlp_arrecadado_1;
                                delete list[i].nu_iptu_arrecadado_2;
                                delete list[i].nu_tlp_arrecadado_2;
                                delete list[i].nu_iptu_arrecadado_3;
                                delete list[i].nu_tlp_arrecadado_3;
                                delete list[i].nu_iptu_arrecadado_4;
                                delete list[i].nu_tlp_arrecadado_4;
                                delete list[i].nu_iptu_arrecadado_5;
                                delete list[i].nu_tlp_arrecadado_5;
                                delete list[i].nu_iptu_arrecadado_6;
                                delete list[i].nu_tlp_arrecadado_6;
                                delete list[i].de_imposto;
                                delete list[i].de_edificio;
                                delete list[i].fl_carne_devolvido;
                                delete list[i].dt_datahabite_se;
                                delete list[i].de_codigo_vu;
                                delete list[i].de_revestimento;
                                delete list[i].nu_cod_face_de_quadra;
                                delete list[i].nu_sequencial;
                                delete list[i].nu_codigo;

                                //console.log("UNIDADE ==>>", list[i]);

                            }

                            knexFinancas
                                .batchInsert(boundObjectFinancasModel.tableName, list, 30)
                                .returning('DE_INSCRICAO')
                                .then(function (ids) {
                                    if (ids.length === 0) {
                                        wereAllInserted = true;
                                    } else {
                                        offset += ids.length;
                                        console.log(moment().format(momentFormat) + ': ' + 'Alterado ' + ids.length + ' registros. Total de ' + offset + ' alterado até o momento em ' + boundObjectFinancasModel.tableName);
                                    }
                                    done(null, offset, boundObjectFinancasModel);
                                })
                                .catch(function (err) {
                                    done(err, null);

                                });


                        })
                        .catch(function (err) {
                            done(err);
                        });
                },
                function (err, totalInserted, boundObjectFinancasModel) {
                    if (err) {
                        if (next) {
                            next(err, null);
                        } else {
                            console.log(err);
                        }
                    } else {
                        if (next) {
                            next(null, [totalInserted, boundObjectFinancasModel]);
                        }
                    }

                }
            );



        });
}
//LOTE
function updateTableLoteFinancas(boundLoteFinancasModel, boundLoteModel, idColumnNameFinancas, idColumnNameMigracao, next) {
    if (!idColumnNameMigracao) {
        idColumnNameMigracao = 'de_geocodigo';
    }
    boundLoteFinancasModel
        .query()
        .delete()
        .then(function (objectFinancasList) {
            //PODE SER QUE O loteLimit ESTEJA LIMITANDO O TAMANHO DO BATCH
            var loteLimit = 100000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
            var firstTime = true;
            async.whilst(
                function () {
                    return !wereAllInserted;
                },
                function (done) {
                    boundLoteModel
                        .query()
                        //.orderBy('de_geocodigo')
                        .limit(loteLimit).offset(offset)
                        //EAGER DÁ PROBLEMA NOS LOTES, VERIFICAR O QUE PODE SER, PROVAVELMENTE TAMANHO DE CAMPO RELACIONADO A MERCANTIL/ITBI
                        //.eager('[mercantil, itbi]')
                        .then(function (selectRow) {
                            var arrayRows = Object.values(selectRow);
                            console.log("Trabalhando no De-para de Lotes");
                            // DE-PARA DE LOTES
                            for (var k = 0; k < arrayRows.length; k++) {
                                arrayRows[k].OBJECTID = offset + k + 1;
                                arrayRows[k] = _.mapKeys(arrayRows[k], function (value, key) {
                                    if (key === 'de_geocodigo') {
                                        return 'DE_GEOCODE_LOTE';
                                    }
                                    if (key === 'nu_sequencial') {
                                        return 'DE_ID';
                                    }
                                    if (key === 'de_setor') {
                                        return 'DE_SETOR';
                                    }
                                    if (key === 'de_quadra') {
                                        return 'DE_QUADRA';
                                    }
                                    if (key === 'de_lote') {
                                        return 'DE_LOTE';
                                    }
                                    if (key === 'nu_area_terreno') {
                                        return 'NU_AREA_TERRENO';
                                    }
                                    if (key === 'de_limitacao_lote') {
                                        return 'DE_LIMITES';
                                    }
                                    if (key === 'de_calcada') {
                                        return 'DE_CALCADA_PEDESTRE';
                                    }
                                    //ESSE CAMPO NÃO EXISTE, SOLICITAR.
                                    // if (key === 'de_posicao_lote') {
                                    //     return 'DE_POSICAO_LOTE';
                                    // }
                                    if (key === 'de_topografia') {
                                        return 'DE_TOPOGRAFIA';
                                    }
                                    if (key === 'de_pedologia') {
                                        return 'DE_PEDOLOGIA';
                                    }
                                    //ESSE CAMPO NÃO EXISTE, SOLICITAR.
                                    // if (key === 'de_arborizacao') {
                                    //     return 'DE_ARBORIZACAO';
                                    // }
                                    //ESSE CAMPO NÃO EXISTE.
                                    // if (key === 'de_irregularidade') {
                                    //     return 'DE_IRREGULARIDADE';
                                    // }
                                    //ESSE CAMPO NÃO EXISTE, SOLICITAR.
                                    // if (key === 'nu_lote_vincunlante') {
                                    //     return 'NU_LOTE_VINCULANTE';
                                    // }
                                    if (key === 'nu_testada_ficticia') {
                                        return 'NU_TESTADA_T1';
                                    }
                                    if (key === 'de_cod_logradouro') {
                                        return 'DE_CODLOG_T1';
                                    }
                                    if (key === 'nu_cod_bairro') {
                                        return 'NU_BAIRRO_ID';
                                    }
                                    if (key === 'dt_ultima_atualizacao_mig') {
                                        return 'DT_DATA_MIGRACAO';
                                    }
                                    if (key === 'dt_ultima_atualizacao_mig') {
                                        return 'DT_DATA_MIGRACAO';
                                    }
                                    //MONTAR ESSE CAMPO
                                    if (key === 'de_cod_sqcodlog') {
                                        return 'DE_COD_SQCODLOG';
                                    }
                                    if (key === 'de_distrito') {
                                        return 'DE_DISTRITO';
                                    }
                                    //ESSE CAMPO NÃO EXISTE.
                                    // if (key === 'de_realizar_migracao') {
                                    //     return 'DE_REALIZAR_MIGRACAO';
                                    // }
                                    if (key === 'nu_inscricao_anterior') {
                                        return 'DE_INSCRICAO_ANTERIOR';
                                    }
                                    if (key === 'de_padrao_qualidade') {
                                        return 'DE_PADRAO_CONSTRUCAO';
                                    }
                                    //ESSE CAMPO NÃO EXISTE, SOLICITAR/GERAR
                                    // if (key === 'de_isento') {
                                    //     return 'DE_ISENTO';
                                    // }
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'DE_REF_CADASTRAL';
                                    }
                                    return key;
                                });
                                delete arrayRows[k].nu_qtd_unidade;
                                delete arrayRows[k].de_natureza;
                                delete arrayRows[k].nu_cod_regional;
                                delete arrayRows[k].de_regional;
                                delete arrayRows[k].de_bairro;
                                delete arrayRows[k].de_cod_loteamento;
                                delete arrayRows[k].de_loteamento;
                                delete arrayRows[k].de_utilizacao;
                                delete arrayRows[k].de_limpeza;
                                delete arrayRows[k].nu_area_total_construida;
                                delete arrayRows[k].nu_iptu_lancado_0;
                                delete arrayRows[k].nu_tlp_lancado_0;
                                delete arrayRows[k].nu_iptu_lancado_1;
                                delete arrayRows[k].nu_tlp_lancado_1;
                                delete arrayRows[k].nu_iptu_lancado_2;
                                delete arrayRows[k].nu_tlp_lancado_2;
                                delete arrayRows[k].nu_iptu_lancado_3;
                                delete arrayRows[k].nu_tlp_lancado_3;
                                delete arrayRows[k].nu_iptu_lancado_4;
                                delete arrayRows[k].nu_tlp_lancado_4;
                                delete arrayRows[k].nu_iptu_lancado_5;
                                delete arrayRows[k].nu_tlp_lancado_5;
                                delete arrayRows[k].nu_iptu_lancado_6;
                                delete arrayRows[k].nu_tlp_lancado_6;
                                delete arrayRows[k].nu_iptu_arrecadado_0;
                                delete arrayRows[k].nu_tlp_arrecadado_0;
                                delete arrayRows[k].nu_iptu_arrecadado_1;
                                delete arrayRows[k].nu_tlp_arrecadado_1;
                                delete arrayRows[k].nu_iptu_arrecadado_2;
                                delete arrayRows[k].nu_tlp_arrecadado_2;
                                delete arrayRows[k].nu_iptu_arrecadado_3;
                                delete arrayRows[k].nu_tlp_arrecadado_3;
                                delete arrayRows[k].nu_iptu_arrecadado_4;
                                delete arrayRows[k].nu_tlp_arrecadado_4;
                                delete arrayRows[k].nu_iptu_arrecadado_5;
                                delete arrayRows[k].nu_tlp_arrecadado_5;
                                delete arrayRows[k].nu_iptu_arrecadado_6;
                                delete arrayRows[k].nu_tlp_arrecadado_6;
                                delete arrayRows[k].de_situacao_exercicio_atual;
                                delete arrayRows[k].de_imposto;
                                delete arrayRows[k].de_cpf_cnpj;
                                delete arrayRows[k].de_proprietario;
                                delete arrayRows[k].de_logradouro;
                                delete arrayRows[k].de_numero;
                                delete arrayRows[k].de_complemento;
                                delete arrayRows[k].nu_cod_face_de_quadra;
                                delete arrayRows[k].de_edificio;
                                delete arrayRows[k].de_cep;
                                delete arrayRows[k].nu_qtd_utili_religiosa;
                                delete arrayRows[k].nu_qtd_utili_servico_publico;
                                delete arrayRows[k].nu_qtd_utili_comercio;
                                delete arrayRows[k].nu_qtd_utili_residencial;
                                delete arrayRows[k].nu_qtd_transacao_itbi;
                                //RELAÇÃO UNIDADE COM MERCANTIL E ITBI;
                                delete arrayRows[k].fl_relacao_iptu_mercantil;
                                delete arrayRows[k].mercantil;

                                if (arrayRows[k].itbi) {
                                    delete arrayRows[k].itbi;
                                    // TODO: TRANSMISSÃO SERÁ ALIMENTADA ATRAVÉS DO OBJECT itbi, SE HOUVER DADO.
                                    // O CAMPO fl_relacao_iptu_mercantil, APRESENTA SE HÁ OU NÃO RELACAO COM ESSE DADO.
                                    // FAZER UM BATCH INSERT PARA TRANSMISSAO, AQUI NESSA LINHA.

                                } else {
                                    delete arrayRows[k].itbi;
                                }
                                //console.log("LOTE ==>>", arrayRows[k]);

                            }

                            if (firstTime){
                                firstTime = false;
                                knexFinancas
                                .batchInsert(boundLoteFinancasModel.tableName, arrayRows, 30)
                                .returning('DE_ID')
                                .then(function (loteIds) {
                                    offset += loteIds.length;
                                    console.log(moment().format(momentFormat) + ': ' + 'Alterado ' + loteIds.length + ' registros. Total de ' + offset + ' alterado até o momento em ' + boundLoteFinancasModel.tableName);
                                    done(null, offset, boundLoteFinancasModel);
                                })
                                .catch(function (err) {
                                    console.log(err);
                                    done(err, null);

                                });
                            }

                        })
                        .catch(function (err) {
                            done(err);
                        });
                },
                function (err, totalInserted, boundLoteFinancasModel) {
                    
                    if (err) {
                        if (next) {
                            next(err, null);
                        } else {
                            console.log(err);
                        }
                    } else {

                        if (next) {
                            next(null, [totalInserted, boundLoteFinancasModel]);
                        }
                    }

                }
            );



        });
}

function updateTableFinancas(boundObjectFinancasModel, boundObjectModel, idColumnNameFinancas, idColumnNameMigracao, next) {
    if (!idColumnNameMigracao) {
        idColumnNameMigracao = 'de_geocodigo';
    }
    boundObjectFinancasModel
        .query()
        .orderBy(idColumnNameFinancas)
        .then(function (objectFinancasList) {
            var loteLimit = 10000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
            async.whilst(
                function () {
                    return count < objectFinancasList.length;
                },
                function (done) {
                    boundObjectModel
                        .query()
                        .orderBy(idColumnNameMigracao)
                        .where(idColumnNameMigracao, objectFinancasList[count][idColumnNameFinancas])
                        .first()
                        .then(function (selectRow) {

                            if (selectRow) {
                                selectRow = _.mapKeys(selectRow, function (value, key) {
                                    if (key === 'nu_tlp_arrecadado_0') {
                                        return 'tlp__arrecadado_0';
                                    }
                                    if (key.indexOf('nu_tlp') !== -1) {
                                        var newKey = key.replace('nu_tlp', 'tlp')
                                        return newKey;
                                    }
                                    if (key.indexOf('nu_iptu') !== -1) {
                                        var newKey = key.replace('nu_iptu', 'iptu')
                                        return newKey;
                                    }
                                    if (idColumnNameFinancas && idColumnNameFinancas.indexOf('distrito') !== -1) {
                                        if (key === 'de_distrito') {
                                            return 'nu_distrito';
                                        }
                                    }
                                    return key
                                });
                                if (selectRow.fl_carne_devolvido === true) {
                                    selectRow.fl_carne_devolvido = 'Sim';
                                } else if (selectRow.fl_carne_devolvido === false) {
                                    selectRow.fl_carne_devolvido = 'Não';
                                }

                                if (selectRow.fl_relacao_iptu_mercantil === true) {
                                    selectRow.fl_relacao_iptu_mercantil = 'Sim';
                                } else if (selectRow.fl_relacao_iptu_mercantil === false) {
                                    selectRow.fl_relacao_iptu_mercantil = 'Não';
                                }
                                delete selectRow.id;
                                delete selectRow.nu_codigo;

                                delete selectRow.iptu_arrecadado_5;
                                delete selectRow.tlp_arrecadado_5;
                                delete selectRow.iptu_lancado_5;
                                delete selectRow.tlp_lancado_5;
                                delete selectRow.iptu_arrecadado_6;
                                delete selectRow.tlp_arrecadado_6;
                                delete selectRow.iptu_lancado_6;
                                delete selectRow.tlp_lancado_6;
                            } else {
                                selectRow = {};
                                selectRow.de_geocodigo = null;
                                selectRow.de_inscricao_imobiliaria = null;
                                selectRow.de_proprietario = null;
                                selectRow.de_cpf_cnpj = null;
                                selectRow.de_logradouro = null;
                                selectRow.de_numero = null;
                                selectRow.de_complemento = null;
                                selectRow.de_cep = null;
                                selectRow.nu_distrito = null;
                                selectRow.de_setor = null;
                                selectRow.de_quadra = null;
                                selectRow.de_lote = null;
                                selectRow.nu_qtd_unidade = null;
                                selectRow.de_natureza = null;
                                selectRow.nu_cod_regional = null;
                                selectRow.de_regional = null;
                                selectRow.nu_cod_bairro = null;
                                selectRow.de_bairro = null;
                                selectRow.de_cod_loteamento = null;
                                selectRow.de_loteamento = null;
                                selectRow.de_limitacao_lote = null;
                                selectRow.de_calcada = null;
                                selectRow.de_utilizacao = null;
                                selectRow.de_topografia = null;
                                selectRow.de_pedologia = null;
                                selectRow.de_limpeza = null;
                                selectRow.nu_area_terreno = null;
                                selectRow.nu_area_total_construida = null;
                                selectRow.iptu_lancado_0 = null;
                                selectRow.tlp_lancado_0 = null;
                                selectRow.iptu_lancado_1 = null;
                                selectRow.tlp_lancado_1 = null;
                                selectRow.iptu_lancado_2 = null;
                                selectRow.tlp_lancado_2 = null;
                                selectRow.iptu_lancado_3 = null;
                                selectRow.tlp_lancado_3 = null;
                                selectRow.iptu_lancado_4 = null;
                                selectRow.tlp_lancado_4 = null;
                                selectRow.iptu_arrecadado_0 = null;
                                selectRow.tlp__arrecadado_0 = null;
                                selectRow.iptu_arrecadado_1 = null;
                                selectRow.tlp_arrecadado_1 = null;
                                selectRow.iptu_arrecadado_2 = null;
                                selectRow.tlp_arrecadado_2 = null;
                                selectRow.iptu_arrecadado_3 = null;
                                selectRow.tlp_arrecadado_3 = null;
                                selectRow.iptu_arrecadado_4 = null;
                                selectRow.tlp_arrecadado_4 = null;
                                selectRow.nu_sequencial = null;
                            }


                            boundObjectFinancasModel
                                .query()
                                .update(selectRow)
                                .where(idColumnNameFinancas, objectFinancasList[count][idColumnNameFinancas])
                                .then(function (numberOfAffectedRows) {
                                    if (count > 0 && count % 1000 === 0) {
                                        console.log(moment().format(momentFormat) + ': ' + 'Atualizado de ' + count + ' de ' + objectFinancasList.length + ' Em:' + boundObjectFinancasModel.tableName);
                                    }
                                    count++;

                                    done(null, count, boundObjectFinancasModel);
                                }).catch(function (err) {
                                    console.log(err);
                                    done(err, null);

                                });

                        })
                        .catch(function (err) {
                            done(err);
                        });
                },
                function (err, totalInserted, boundObjectFinancasModel) {
                    if (err) {
                        if (next) {
                            next(err, null);
                        } else {
                            console.log(err);
                        }
                    } else {

                        if (next) {
                            next(null, [totalInserted, boundObjectFinancasModel]);
                        }
                    }

                }
            );



        });
}

function removeAll(next) {
    async.parallel([
        function (callback) {
            boundIptuMigracaoModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundIptuMigracaoModel]);
                });
        },
        function (callback) {
            boundLoteModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundLoteModel]);
                });
        },
        function (callback) {
            boundQuadraModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundQuadraModel]);
                });
        },
        function (callback) {
            boundBairroModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundBairroModel]);
                });
        },
        function (callback) {
            boundRegionalModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundRegionalModel]);
                });
        },
        function (callback) {
            boundSetorModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundSetorModel]);
                });
        },
        function (callback) {
            boundDistritoModel
                .query()
                .delete()
                // .where('age', '>', 100)
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundDistritoModel]);
                });
        },
        function (callback) {
            boundErroModel
                .query()
                .delete()
                .whereIn('de_nome_tabela', [boundIptuMigracaoModel.tableName, LoteModel.tableName])
                .then(function (numberOfDeletedRows) {
                    callback(null, [numberOfDeletedRows, boundErroModel]);
                });
        }
    ],
        // optional callback
        function (err, results) {
            if (err) {
                if (next) {
                    next(err, null);
                } else {
                    console.log(err);
                }

            } else {
                var logs = [];
                for (var i = 0; i < results.length; i++) {
                    logs.push(logMessageUtil.removeMessage(results[i][1].tableName, results[i][0]));
                }
                for (var i = 0; i < logs.length; i++) {
                    console.log(logs[i].de_mensagem);
                }
                //TODO Criar DAO para IptuErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function (logDB) { })
                    .catch(function (err) {
                        console.log('Erro ao registrar log de iptu');
                    });
                if (next) {
                    next(null, results);
                }

            }
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });

}

function generateDistrito(next) {
    // iptu = processData(iptu);
    boundSetorModel
        .query()
        .distinct('de_distrito')
        .then(function (distritoList) {
            for (var i = 0; i < distritoList.length; i++) {
                distritoList[i].de_geocodigo = distritoList[i].de_distrito;
                distritoList[i].nu_distrito = distritoList[i].de_distrito;
                delete distritoList[i].de_distrito;
            }
            knexGeoAuth
                .batchInsert(boundDistritoModel.tableName, distritoList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + geocodigos.length + ' Registros salvos em ' + boundDistritoModel.tableName;
                    console.log(message);
                    var distritoLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundDistritoModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('setores(orderByDeGeocodigo)', {
                                    orderByDeGeocodigo: function (builder) {
                                        builder.orderBy('de_distrito');
                                    }
                                })
                                .limit(distritoLimit).offset(offset)
                                .then(function (distritoList) {
                                    for (var i = 0; i < distritoList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_unidade = 0;
                                        var nu_qtd_lote = 0;
                                        var nu_qtd_quadra = 0;
                                        var nu_area_terreno = 0;
                                        var nu_area_total_construida = 0;

                                        unidadeBase = distritoList[i].setores[primeiro];


                                        distritoList[i].nu_distrito = unidadeBase.de_distrito;
                                        distritoList[i].nu_qtd_setor = distritoList[i].setores.length;

                                        for (var l = 0; l < distritoList[i].setores.length; l++) {
                                            nu_iptu_arrecadado_0 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(distritoList[i].setores[l].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(distritoList[i].setores[l].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(distritoList[i].setores[l].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(distritoList[i].setores[l].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(distritoList[i].setores[l].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(distritoList[i].setores[l].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(distritoList[i].setores[l].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(distritoList[i].setores[l].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(distritoList[i].setores[l].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(distritoList[i].setores[l].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(distritoList[i].setores[l].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(distritoList[i].setores[l].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(distritoList[i].setores[l].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(distritoList[i].setores[l].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(distritoList[i].setores[l].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(distritoList[i].setores[l].nu_tlp_lancado_6);
                                            nu_qtd_quadra += Number(distritoList[i].setores[l].nu_qtd_quadra);
                                            nu_qtd_lote += Number(distritoList[i].setores[l].nu_qtd_lote);
                                            nu_qtd_unidade += Number(distritoList[i].setores[l].nu_qtd_unidade);
                                            nu_area_terreno += Number(distritoList[i].setores[l].nu_area_terreno);
                                            nu_area_total_construida += Number(distritoList[i].setores[l].nu_area_total_construida);
                                        }

                                        distritoList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        distritoList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        distritoList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        distritoList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        distritoList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        distritoList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        distritoList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        distritoList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        distritoList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        distritoList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        distritoList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        distritoList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        distritoList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        distritoList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        distritoList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        distritoList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        distritoList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        distritoList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        distritoList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        distritoList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        distritoList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        distritoList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        distritoList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        distritoList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        distritoList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        distritoList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        distritoList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        distritoList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        distritoList[i].nu_qtd_quadra = nu_qtd_quadra;
                                        distritoList[i].nu_qtd_lote = nu_qtd_lote;
                                        distritoList[i].nu_qtd_unidade = nu_qtd_unidade;
                                        distritoList[i].nu_area_terreno = nu_area_terreno;
                                        distritoList[i].nu_area_total_construida = nu_area_total_construida;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < distritoList.length; i++) {
                                        boundDistritoModel
                                            .query()
                                            .patch(distritoList[i])
                                            .where('de_geocodigo', distritoList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= distritoList.length) {
                                                    offset += distritoList.length;
                                                    var log = logMessageUtil.generateMessage(boundDistritoModel.tableName, offset, boundSetorModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {
                                var log = logMessageUtil.generateMessage(boundDistritoModel.tableName, n, boundSetorModel.tableName, handlingStart);
                                console.log(log.de_mensagem);
                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de distritos');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateSetor(next) {
    // iptu = processData(iptu);
    boundQuadraModel
        .query()
        .distinct('de_distrito', 'de_setor')
        .then(function (setorList) {
            for (var i = 0; i < setorList.length; i++) {
                setorList[i].de_geocodigo = setorList[i].de_distrito + setorList[i].de_setor;
            }
            knexGeoAuth
                .batchInsert(boundSetorModel.tableName, setorList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + geocodigos.length + ' Registros salvos em ' + boundSetorModel.tableName;
                    console.log(message);
                    var loteLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundSetorModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('quadras(orderByDeGeocodigo)', {
                                    orderByDeGeocodigo: function (builder) {
                                        builder.orderBy(['de_distrito', 'de_setor']);
                                    }
                                })
                                .limit(loteLimit).offset(offset)
                                .then(function (setorList) {
                                    for (var i = 0; i < setorList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_unidade = 0;
                                        var nu_qtd_lote = 0;
                                        var nu_area_terreno = 0;
                                        var nu_area_total_construida = 0;

                                        unidadeBase = setorList[i].quadras[primeiro];


                                        setorList[i].de_distrito = unidadeBase.de_distrito;
                                        setorList[i].de_setor = unidadeBase.de_setor;
                                        setorList[i].nu_qtd_quadra = setorList[i].quadras.length;

                                        for (var l = 0; l < setorList[i].quadras.length; l++) {
                                            nu_iptu_arrecadado_0 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(setorList[i].quadras[l].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(setorList[i].quadras[l].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(setorList[i].quadras[l].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(setorList[i].quadras[l].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(setorList[i].quadras[l].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(setorList[i].quadras[l].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(setorList[i].quadras[l].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(setorList[i].quadras[l].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(setorList[i].quadras[l].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(setorList[i].quadras[l].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(setorList[i].quadras[l].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(setorList[i].quadras[l].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(setorList[i].quadras[l].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(setorList[i].quadras[l].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(setorList[i].quadras[l].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(setorList[i].quadras[l].nu_tlp_lancado_6);
                                            nu_qtd_lote += Number(setorList[i].quadras[l].nu_qtd_lote);
                                            nu_qtd_unidade += Number(setorList[i].quadras[l].nu_qtd_unidade);
                                            nu_area_terreno += Number(setorList[i].quadras[l].nu_area_terreno);
                                            nu_area_total_construida += Number(setorList[i].quadras[l].nu_area_total_construida);
                                        }

                                        setorList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        setorList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        setorList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        setorList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        setorList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        setorList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        setorList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        setorList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        setorList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        setorList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        setorList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        setorList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        setorList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        setorList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        setorList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        setorList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        setorList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        setorList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        setorList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        setorList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        setorList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        setorList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        setorList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        setorList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        setorList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        setorList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        setorList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        setorList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        setorList[i].nu_qtd_lote = nu_qtd_lote;
                                        setorList[i].nu_qtd_unidade = nu_qtd_unidade;
                                        setorList[i].nu_area_terreno = nu_area_terreno;
                                        setorList[i].nu_area_total_construida = nu_area_total_construida;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < setorList.length; i++) {
                                        boundSetorModel
                                            .query()
                                            .patch(setorList[i])
                                            .where('de_geocodigo', setorList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= setorList.length) {
                                                    offset += setorList.length;
                                                    var log = logMessageUtil.generateMessage(boundSetorModel.tableName, offset, boundQuadraModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {
                                var log = logMessageUtil.generateMessage(boundSetorModel.tableName, n, boundQuadraModel.tableName, handlingStart);
                                console.log(log.de_mensagem);
                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de setor');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateRegional(next) {
    // iptu = processData(iptu);
    boundQuadraModel
        .query()
        .distinct('nu_cod_regional')
        .then(function (regionalList) {

            for (var i = 0; i < regionalList.length; i++) {
                regionalList[i].de_geocodigo = regionalList[i].nu_cod_regional;
            }
            knexGeoAuth
                .batchInsert(boundRegionalModel.tableName, regionalList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + geocodigos.length + ' Registros salvos em ' + boundRegionalModel.tableName;
                    console.log(message);
                    var loteLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundRegionalModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('quadras(orderByDeGeocodigo)', {
                                    orderByDeGeocodigo: function (builder) {
                                        builder.orderBy('nu_cod_regional');
                                    }
                                })
                                .limit(loteLimit).offset(offset)
                                .then(function (regionalList) {
                                    for (var i = 0; i < regionalList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_unidade = 0;
                                        var nu_qtd_lote = 0;
                                        var nu_area_terreno = 0;
                                        var nu_area_total_construida = 0;

                                        unidadeBase = regionalList[i].quadras[primeiro];


                                        regionalList[i].de_regional = unidadeBase.de_regional;
                                        regionalList[i].nu_qtd_quadra = regionalList[i].quadras.length;

                                        for (var l = 0; l < regionalList[i].quadras.length; l++) {
                                            nu_iptu_arrecadado_0 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(regionalList[i].quadras[l].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(regionalList[i].quadras[l].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(regionalList[i].quadras[l].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(regionalList[i].quadras[l].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(regionalList[i].quadras[l].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(regionalList[i].quadras[l].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(regionalList[i].quadras[l].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(regionalList[i].quadras[l].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(regionalList[i].quadras[l].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(regionalList[i].quadras[l].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(regionalList[i].quadras[l].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(regionalList[i].quadras[l].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(regionalList[i].quadras[l].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(regionalList[i].quadras[l].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(regionalList[i].quadras[l].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(regionalList[i].quadras[l].nu_tlp_lancado_6);
                                            nu_qtd_lote += Number(regionalList[i].quadras[l].nu_qtd_lote);
                                            nu_qtd_unidade += Number(regionalList[i].quadras[l].nu_qtd_unidade);
                                            nu_area_terreno += Number(regionalList[i].quadras[l].nu_area_terreno);
                                            nu_area_total_construida += Number(regionalList[i].quadras[l].nu_area_total_construida);
                                        }

                                        regionalList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        regionalList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        regionalList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        regionalList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        regionalList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        regionalList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        regionalList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        regionalList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        regionalList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        regionalList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        regionalList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        regionalList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        regionalList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        regionalList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        regionalList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        regionalList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        regionalList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        regionalList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        regionalList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        regionalList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        regionalList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        regionalList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        regionalList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        regionalList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        regionalList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        regionalList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        regionalList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        regionalList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        regionalList[i].nu_qtd_lote = nu_qtd_lote;
                                        regionalList[i].nu_qtd_unidade = nu_qtd_unidade;
                                        regionalList[i].nu_area_terreno = nu_area_terreno;
                                        regionalList[i].nu_area_total_construida = nu_area_total_construida;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < regionalList.length; i++) {
                                        boundRegionalModel
                                            .query()
                                            .patch(regionalList[i])
                                            .where('de_geocodigo', regionalList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= regionalList.length) {
                                                    offset += regionalList.length;
                                                    var log = logMessageUtil.generateMessage(boundRegionalModel.tableName, offset, boundQuadraModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {

                                var log = logMessageUtil.generateMessage(boundRegionalModel.tableName, n, boundQuadraModel.tableName, handlingStart);
                                console.log(log.de_mensagem);

                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de regional');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateBairro(next) {
    // iptu = processData(iptu);
    boundQuadraModel
        .query()
        .distinct('nu_cod_bairro')
        .then(function (bairroList) {

            for (var i = 0; i < bairroList.length; i++) {
                bairroList[i].de_geocodigo = bairroList[i].nu_cod_bairro;
            }
            knexGeoAuth
                .batchInsert(boundBairroModel.tableName, bairroList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + geocodigos.length + ' Registros salvos em ' + boundBairroModel.tableName;
                    console.log(message);
                    var loteLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundBairroModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('quadras(orderByDeGeocodigo)', {
                                    orderByDeGeocodigo: function (builder) {
                                        builder.orderBy('nu_cod_bairro');
                                    }
                                })
                                .limit(loteLimit).offset(offset)
                                .then(function (bairroList) {
                                    for (var i = 0; i < bairroList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_unidade = 0;
                                        var nu_qtd_lote = 0;
                                        var nu_area_terreno = 0;
                                        var nu_area_total_construida = 0;

                                        unidadeBase = bairroList[i].quadras[primeiro];


                                        bairroList[i].de_bairro = unidadeBase.de_bairro;
                                        bairroList[i].nu_qtd_quadra = bairroList[i].quadras.length;

                                        for (var l = 0; l < bairroList[i].quadras.length; l++) {
                                            nu_iptu_arrecadado_0 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(bairroList[i].quadras[l].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(bairroList[i].quadras[l].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(bairroList[i].quadras[l].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(bairroList[i].quadras[l].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(bairroList[i].quadras[l].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(bairroList[i].quadras[l].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(bairroList[i].quadras[l].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(bairroList[i].quadras[l].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(bairroList[i].quadras[l].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(bairroList[i].quadras[l].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(bairroList[i].quadras[l].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(bairroList[i].quadras[l].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(bairroList[i].quadras[l].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(bairroList[i].quadras[l].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(bairroList[i].quadras[l].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(bairroList[i].quadras[l].nu_tlp_lancado_6);
                                            nu_qtd_lote += Number(bairroList[i].quadras[l].nu_qtd_lote);
                                            nu_qtd_unidade += Number(bairroList[i].quadras[l].nu_qtd_unidade);
                                            nu_area_terreno += Number(bairroList[i].quadras[l].nu_area_terreno);
                                            nu_area_total_construida += Number(bairroList[i].quadras[l].nu_area_total_construida);
                                        }

                                        bairroList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        bairroList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        bairroList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        bairroList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        bairroList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        bairroList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        bairroList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        bairroList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        bairroList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        bairroList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        bairroList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        bairroList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        bairroList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        bairroList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        bairroList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        bairroList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        bairroList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        bairroList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        bairroList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        bairroList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        bairroList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        bairroList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        bairroList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        bairroList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        bairroList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        bairroList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        bairroList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        bairroList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        bairroList[i].nu_qtd_lote = nu_qtd_lote;
                                        bairroList[i].nu_qtd_unidade = nu_qtd_unidade;
                                        bairroList[i].nu_area_terreno = nu_area_terreno;
                                        bairroList[i].nu_area_total_construida = nu_area_total_construida;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < bairroList.length; i++) {
                                        boundBairroModel
                                            .query()
                                            .patch(bairroList[i])
                                            .where('de_geocodigo', bairroList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= bairroList.length) {
                                                    offset += bairroList.length;
                                                    var log = logMessageUtil.generateMessage(boundBairroModel.tableName, offset, boundQuadraModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {

                                var log = logMessageUtil.generateMessage(boundBairroModel.tableName, n, boundQuadraModel.tableName, handlingStart);
                                console.log(log.de_mensagem);


                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de bairro');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateQuadra(next) {
    // iptu = processData(iptu);
    boundLoteModel
        .query()
        .distinct('de_distrito', 'de_setor', 'de_quadra')
        .then(function (loteList) {
            for (var i = 0; i < loteList.length; i++) {
                loteList[i].de_geocodigo = loteList[i].de_distrito + loteList[i].de_setor + loteList[i].de_quadra;
            }
            knexGeoAuth
                .batchInsert(boundQuadraModel.tableName, loteList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + geocodigos.length + ' Registros salvos em ' + boundQuadraModel.tableName;
                    console.log(message);
                    var loteLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundQuadraModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('lotes(orderByDeGeocodigo)', {
                                    orderByDeGeocodigo: function (builder) {
                                        builder.orderBy(['de_distrito', 'de_setor', 'de_quadra']);
                                    }
                                })
                                .limit(loteLimit).offset(offset)
                                .then(function (quadraList) {
                                    for (var i = 0; i < quadraList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_unidade = 0;
                                        var nu_area_terreno = 0;
                                        var nu_area_total_construida = 0;

                                        unidadeBase = quadraList[i].lotes[primeiro];


                                        quadraList[i].de_distrito = unidadeBase.de_distrito;
                                        quadraList[i].de_setor = unidadeBase.de_setor;
                                        quadraList[i].de_quadra = unidadeBase.de_quadra;
                                        quadraList[i].nu_cod_bairro = unidadeBase.nu_cod_bairro;
                                        quadraList[i].de_bairro = unidadeBase.de_bairro;
                                        quadraList[i].de_cod_logradouro = unidadeBase.de_cod_logradouro;
                                        quadraList[i].de_cod_face_de_quadra = unidadeBase.nu_cod_face_de_quadra;
                                        quadraList[i].de_cod_loteamento = unidadeBase.de_cod_loteamento;
                                        quadraList[i].de_loteamento = unidadeBase.de_loteamento;
                                        quadraList[i].de_regional = unidadeBase.de_regional;
                                        // quadraList[i].nu_area_terreno = unidadeBase.nu_area_terreno;
                                        quadraList[i].nu_cod_regional = unidadeBase.nu_cod_regional;
                                        // quadraList[i].nu_area_total_construida = unidadeBase.nu_area_total_construida;
                                        quadraList[i].nu_qtd_lote = quadraList[i].lotes.length;

                                        for (var l = 0; l < quadraList[i].lotes.length; l++) {
                                            nu_iptu_arrecadado_0 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(quadraList[i].lotes[l].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(quadraList[i].lotes[l].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(quadraList[i].lotes[l].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(quadraList[i].lotes[l].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(quadraList[i].lotes[l].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(quadraList[i].lotes[l].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(quadraList[i].lotes[l].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(quadraList[i].lotes[l].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(quadraList[i].lotes[l].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(quadraList[i].lotes[l].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(quadraList[i].lotes[l].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(quadraList[i].lotes[l].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(quadraList[i].lotes[l].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(quadraList[i].lotes[l].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(quadraList[i].lotes[l].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(quadraList[i].lotes[l].nu_tlp_lancado_6);
                                            nu_qtd_unidade += Number(quadraList[i].lotes[l].nu_qtd_unidade);
                                            nu_area_terreno += Number(quadraList[i].lotes[l].nu_area_terreno);
                                            nu_area_total_construida += Number(quadraList[i].lotes[l].nu_area_total_construida);
                                        }

                                        quadraList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        quadraList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        quadraList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        quadraList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        quadraList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        quadraList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        quadraList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        quadraList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        quadraList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        quadraList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        quadraList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        quadraList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        quadraList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        quadraList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        quadraList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        quadraList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        quadraList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        quadraList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        quadraList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        quadraList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        quadraList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        quadraList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        quadraList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        quadraList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        quadraList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        quadraList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        quadraList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        quadraList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        quadraList[i].nu_qtd_unidade = nu_qtd_unidade;
                                        quadraList[i].nu_area_terreno = nu_area_terreno;
                                        quadraList[i].nu_area_total_construida = nu_area_total_construida;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < quadraList.length; i++) {
                                        boundQuadraModel
                                            .query()
                                            .patch(quadraList[i])
                                            .where('de_geocodigo', quadraList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= quadraList.length) {
                                                    offset += quadraList.length;
                                                    var log = logMessageUtil.generateMessage(boundQuadraModel.tableName, offset, boundLoteModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {

                                var log = logMessageUtil.generateMessage(boundQuadraModel.tableName, n, boundLoteModel.tableName, handlingStart);
                                console.log(log.de_mensagem);

                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de quadra');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateLote(next) {
    // iptu = processData(iptu);
    boundIptuMigracaoModel
        .query()
        .distinct('de_geocodigo')
        .where('de_imposto', 'NORMAL')
        .then(function (iptuList) {
            knexGeoAuth
                .batchInsert(boundLoteModel.tableName, iptuList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + 'Inseridos. ' + iptuList.length + ' Registros salvos em tb_lote';
                    console.log(message);
                    var loteLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();

                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundLoteModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('[unidades(orderByDeUnidade),mercantil,itbi]', {
                                    orderByDeUnidade: function (builder) {
                                        builder.orderBy('de_unidade');
                                    }
                                })
                                .limit(loteLimit).offset(offset)
                                .then(function (loteList) {
                                    for (var i = 0; i < loteList.length; i++) {
                                        var naturezaDiferente = false;
                                        var primeiro = 0;
                                        var ultimo = loteList[i].unidades.length - 1;
                                        var unidadeBase;
                                        var nu_iptu_lancado_0 = 0;
                                        var nu_tlp_lancado_0 = 0;
                                        var nu_iptu_lancado_1 = 0;
                                        var nu_tlp_lancado_1 = 0;
                                        var nu_iptu_lancado_2 = 0;
                                        var nu_tlp_lancado_2 = 0;
                                        var nu_iptu_lancado_3 = 0;
                                        var nu_tlp_lancado_3 = 0;
                                        var nu_iptu_lancado_4 = 0;
                                        var nu_tlp_lancado_4 = 0;
                                        var nu_iptu_lancado_5 = 0;
                                        var nu_tlp_lancado_5 = 0;
                                        var nu_iptu_lancado_6 = 0;
                                        var nu_tlp_lancado_6 = 0;
                                        var nu_iptu_arrecadado_0 = 0;
                                        var nu_tlp_arrecadado_0 = 0;
                                        var nu_iptu_arrecadado_1 = 0;
                                        var nu_tlp_arrecadado_1 = 0;
                                        var nu_iptu_arrecadado_2 = 0;
                                        var nu_tlp_arrecadado_2 = 0;
                                        var nu_iptu_arrecadado_3 = 0;
                                        var nu_tlp_arrecadado_3 = 0;
                                        var nu_iptu_arrecadado_4 = 0;
                                        var nu_tlp_arrecadado_4 = 0;
                                        var nu_iptu_arrecadado_5 = 0;
                                        var nu_tlp_arrecadado_5 = 0;
                                        var nu_iptu_arrecadado_6 = 0;
                                        var nu_tlp_arrecadado_6 = 0;
                                        var nu_qtd_utili_religiosa = 0;
                                        var nu_qtd_utili_servico_publico = 0;
                                        var nu_qtd_utili_comercio = 0;
                                        var nu_qtd_utili_residencial = 0;

                                        if (loteList[i].mercantil) {
                                            loteList[i].fl_relacao_iptu_mercantil = true;
                                        } else {
                                            loteList[i].fl_relacao_iptu_mercantil = false;
                                        }

                                        if (loteList[i].itbi) {
                                            loteList[i].nu_qtd_transacao_itbi = loteList[i].itbi.nu_qtd_unidade;
                                        } else {
                                            loteList[i].nu_qtd_transacao_itbi = 0;
                                        }


                                        for (var u = 0; u < loteList[i].unidades.length; u++) {
                                            if (loteList[i].unidades[u].de_natureza !== loteList[i].unidades[primeiro].de_natureza) {
                                                naturezaDiferente = true;
                                            }
                                        }

                                        //Caso a natureza do primeiro for diferente do restante a unidade base será a primeira;
                                        if (!naturezaDiferente) {
                                            unidadeBase = loteList[i].unidades[primeiro];
                                        } else { //Caso contrário será a última
                                            unidadeBase = loteList[i].unidades[ultimo];
                                        }

                                        loteList[i].de_distrito = unidadeBase.de_distrito;
                                        loteList[i].de_setor = unidadeBase.de_setor;
                                        loteList[i].de_quadra = unidadeBase.de_quadra;
                                        loteList[i].de_lote = unidadeBase.de_lote;
                                        loteList[i].de_calcada = unidadeBase.de_calcada;
                                        loteList[i].de_situacao_exercicio_atual = unidadeBase.de_situacao_exercicio_atual;
                                        loteList[i].nu_cod_bairro = unidadeBase.nu_cod_bairro;
                                        loteList[i].de_bairro = unidadeBase.de_bairro;
                                        loteList[i].de_cod_logradouro = unidadeBase.de_cod_logradouro;
                                        loteList[i].de_imposto = unidadeBase.de_imposto;
                                        loteList[i].nu_cod_face_de_quadra = unidadeBase.nu_cod_face_de_quadra;
                                        loteList[i].de_edificio = unidadeBase.de_edificio;
                                        loteList[i].de_cep = unidadeBase.de_cep;
                                        loteList[i].de_padrao_qualidade = unidadeBase.de_padrao_qualidade;
                                        loteList[i].de_cod_loteamento = unidadeBase.de_cod_loteamento;
                                        loteList[i].de_complemento = unidadeBase.de_complemento;
                                        loteList[i].de_limitacao_lote = unidadeBase.de_limitacao_lote;
                                        loteList[i].de_limpeza = unidadeBase.de_limpeza;
                                        loteList[i].de_logradouro = unidadeBase.de_logradouro;
                                        loteList[i].de_loteamento = unidadeBase.de_loteamento;
                                        loteList[i].de_natureza = unidadeBase.de_natureza;
                                        loteList[i].de_numero = unidadeBase.de_numero;
                                        loteList[i].de_pedologia = unidadeBase.de_pedologia;
                                        loteList[i].de_proprietario = unidadeBase.de_proprietario;
                                        loteList[i].de_regional = unidadeBase.de_regional;
                                        loteList[i].de_topografia = unidadeBase.de_topografia;
                                        loteList[i].de_utilizacao = unidadeBase.de_utilizacao;
                                        loteList[i].nu_area_terreno = unidadeBase.nu_area_terreno;
                                        loteList[i].de_cpf_cnpj = unidadeBase.de_cpf_cnpj;
                                        loteList[i].de_inscricao_imobiliaria = unidadeBase.de_inscricao_imobiliaria;
                                        loteList[i].nu_cod_regional = unidadeBase.nu_cod_regional;
                                        loteList[i].nu_sequencial = unidadeBase.nu_sequencial;
                                        loteList[i].nu_area_total_construida = unidadeBase.nu_area_total_construida;
                                        loteList[i].nu_qtd_unidade = loteList[i].unidades.length;

                                        for (var u = 0; u < loteList[i].unidades.length; u++) {
                                            nu_iptu_arrecadado_0 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_0);
                                            nu_iptu_arrecadado_1 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_1);
                                            nu_iptu_arrecadado_2 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_2);
                                            nu_iptu_arrecadado_3 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_3);
                                            nu_iptu_arrecadado_4 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_4);
                                            nu_iptu_arrecadado_5 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_5);
                                            nu_iptu_arrecadado_6 += Number(loteList[i].unidades[u].nu_iptu_arrecadado_6);
                                            nu_iptu_lancado_0 += Number(loteList[i].unidades[u].nu_iptu_lancado_0);
                                            nu_iptu_lancado_1 += Number(loteList[i].unidades[u].nu_iptu_lancado_1);
                                            nu_iptu_lancado_2 += Number(loteList[i].unidades[u].nu_iptu_lancado_2);
                                            nu_iptu_lancado_3 += Number(loteList[i].unidades[u].nu_iptu_lancado_3);
                                            nu_iptu_lancado_4 += Number(loteList[i].unidades[u].nu_iptu_lancado_4);
                                            nu_iptu_lancado_5 += Number(loteList[i].unidades[u].nu_iptu_lancado_5);
                                            nu_iptu_lancado_6 += Number(loteList[i].unidades[u].nu_iptu_lancado_6);
                                            nu_tlp_arrecadado_0 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_0);
                                            nu_tlp_arrecadado_1 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_1);
                                            nu_tlp_arrecadado_2 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_2);
                                            nu_tlp_arrecadado_3 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_3);
                                            nu_tlp_arrecadado_4 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_4);
                                            nu_tlp_arrecadado_5 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_5);
                                            nu_tlp_arrecadado_6 += Number(loteList[i].unidades[u].nu_tlp_arrecadado_6);
                                            nu_tlp_lancado_0 += Number(loteList[i].unidades[u].nu_tlp_lancado_0);
                                            nu_tlp_lancado_1 += Number(loteList[i].unidades[u].nu_tlp_lancado_1);
                                            nu_tlp_lancado_2 += Number(loteList[i].unidades[u].nu_tlp_lancado_2);
                                            nu_tlp_lancado_3 += Number(loteList[i].unidades[u].nu_tlp_lancado_3);
                                            nu_tlp_lancado_4 += Number(loteList[i].unidades[u].nu_tlp_lancado_4);
                                            nu_tlp_lancado_5 += Number(loteList[i].unidades[u].nu_tlp_lancado_5);
                                            nu_tlp_lancado_6 += Number(loteList[i].unidades[u].nu_tlp_lancado_6);

                                            if (loteList[i].unidades[u].de_utilizacao === 'RELIGIOSO') {
                                                nu_qtd_utili_religiosa++;
                                            } else if (loteList[i].unidades[u].de_utilizacao === 'SERVICO PUBLICO') {
                                                nu_qtd_utili_servico_publico++;
                                            } else if (loteList[i].unidades[u].de_utilizacao === 'RESIDENCIA') {
                                                nu_qtd_utili_residencial++;
                                            } else if (loteList[i].unidades[u].de_utilizacao) {
                                                nu_qtd_utili_comercio++;
                                            }

                                        }

                                        loteList[i].nu_iptu_lancado_0 = nu_iptu_lancado_0;
                                        loteList[i].nu_tlp_lancado_0 = nu_tlp_lancado_0;
                                        loteList[i].nu_iptu_lancado_1 = nu_iptu_lancado_1;
                                        loteList[i].nu_tlp_lancado_1 = nu_tlp_lancado_1;
                                        loteList[i].nu_iptu_lancado_2 = nu_iptu_lancado_2;
                                        loteList[i].nu_tlp_lancado_2 = nu_tlp_lancado_2;
                                        loteList[i].nu_iptu_lancado_3 = nu_iptu_lancado_3;
                                        loteList[i].nu_tlp_lancado_3 = nu_tlp_lancado_3;
                                        loteList[i].nu_iptu_lancado_4 = nu_iptu_lancado_4;
                                        loteList[i].nu_tlp_lancado_4 = nu_tlp_lancado_4;
                                        loteList[i].nu_iptu_lancado_5 = nu_iptu_lancado_5;
                                        loteList[i].nu_tlp_lancado_5 = nu_tlp_lancado_5;
                                        loteList[i].nu_iptu_lancado_6 = nu_iptu_lancado_6;
                                        loteList[i].nu_tlp_lancado_6 = nu_tlp_lancado_6;
                                        loteList[i].nu_iptu_arrecadado_0 = nu_iptu_arrecadado_0;
                                        loteList[i].nu_tlp_arrecadado_0 = nu_tlp_arrecadado_0;
                                        loteList[i].nu_iptu_arrecadado_1 = nu_iptu_arrecadado_1;
                                        loteList[i].nu_tlp_arrecadado_1 = nu_tlp_arrecadado_1;
                                        loteList[i].nu_iptu_arrecadado_2 = nu_iptu_arrecadado_2;
                                        loteList[i].nu_tlp_arrecadado_2 = nu_tlp_arrecadado_2;
                                        loteList[i].nu_iptu_arrecadado_3 = nu_iptu_arrecadado_3;
                                        loteList[i].nu_tlp_arrecadado_3 = nu_tlp_arrecadado_3;
                                        loteList[i].nu_iptu_arrecadado_4 = nu_iptu_arrecadado_4;
                                        loteList[i].nu_tlp_arrecadado_4 = nu_tlp_arrecadado_4;
                                        loteList[i].nu_iptu_arrecadado_5 = nu_iptu_arrecadado_5;
                                        loteList[i].nu_tlp_arrecadado_5 = nu_tlp_arrecadado_5;
                                        loteList[i].nu_iptu_arrecadado_6 = nu_iptu_arrecadado_6;
                                        loteList[i].nu_tlp_arrecadado_6 = nu_tlp_arrecadado_6;
                                        loteList[i].nu_qtd_utili_religiosa = nu_qtd_utili_religiosa;
                                        loteList[i].nu_qtd_utili_servico_publico = nu_qtd_utili_servico_publico;
                                        loteList[i].nu_qtd_utili_comercio = nu_qtd_utili_comercio;
                                        loteList[i].nu_qtd_utili_residencial = nu_qtd_utili_residencial;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < loteList.length; i++) {
                                        boundLoteModel
                                            .query()
                                            .patch(loteList[i])
                                            .where('de_geocodigo', loteList[i].de_geocodigo)
                                            .then(function (updated) {
                                                total++;
                                                if (total >= loteList.length) {
                                                    offset += loteList.length;
                                                    var log = logMessageUtil.generateMessage(boundLoteModel.tableName, offset, boundIptuMigracaoModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function (err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {
                                var log = logMessageUtil.generateMessage(boundLoteModel.tableName, n, boundIptuMigracaoModel.tableName, handlingStart);
                                console.log(log.de_mensagem);
                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de iptu');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function generateLoteWithoutImposto(next) {
    // iptu = processData(iptu);
    boundIptuMigracaoModel
        .query()
        .distinct('tb_iptu_mig.de_geocodigo')
        .leftJoin('tb_lote', 'tb_iptu_mig.de_geocodigo', 'tb_lote.de_geocodigo')
        .whereNull('tb_lote.de_geocodigo')
        .andWhere('tb_iptu_mig.de_imposto', '<>', 'NORMAL')
        .then(function (iptuList) {
            for (var i = 0; i < iptuList.length; i++) {
                iptuList[i].de_imposto = 'SEM';
            }


            knexGeoAuth
                .batchInsert(boundLoteModel.tableName, iptuList, 30)
                .returning('de_geocodigo')
                .then(function (geocodigos) {
                    var loteLimit = 1000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var loteOffset = 0;
                    var message = moment().format(momentFormat) + ': ' + 'Inseridos. ' + geocodigos.length + ' Registros sem imposto salvos em tb_lote';
                    console.log(message);


                    async.whilst(
                        function () {
                            return offset < totalOffset;
                        },
                        function (done) {
                            boundLoteModel
                                .query()
                                .orderBy('de_geocodigo')
                                // .debug()
                                .eager('unidades(orderByDeUnidade)', {
                                    orderByDeUnidade: function (builder) {
                                        builder.orderBy('de_unidade');
                                    }
                                })
                                .limit(loteLimit).offset(loteOffset)
                                .then(function (loteList) {
                                    var lotesSemImposto = [];
                                    for (var i = 0; i < loteList.length; i++) {
                                        if (loteList[i].de_imposto === 'SEM') {
                                            var naturezaDiferente = false;
                                            var primeiro = 0;
                                            var ultimo = loteList[i].unidades.length - 1;
                                            var unidadeBase;

                                            for (var u = 0; u < loteList[i].unidades.length; u++) {
                                                if (loteList[i].unidades[u].de_natureza !== loteList[i].unidades[primeiro].de_natureza) {
                                                    naturezaDiferente = true;
                                                }
                                            }

                                            //Caso a natureza do primeiro for diferente do restante a unidade base será a primeira;
                                            if (!naturezaDiferente) {
                                                unidadeBase = loteList[i].unidades[primeiro];
                                            } else { //Caso contrário será a última
                                                unidadeBase = loteList[i].unidades[ultimo];
                                            }

                                            loteList[i].de_distrito = unidadeBase.de_distrito;
                                            loteList[i].de_setor = unidadeBase.de_setor;
                                            loteList[i].de_quadra = unidadeBase.de_quadra;
                                            loteList[i].de_lote = unidadeBase.de_lote;
                                            loteList[i].de_calcada = unidadeBase.de_calcada;
                                            loteList[i].de_situacao_exercicio_atual = unidadeBase.de_situacao_exercicio_atual;
                                            loteList[i].nu_cod_bairro = unidadeBase.nu_cod_bairro;
                                            loteList[i].de_bairro = unidadeBase.de_bairro;
                                            loteList[i].de_cod_logradouro = unidadeBase.de_cod_logradouro;
                                            loteList[i].de_imposto = unidadeBase.de_imposto;
                                            loteList[i].nu_cod_face_de_quadra = unidadeBase.nu_cod_face_de_quadra;
                                            loteList[i].de_edificio = unidadeBase.de_edificio;
                                            loteList[i].de_cep = unidadeBase.de_cep;
                                            loteList[i].de_padrao_qualidade = unidadeBase.de_padrao_qualidade;
                                            loteList[i].de_cod_loteamento = unidadeBase.de_cod_loteamento;
                                            loteList[i].de_complemento = unidadeBase.de_complemento;
                                            loteList[i].de_limitacao_lote = unidadeBase.de_limitacao_lote;
                                            loteList[i].de_limpeza = unidadeBase.de_limpeza;
                                            loteList[i].de_logradouro = unidadeBase.de_logradouro;
                                            loteList[i].de_loteamento = unidadeBase.de_loteamento;
                                            loteList[i].de_natureza = unidadeBase.de_natureza;
                                            loteList[i].de_numero = unidadeBase.de_numero;
                                            loteList[i].de_pedologia = unidadeBase.de_pedologia;
                                            loteList[i].de_regional = unidadeBase.de_regional;
                                            loteList[i].de_topografia = unidadeBase.de_topografia;
                                            loteList[i].de_utilizacao = unidadeBase.de_utilizacao;
                                            loteList[i].nu_area_terreno = unidadeBase.nu_area_terreno;
                                            loteList[i].de_inscricao_imobiliaria = unidadeBase.de_inscricao_imobiliaria;
                                            loteList[i].nu_cod_regional = unidadeBase.nu_cod_regional;
                                            loteList[i].nu_sequencial = unidadeBase.nu_sequencial;
                                            loteList[i].nu_area_total_construida = unidadeBase.nu_area_total_construida;
                                            loteList[i].nu_qtd_unidade = loteList[i].unidades.length;
                                            lotesSemImposto.push(loteList[i]);
                                        }

                                    }
                                    var total = 0;

                                    if (lotesSemImposto.length > 0) {
                                        var loteCount = 0;
                                        async.whilst(
                                            function () {
                                                return lotesSemImposto.length && loteCount < lotesSemImposto.length;
                                            },
                                            function (cb) {
                                                boundLoteModel
                                                    .query()
                                                    .patch(lotesSemImposto[loteCount])
                                                    .where('de_geocodigo', lotesSemImposto[loteCount].de_geocodigo)
                                                    .then(function (updated) {
                                                        total++;
                                                        if (total >= lotesSemImposto.length) {
                                                            // offset += loteList.length;
                                                            var log = logMessageUtil.generateSemImpostoMessage(boundLoteModel.tableName, offset, boundIptuMigracaoModel.tableName);
                                                            if (logLevel === 'completo') {
                                                                saveLog(log);
                                                            }

                                                            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                        }

                                                        loteCount++;
                                                        offset++;
                                                        cb(null, loteCount);
                                                        // --> Updated.
                                                    })
                                                    .catch(function (err) {
                                                        console.log(err.stack);
                                                    });


                                            },
                                            function (err, loteCount) {
                                                // offset += totalLote;
                                                loteOffset += loteList.length;
                                                done(null, loteCount);
                                                // 5 seconds have passed, n = 5
                                            }
                                        );

                                    }

                                })
                                .catch(function (err) {
                                    console.log(err.message);
                                });
                        },
                        function (err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {
                                var log = logMessageUtil.generateSemImpostoMessage(boundLoteModel.tableName, n, boundIptuMigracaoModel.tableName);
                                console.log(log.de_mensagem);
                                //TODO Criar DAO para IptuErro
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function (logDB) { })
                                    .catch(function (err) {
                                        console.log('Erro ao registrar log de iptu');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function (err) {


                    console.log(err.message);
                });


        });

}

function migrate(next) {
    //FAZER MIGRACAO COM O DADO DOS 469 BAIRROS
    //var max = 469;
    var max = 470;
    var count = 1;
    var total = 0;
    var errorList = [];
    async.whilst(
        function () {
            return count <= max;
        },
        function (done) {
            function pad(num, size) {
                var s = "000000000" + num;
                return s.substr(s.length - size);
            }
            var codBairro = pad(count, 3);

            var log = logMessageUtil.pullMigrateByNeighborhoodMessage(boundIptuMigracaoModel.tableName, count);
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            var dbResponse = iptuDAO.fillList('NU_COD_BAIRRO = \'' + codBairro + '\'');
            console.log('NU_COD_BAIRRO = \'' + codBairro + '\'');
            if (!dbResponse.error) {
                var list = dbResponse.result;
                var handlingStart;
                log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundIptuMigracaoModel.tableName, count);
                handlingStart = moment();
                if (logLevel === 'completo') {
                    saveLog(log);
                }
                console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                list = processDatas(list);

                for (var i = 0; i < list.errorList.length; i++) {
                    errorList.push(list.errorList[i]);
                }
                list = list.dataList;
                log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundIptuMigracaoModel.tableName, count, handlingStart, list.length);
                if (logLevel === 'completo') {
                    saveLog(log);
                }
                console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);

                knexGeoAuth
                    .batchInsert(boundIptuMigracaoModel.tableName, list, 30)
                    .returning('id')
                    .then(function (ids) {
                        total = total + ids.length;
                        log = logMessageUtil.migrateMessage(boundIptuMigracaoModel.tableName, ids.length, count);
                        if (logLevel === 'completo') {
                            saveLog(log);
                        }
                        console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                        console.log('\n ============================')
                        count++;
                        done(null, total);
                    })
                    .catch(function (err) {
                        next(err);
                    });

            } else {
                done(new Error('Não foi possível a comunicação com o banco de Integração'));
            }
        },
        function (err, n) {
            if (err) {
                if (next) {
                    next(err, null);
                } else {
                    console.log(err);
                }
            } else {

                var log = logMessageUtil.migrateMessage(boundIptuMigracaoModel.tableName, n);
                console.log(log.de_mensagem);

                //TODO Criar DAO para IptuErro
                boundLogModel
                    .query()
                    .insert(log)
                    .then(function (logDB) {
                        knexGeoAuth
                            .batchInsert(boundErroModel.tableName, errorList, 30)
                            .returning('id')
                            .then(function (ids) {
                                console.log(boundIptuMigracaoModel.tableName, ids.length, boundErroModel.tableName);
                                var erroLog = logMessageUtil.errorMessage(boundIptuMigracaoModel.tableName, ids.length, boundErroModel.tableName);
                                
                                boundLogModel
                                    .query()
                                    .insert(erroLog)
                                    .then(function (errorlogDB) {
                                        
                                        console.log(errorlogDB.de_mensagem);
                                    })
                                    .catch(function (err) {
                                        console.log(err);
                                    });
                            })
                            .catch(function (err) {
                                console.log(err);
                            });
                    })
                    .catch(function (err) {
                        console.log('Erro ao registrar erros log de iptu');
                        console.log(err);
                    });
                if (next) {
                    next(null, n);
                }

            }

        }
    );



}


function processDatas(list) {
    var errorList = [];
    var dataList = [];
    for (var i = 0; i < list.length; i++) {
        list[i] = processData(list[i]);
        dataList.push(list[i].data);
        for (var e = 0; e < list[i].errorList.length; e++) {
            errorList.push(list[i].errorList[e]);
        }
    }
    return {
        dataList: dataList,
        errorList: errorList
    };
}

function processData(data) {
    var errorList = [];
    data = _.mapKeys(data, function (value, key) {
        if (key === 'CODIGO') {
            key = 'NU_CODIGO';
        } else if (key === 'NU_NUMERO') {
            key = 'DE_NUMERO';
        } else if (key === 'NU_COD_LOTEAMENTO') {
            key = 'DE_COD_LOTEAMENTO';
        } else if (key === 'NU_COD_LOGRADOURO') {
            key = 'DE_COD_LOGRADOURO';
        } else if (key === 'DE_COMPLEM') {
            key = 'DE_COMPLEMENTO';
        } else if (key === 'NU_CPF_CNPJ') {
            key = 'DE_CPF_CNPJ';
        } else if (key === 'NU_REGIONAL') {
            key = 'NU_COD_REGIONAL';
        }
        return key.toLowerCase();
    });
    data = _.mapValues(data, function (o, key) {
        if (key.startsWith('nu_') && key !== 'nu_codigo') {
            if (key.startsWith('nu_cpf')) {
                if (o) {
                    return _.trim(o);
                } else {
                    return null;
                }

            } else {
                o = _.replace(o, /\./g, '');
                o = _.replace(o, ',', '.');
            }
            o = Number(o);

        } else if (key === 'de_calcada') {
            if (o) {
                o = o.replace(/ /g, '');
            }
        } else if (key === 'de_cod_logradouro') {
            var output = o;
            o = output;
        } else if (key.startsWith('de_') && key.indexOf('cod') === -1) {
            o = _.trim(o);
            if (o === '') {
                o = null;
            }
        } else if (key.startsWith('fl_')) {
            if (o.toLowerCase() === 'não' || o.toLowerCase() === 'nao') {
                o = false;
            } else if (o.toLowerCase() === 'sim') {
                o = true;
            }
        } else if (key.startsWith('dt_')) {
            if (o) {
                var date = moment(o, 'DD/MM/YYYY');

                if (!date.isValid()) {
                    var message;
                    switch (date.invalidAt()) {
                        case 0:
                            message = "O Ano do campo é invalido";
                            break;
                        case 1:
                            message = "O Mês do campo é invalido";
                            break;
                        case 2:
                            message = "O Dia do campo é invalido";
                            break;
                    }

                    var error = {
                        de_nome_tabela: 'tb_iptu_mig',
                        de_nome_coluna_chave: 'nu_sequencial',
                        nu_valor_coluna_chave: data.nu_sequencial,
                        de_nome_coluna_erro: key,
                        de_valor_coluna_erro: o.toString(),
                        de_tipo: 'Data Inválida',
                        de_mensagem: message,
                        de_criticidade: 'ALTA'
                    }
                    errorList.push(error);
                    o = undefined;
                } else {
                    o = date.toDate();
                }
            } else {
                o = undefined;
            }

        }
        return o;
    });

    var geocodigo_array = _.split(data.de_inscricao_imobiliaria, '.');
    var distrito = "0" + geocodigo_array[0];
    var setor = geocodigo_array[1].slice(2, 4);
    var quadra = geocodigo_array[2];
    var face_quadra = geocodigo_array[3];
    var lote = geocodigo_array[4];
    var unidade = geocodigo_array[5];
    data.de_geocodigo = distrito + setor + quadra + lote;
    data.de_distrito = distrito;
    data.de_setor = setor;
    data.de_quadra = quadra;
    data.de_face_quadra = face_quadra;
    data.de_lote = lote;
    data.de_unidade = unidade;

    data.dt_ultima_atualizacao_mig = new Date().toISOString();
    return {
        data: data,
        errorList: errorList
    };
}

function saveLog(log) {
    boundLogModel
        .query()
        .insert(log)
        .then(function (logDB) {

        });
}
