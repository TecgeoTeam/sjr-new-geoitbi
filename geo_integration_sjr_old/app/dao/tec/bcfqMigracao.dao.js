var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var Knex = require('knex');

var knexConfig = require('./../../../knexfile');

var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);


var BcfqDAO = require('./../../../app/dao/tinus/bcfq.dao');

var bcfqDAO = new BcfqDAO();

var TbFaceDeQuadra = require('../../models/financas/tbFaceDeQuadra.model.js');
var BcfqModel = require('../../models/bcfq.model.js');
var ErroModel = require('../../models/erro.model.js');
var LogModel = require('../../models/log.model.js');


TbFaceDeQuadra.knex(null);
BcfqModel.knex(null);
ErroModel.knex(null);
LogModel.knex(null);

var boundTbFaceDeQuadraModel = TbFaceDeQuadra.bindKnex(knexFinancas);
var boundBcfqModel = BcfqModel.bindKnex(knexGeoAuth);
var boundErroModel = ErroModel.bindKnex(knexGeoAuth);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);
var configModel = require('../../models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);


var logMessageUtil = require('./../../../app/util/logMessage.util');

var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
var logLevel;

var BcfqMigracaoDao = {
    migrate: migrate,
    migrateLatest: migrateLatest,
    fillFinancas: fillFinancas
};

module.exports = BcfqMigracaoDao;


function migrateLatest(next) {
    async.waterfall([
        //remove os dados antigos
        function(callback) {
            boundConfigModel
                .query()
                .first()
                .then(function(row) {
                    var qtdBcfq = bcfqDAO.count()
                    console.log('Quantidade de registros de face de quadra à migrar: ', qtdBcfq);
                    if (qtdBcfq > 0) {
                        var configJson = row.de_config;
                        logLevel = configJson.logLevel;
                        removeAll(callback);
                    } else {
                        callback('A tabela usada para migração está vazia', null);
                    }
                });
        },
        //puxa as unidades da tinus
        function(result, callback) {
            migrate(callback);
        }
    ], function(err, result) {
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

function removeAll(next) {
    async.parallel([
            function(callback) {
                boundTbFaceDeQuadraModel
                    .query()
                    .delete()
                    .then(function(numberOfDeletedRows) {
                        console.log("Limpeza da base de face de quadra para migração");
                        callback(null, [numberOfDeletedRows, boundTbFaceDeQuadraModel]);
                    });
            },
            function(callback) {
                boundBcfqModel
                    .query()
                    .delete()
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundBcfqModel]);
                    });
            },
            function(callback) {
                boundErroModel
                    .query()
                    .delete()
                    .whereIn('de_nome_tabela', [boundTbFaceDeQuadraModel.tableName, boundBcfqModel.tableName])
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundErroModel]);
                    });
            }
        ],
        // optional callback
        function(err, results) {
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
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de bcfq');
                    });
                if (next) {
                    next(null, results);
                }

            }
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });

}

function migrate(next) {

    var max = 1
    var count = 1;
    var total = 0;
    var errorList = [];
    async.whilst(
        function() {
            return count <= max;
        },
        function(done) {
            function pad(num, size) {
                var s = "000000000" + num;
                return s.substr(s.length - size);
            }
            var codBairro = pad(count, 3);

            var log = logMessageUtil.pullMigrateByNeighborhoodMessage(boundBcfqModel.tableName, count);
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            var dbResponse;
            dbResponse = bcfqDAO.fillList();
            if (!dbResponse.error) {
                var list = dbResponse.result;
                var handlingStart;
                log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundBcfqModel.tableName, count);
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
                log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundBcfqModel.tableName, count, handlingStart, list.length);
                if (logLevel === 'completo') {
                    saveLog(log);
                }
                console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                knexGeoAuth
                    .batchInsert(boundBcfqModel.tableName, list, 30)
                    .returning('id')
                    .then(function(ids) {
                        total = total + ids.length;
                        log = logMessageUtil.migrateMessage(boundBcfqModel.tableName, ids.length, count);
                        if (logLevel === 'completo') {
                            saveLog(log);
                        }
                        console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                        console.log('\n ============================')
                        count++;
                        done(null, total);
                    })
                    .catch(function(err) {
                        done(err);
                    });
            }


        },
        function(err, n) {
            if (err) {
                if (next) {
                    next(err, null);
                } else {
                    console.log(err);
                }
            } else {

                var log = logMessageUtil.migrateMessage(boundBcfqModel.tableName, n);
                console.log(log.de_mensagem);

                boundLogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {
                        knexGeoAuth
                            .batchInsert(boundErroModel.tableName, errorList, 30)
                            .returning('id')
                            .then(function(ids) {
                                var erroLog = logMessageUtil.errorMessage(boundBcfqModel.tableName, ids.length, boundErroModel.tableName);
                                boundLogModel
                                    .query()
                                    .insert(erroLog)
                                    .then(function(errorlogDB) {
                                        console.log(errorlogDB.de_mensagem);
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                    });
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                        if (next) {
                            next(null, n);
                        }


                    })
                    .catch(function(err) {
                        console.log('Erro ao registrar log de bcfq');
                    });
            }

        }
    );

}

function fillFinancas(next) {
    async.parallel([
            function(callback) {

                updateTableFinancas(boundTbFaceDeQuadraModel, boundBcfqModel, 'de_dsqf', 'de_geocodigo', callback);

            }
        ],
        // optional callback
        function(err, results) {
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
                    logs.push(logMessageUtil.updateMessage(results[i][1].tableName, results[i][0]));
                    if (results[i][2]) {
                        logs.push(logMessageUtil.notFoundMessage(results[i][1].tableName, results[i][2]));
                    }
                }
                for (var i = 0; i < logs.length; i++) {
                    console.log(logs[i].de_mensagem);
                }

                //TODO Criar DAO para IptuErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de atualização de lotes em Financas');
                    });
                if (next) {
                    next(null, results);
                }

            }
            // the results array will equal ['one','two'] even though
            // the second function had a shorter timeout.
        });
}

function updateTableFinancas(boundObjectFinancasModel, boundObjectModel, idColumnNameFinancas, idColumnNameMigracao, next) {
    if (!idColumnNameMigracao) {
        idColumnNameMigracao = 'de_geocodigo';
    }
    boundObjectFinancasModel
        .query()
        .delete()
        .then(function(objectFinancasList) {
            var loteLimit = 100000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
            var max = 0;
            var firstTime = true;
            async.whilst(
                function() {
                    //return !wereAllInserted;
                    return count <= max;
                },
                function(done) {
                    boundObjectModel
                        .query()
                        .limit(loteLimit).offset(offset)
                        .then(function(selectRow) {
                            var selectRows = Object.values(selectRow);
                            console.log("TRABALHANDO NO DE-PARA DA FACE DE QUADRA");
                            function pad(num, size) {
                                var s = "000000000" + num;
                                return s.substr(s.length - size);
                            }
                            
                            //DE-PARA BCFQ
                                for (var i = 0; i < selectRows.length; i++) {
                                    selectRows[i].objectid = offset + i + 1;
                                    selectRows[i].de_cod_logradouro = pad(selectRows[i].de_cod_logradouro, 7);
                                    selectRows[i] = _.mapKeys(selectRows[i], function(value, key) {
                                        if (key === 'objectid') {
                                            return 'OBJECTID';
                                        }
                                        if (key === 'id') {
                                            return 'de_n_id_face';
                                        }
                                        if (key === 'fl_arborizacao') {
                                            return 'de_arborizacao';
                                        }
                                        if (key === 'nu_cod_bairro') {
                                            return 'DE_COD_BAIRRO';
                                        }
                                        if (key === 'de_bairro') {
                                            return 'de_bairro';
                                        }
                                        if (key === 'de_cep') {
                                            return 'de_cep';
                                        }
                                        if (key === 'nu_cod_face_de_quadra') {
                                            return 'de_n_face';
                                        }
                                        if (key === 'fl_coleta_lixo') {
                                            return 'de_coleta_de_lixo';
                                        }
                                        if (key === 'fl_emplacamento') {
                                            return 'de_emplacamento';
                                        }
                                        if (key === 'fl_galerias_pluviais') {
                                            return 'de_drenagem';
                                        }
                                        if (key === 'fl_guias_sarjetas') {
                                            return 'de_meio_fio';
                                        }
                                        if (key === 'de_iluminacao_publica') {
                                            return 'de_iluminacao';
                                        }
                                        if (key === 'fl_limpeza_urbana') {
                                            return 'de_limpeza_publica';
                                        }
                                        if (key === 'de_cod_logradouro') {
                                            return 'de_n_CODLOG';
                                        }
                                        if (key === 'fl_rede_agua') {
                                            return 'de_agua';
                                        }
                                        if (key === 'fl_rede_eletrica') {
                                            return 'de_rede_eletrica';
                                        }
                                        if (key === 'fl_rede_eletrica') {
                                            return 'de_rede_eletrica';
                                        }
                                        if (key === 'fl_rede_esgoto') {
                                            return 'de_esgoto';
                                        }
                                        if (key === 'fl_rede_telefone') {
                                            return 'de_rede_telefonica';
                                        }
                                        if (key === 'nu_v0') {
                                            return 'de_v0';
                                        }
                                        if (key === 'de_zoneamento') {
                                            return 'de_face_v01';
                                        }
                                        if (key === 'de_pavimentacao') {
                                            return 'de_pavimentacao';
                                        }
                                        return key
                                    });

                                    delete selectRows[i].de_face_quadra;
                                    delete selectRows[i].de_logradouro;
                                    delete selectRows[i].nu_cod_regional;
                                    delete selectRows[i].dt_ultima_atualizacao_mig;
                                }
                            
                            
                        if (firstTime){
                            firstTime = false;
                            knexFinancas
                            .batchInsert(boundObjectFinancasModel.tableName, selectRows, 30)
                                .returning('de_n_id_face')
                                .then(function(numberOfAffectedRows) {
                                    if (count > 0 && count % 1000 === 0) {
                                        console.log(moment().format(momentFormat) + ': ' + 'Atualizado de ' + count + ' de ' + objectFinancasList.length + ' Em:' + boundObjectFinancasModel.tableName);
                                    }
                                    count++;

                                    done(null, count, boundObjectFinancasModel);
                                }).catch(function(err) {
                                    console.log(err);
                                    done(err, null);

                                });
                            }
                        })
                        .catch(function(err) {
                            done(err);
                        });
                },
                function(err, totalInserted, boundObjectFinancasModel) {
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

/**
 * Trata os valores e nomes das colunas vindo do banco da Tinnus
 * @param  json data Dados vindo da Tinnus
 * @return {[type]}      [description]
 */
function processData(data) {
    var errorList = [];
    data = _.mapKeys(data, function(value, key) {
        if (key === 'CODIGO') {
            key = 'NU_COD_FACE_DE_QUADRA';
        } else if (key === 'NU_CODIGO_BAIRRO') {
            key = 'NU_COD_BAIRRO';
        } else if (key === 'DE_NOME_BAIRRO') {
            key = 'DE_BAIRRO';
        } else if (key === 'NU_CODIGO_LOGRADOURO') {
            key = 'DE_COD_LOGRADOURO';
        } else if (key === 'DE_LOGRADOURO_NOME') {
            key = 'DE_LOGRADOURO';
        } else if (key === 'NU_FACE_QUADRA') {
            key = 'DE_FACE_QUADRA';
        } else if (key === 'NU_REGIONAL') {
            key = 'NU_COD_REGIONAL';
        } else if (key === 'NU_VO') {
            key = 'NU_V0';
        } else if (key === 'FL_PAVIMENTACAO') {
            key = 'DE_PAVIMENTACAO';
        }
        return key.toLowerCase();
    });
    data = _.mapValues(data, function(o, key) {
        if (key.startsWith('nu_') && key !== 'nu_cod_face_de_quadra' && key !== 'nu_sequencial') {
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
            if (isNaN(o)) {
                console.log(key + ': ' + o);
            }
            o = Number(o);

        } else if (key === 'de_calcada') {
            o = o.replace(/ /g, '');
        }else if (key === 'de_cod_logradouro') {
            var output = [o.slice(0, o.length-1), '-', o.slice(o.length-1)].join('');
            o = output;
        } else if (key.startsWith('de_') && key.indexOf('cod') === -1) {
            o = _.trim(o);
            if (!o) {
                o = null;
            }
        } else if (key.startsWith('fl_')) {
            // if (o) {

            //     if (o.toLowerCase() === 'n') {
            //         o = false;
            //     } else if (o.toLowerCase() === 's') {
            //         o = true;
            //     } else if (o.toLowerCase() === 'não' || o.toLowerCase() === 'nao' || o.toLowerCase() === 'sem') {
            //         o = false;
            //     } else if (o.toLowerCase() === 'sim' || o.toLowerCase() === 'com') {
            //         o = true;
            //     }



            // }

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
                        de_nome_tabela: 'tb_bcfq_mig',
                        de_nome_coluna_chave: 'nu_processo',
                        nu_valor_coluna_chave: data.nu_processo,
                        de_nome_coluna_erro: key,
                        de_valor_coluna_erro: o.toString(),
                        de_tipo: 'Data Inválida',
                        de_mensagem: message,
                        de_criticidade: 'ALTA',
                        dt_criacao: new Date().toISOString()
                    }
                    errorList.push(error);
                    //TODO Criar DAO para BcfqErro
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
    if (!data.nu_cod_bairro) {
        var errorSequencial = {
            de_nome_tabela: 'tb_bcfq_mig',
            de_nome_coluna_chave: 'nu_processo',
            nu_valor_coluna_chave: data.nu_processo,
            de_nome_coluna_erro: 'nu_sequencial',
            de_valor_coluna_erro: data.nu_sequencial,
            de_tipo: 'Dados Sem Relacionamento',
            de_mensagem: 'nu_sequencial ' + data.nu_sequencial + ' não existe na tabela de IPTUs',
            de_criticidade: 'ALTA',
            dt_criacao: new Date().toISOString()
        }
        errorList.push(errorSequencial);

    }
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
        .then(function(logDB) {

        });
}
