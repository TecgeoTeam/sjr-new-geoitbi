var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var Knex = require('knex');

var knexConfig = require('./../../../knexfile');

var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);

var ItbiDAO = require('./../../../app/dao/tinus/itbi.dao');

var itbiDAO = new ItbiDAO();

var ErroModel = require('../../models/erro.model.js');
var ItbiMigracaoModel = require('../../models/itbiMigracao.model.js');
var ItbiModel = require('../../models/itbi.model.js');
var LogModel = require('../../models/log.model.js');
var LoteItbiFinancasModel = require('../../models/financas/loteItbiFinancas.model.js');
var UnidadeItbiFinancasModel = require('../../models/financas/unidadeItbiFinancas.model.js');
var UnidadeItbiModel = require('../../models/unidadeItbi.model.js');

ErroModel.knex(null);
ItbiMigracaoModel.knex(null);
ItbiModel.knex(null);
LogModel.knex(null);
LoteItbiFinancasModel.knex(null);
UnidadeItbiFinancasModel.knex(null);
UnidadeItbiModel.knex(null);

var boundErroModel = ErroModel.bindKnex(knexGeoAuth);
var boundItbiMigracaoModel = ItbiMigracaoModel.bindKnex(knexGeoAuth);
var boundItbiModel = ItbiModel.bindKnex(knexGeoAuth);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);
var boundLoteItbiFinancasModel = LoteItbiFinancasModel.bindKnex(knexFinancas);
var boundUnidadeItbiFinancasModel = UnidadeItbiFinancasModel.bindKnex(knexFinancas);
var boundUnidadeItbiModel = UnidadeItbiModel.bindKnex(knexGeoAuth);
var configModel = require('../../models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);


var logMessageUtil = require('./../../../app/util/logMessage.util');

var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
var logLevel;

var ItbiMigracaoDao = {
    migrate: migrate,
    migrateLatest: migrateLatest,
    generateItbi: generateItbi,
    fillFinancas: fillFinancas
};

module.exports = ItbiMigracaoDao;

function insert(itbi) {
    if (itbi) {
        // itbi = processData(itbi);
        boundItbiMigracaoModel
            .query()
            .insert(itbi)
            .then(function(itbiInserido) {
                // console.log(itbiInserido.id);
            })
            .catch(function(err) {
                console.log(err.message);
                console.log(itbi);
            });
    }
}

function select(firstCondition, value) {
    // itbi = processData(itbi);
    boundItbiMigracaoModel
        .query()
        .where(firstCondition, value)
        .debug()
        .then(function(itbiList) {
            console.log(itbiList);
        })
        .catch(function(err) {


            console.log(err.message);
        });
}

function migrateLatest(next) {
    async.waterfall([
        //remove os dados antigos
        function(callback) {
            boundConfigModel
                .query()
                .first()
                .then(function(row) {
                    var qtdItbi = itbiDAO.count()
                    if (qtdItbi > 0) {
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
        },
        //através da unidade gera os lotes
        function(result, callback) {
            generateUnidade(callback);
        },
        //através da unidade gera os lotes
        function(result, callback) {
            generateItbi(callback);
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
                boundItbiMigracaoModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundItbiMigracaoModel]);
                    });
            },
            function(callback) {
                boundUnidadeItbiModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundUnidadeItbiModel]);
                    });
            },
            function(callback) {
                boundItbiModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundItbiModel]);
                    });
            },
            function(callback) {
                boundErroModel
                    .query()
                    .delete()
                    .whereIn('de_nome_tabela', [boundItbiMigracaoModel.tableName, boundItbiMigracaoModel.tableName])
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
                //TODO Criar DAO para ItbiErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de itbi');
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

    var max = 31
    var count = 0;
    var total = 0;
    var errorList = [];
    var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
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

            var log = logMessageUtil.pullMigrateByNeighborhoodMessage(boundItbiMigracaoModel.tableName, count);
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            var list;
            if (count === 0) {
                list = itbiDAO.fillList('NU_COD_BAIRRO IS NULL', 'TecGeo.IMOBILIARIO', 'NU_SEQUENCIAL');
            } else {
                list = itbiDAO.fillList('NU_COD_BAIRRO = \'' + codBairro + '\'', 'TecGeo.IMOBILIARIO', 'NU_SEQUENCIAL');
            }
            var handlingStart;
            log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundItbiMigracaoModel.tableName, count);
            handlingStart = moment();
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            list = processDatas(list);
            console.log(moment().format(momentFormat) + ': ' + 'Erros encontrados no bairro ' + codBairro + ': ' + list.errorList.length);
            for (var i = 0; i < list.errorList.length; i++) {
                errorList.push(list.errorList[i]);
            }
            list = list.dataList;
            log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundItbiMigracaoModel.tableName, count, handlingStart, list.length);
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            knexGeoAuth
                .batchInsert(boundItbiMigracaoModel.tableName, list, 30)
                .returning('id')
                .then(function(ids) {
                    total = total + ids.length;
                    log = logMessageUtil.migrateMessage(boundItbiMigracaoModel.tableName, ids.length, count);
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

        },
        function(err, n) {
            if (err) {
                if (next) {
                    next(err, null);
                } else {
                    console.log(err);
                }
            } else {
                var log = logMessageUtil.migrateMessage(boundItbiMigracaoModel.tableName, n);
                console.log(log.de_mensagem);
                //TODO Criar DAO para ItbiErro
                boundLogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {
                        knexGeoAuth
                            .batchInsert(boundErroModel.tableName, errorList, 30)
                            .returning('id')
                            .then(function(ids) {
                                var erroLog = logMessageUtil.errorMessage(boundItbiMigracaoModel.tableName, ids.length, boundErroModel.tableName);
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
                        console.log('Erro ao registrar log de itbi');
                    });
            }

        }
    );



}

function generateUnidade(next) {
    // itbi = processData(itbi);
    boundItbiMigracaoModel
        .query()
        .select(['tb_iptu_mig.de_geocodigo', 'tb_iptu_mig.de_inscricao_imobiliaria', 'tb_iptu_mig.de_distrito', 'tb_iptu_mig.de_setor', 'tb_iptu_mig.de_quadra', 'tb_iptu_mig.de_lote', 'tb_iptu_mig.de_unidade', 'tb_itbi_mig.*'])
        .leftJoin('tb_iptu_mig', 'tb_iptu_mig.nu_sequencial', 'tb_itbi_mig.nu_sequencial')
        .then(function(unidadeItbiList) {

            for (var i = 0; i < unidadeItbiList.length; i++) {
                delete unidadeItbiList[i].id;
            }

            knexGeoAuth
                .batchInsert(boundUnidadeItbiModel.tableName, unidadeItbiList, 30)
                .returning('nu_codigo')
                .then(function(ids) {
                    var log = logMessageUtil.generateMessage(boundUnidadeItbiModel.tableName, ids.length, boundItbiMigracaoModel.tableName);
                    console.log(log.de_mensagem);
                    boundLogModel
                        .query()
                        .insert(log)
                        .then(function(logDB) {})
                        .catch(function(err) {
                            console.log('Erro ao registrar log de distritos');
                        });

                    if (next) {
                        next(null, ids);
                    }



                })
                .catch(function(err) {
                    console.log(err.message);
                    next(err, null);
                });


        });
}

function generateItbi(next) {
    boundUnidadeItbiModel
        .query()
        .distinct('de_geocodigo')
        .whereNotNull('de_geocodigo')
        .then(function(unidadeItbiList) {
            console.log(unidadeItbiList.length);
            knexGeoAuth
                .batchInsert(boundItbiModel.tableName, unidadeItbiList, 30)
                .returning('de_geocodigo')
                .then(function(geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + 'Inseridos. ' + unidadeItbiList.length + ' Registros salvos em ' + boundItbiModel.tableName;
                    console.log(message);
                    var itbiLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function() {
                            return offset < totalOffset;
                        },
                        function(done) {
                            boundItbiModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('unidadesItbi(orderByDeUnidade)', {
                                    orderByDeUnidade: function(builder) {
                                        builder.orderBy('de_unidade');
                                    }
                                })
                                .limit(itbiLimit).offset(offset)
                                .then(function(itbiList) {
                                    for (var i = 0; i < itbiList.length; i++) {
                                        var ultimo = itbiList[i].unidadesItbi.length - 1;
                                        var unidadeBase;
                                        var nu_valor_avaliacao = 0;
                                        var nu_valor_operacao = 0;
                                        var nu_valor_financiado = 0;

                                        unidadeBase = itbiList[i].unidadesItbi[ultimo];

                                        itbiList[i].nu_codigo = unidadeBase.nu_codigo;
                                        itbiList[i].nu_sequencial = unidadeBase.nu_sequencial;
                                        itbiList[i].de_situacao = unidadeBase.de_situacao;
                                        itbiList[i].de_inscricao_imobiliaria = unidadeBase.de_inscricao_imobiliaria;
                                        itbiList[i].de_distrito = unidadeBase.de_distrito;
                                        itbiList[i].de_setor = unidadeBase.de_setor;
                                        itbiList[i].de_quadra = unidadeBase.de_quadra;
                                        itbiList[i].de_lote = unidadeBase.de_lote;
                                        itbiList[i].de_dt_data_avaliacao = unidadeBase.de_dt_data_avaliacao;
                                        itbiList[i].de_dt_data_negociacao = unidadeBase.de_dt_data_negociacao;
                                        itbiList[i].de_moeda = unidadeBase.de_moeda;
                                        itbiList[i].nu_processo = unidadeBase.nu_processo;
                                        itbiList[i].de_processo_inclusao = unidadeBase.de_processo_inclusao;
                                        itbiList[i].nu_qtd_unidade = itbiList[i].unidadesItbi.length;

                                        for (var u = 0; u < itbiList[i].unidadesItbi.length; u++) {
                                            nu_valor_avaliacao += Number(itbiList[i].unidadesItbi[u].nu_valor_avaliacao);
                                            nu_valor_operacao += Number(itbiList[i].unidadesItbi[u].nu_valor_operacao);
                                            nu_valor_financiado += Number(itbiList[i].unidadesItbi[u].nu_valor_financiado);
                                        }

                                        itbiList[i].nu_valor_avaliacao = nu_valor_avaliacao;
                                        itbiList[i].nu_valor_operacao = nu_valor_operacao;
                                        itbiList[i].nu_valor_financiado = nu_valor_financiado;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < itbiList.length; i++) {
                                        boundItbiModel
                                            .query()
                                            .patch(itbiList[i])
                                            .where('de_geocodigo', itbiList[i].de_geocodigo)
                                            .then(function(updated) {
                                                total++;
                                                if (total >= itbiList.length) {
                                                    offset += itbiList.length;
                                                    var log = logMessageUtil.generateMessage(boundItbiModel.tableName, offset, boundUnidadeItbiModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                                                    console.log(moment().format(momentFormat) + ': ' + 'Alterado ' + offset + ' de ' + totalOffset + ' em ' + boundItbiModel.tableName);
                                                    done(null, offset);
                                                }
                                                // --> Updated.
                                            })
                                            .catch(function(err) {
                                                console.log(err.stack);
                                            });
                                    }


                                })
                                .catch(function(err) {
                                    console.log(err.message);
                                });
                        },
                        function(err, n) {
                            if (err) {
                                if (next) {
                                    next(err, null);
                                } else {
                                    console.log(err);
                                }
                            } else {

                                var log = logMessageUtil.generateMessage(boundItbiModel.tableName, n, boundUnidadeItbiModel.tableName);
                                console.log(log.de_mensagem);

                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function(logDB) {})
                                    .catch(function(err) {
                                        console.log('Erro ao registrar log de itbi');
                                    });
                                if (next) {
                                    next(null, n);
                                }
                            }

                        }
                    );



                })
                .catch(function(err) {


                    console.log(err.message);
                });


        });

}

function fillFinancas(next) {
    async.parallel([
            function(callback) {
                //preenche lotes do banco financas
                // fillLoteFinancas(callback);
                fillTableFinancas(boundUnidadeItbiFinancasModel, boundUnidadeItbiModel, callback);

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

                //TODO Criar DAO para ItbiErro
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

function fillTableFinancas(boundObjectFinancasModel, boundObjectModel, next) {
    boundObjectFinancasModel
        .query()
        .delete()
        .then(function(deletedRows) {
            var loteLimit = 10000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            async.whilst(
                function() {
                    return !wereAllInserted;
                },
                function(done) {
                    boundObjectModel
                        .query()
                        .orderBy('de_geocodigo')
                        .limit(loteLimit).offset(offset)
                        .then(function(list) {
                            for (var i = 0; i < list.length; i++) {
                                list[i].objectid = offset + i + 1;
                                list[i] = _.mapKeys(list[i], function(value, key) {
                                    if (key === 'fl_reducao_aliquota') {
                                        return 'fl_reducao_alíquota';
                                    }
                                    return key
                                });
                                list[i] = _.mapValues(list[i], function(o, key) {
                                    if (key.startsWith('fl_')) {
                                        if (o === true) {
                                            o = 'Sim';
                                        } else if (o === false) {
                                            o = 'Não';
                                        }
                                    }
                                    return o;
                                });

                                // list[i].de_atividade_tll = list[i].de_atividade + ' - ' + list[i].de_atividade_tll;
                                // delete list[i].dt_ultima_atualizacao_mig;
                                // delete list[i].id;
                                delete list[i].nu_inscricao;
                                // delete list[i].de_atividade;
                                // delete list[i].de_regime_horario_especial;
                                // delete list[i].de_regime_iss;
                                // delete list[i].de_regime_maquinas_afins;
                                // delete list[i].de_regime_ocupacao_area_public;
                                // delete list[i].de_regime_publicidade;
                                // delete list[i].de_regime_tlf;
                                // delete list[i].nu_quantidade_fornos;
                                // delete list[i].nu_quantidade_guindastes;
                                // delete list[i].nu_quantidade_maquinas;
                                // delete list[i].nu_quantidade_motores;

                            }

                            knexFinancas
                                .batchInsert(boundObjectFinancasModel.tableName, list, 30)
                                .returning('de_geocodigo')
                                .then(function(ids) {
                                    if (ids.length === 0) {
                                        wereAllInserted = true;
                                    } else {
                                        offset += ids.length;
                                        console.log(moment().format(momentFormat) + ': ' + 'Alterado ' + ids.length + ' registros. Total de ' + offset + ' alterado até o momento em ' + boundObjectFinancasModel.tableName);
                                    }
                                    done(null, offset, boundObjectFinancasModel);
                                })
                                .catch(function(err) {
                                    done(err, null);

                                });


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

function updateTableFinancas(boundObjectFinancasModel, boundObjectModel, idColumnNameFinancas, idColumnNameMigracao, next) {
    if (!idColumnNameMigracao) {
        idColumnNameMigracao = 'de_geocodigo';
    }
    boundObjectFinancasModel
        .query()
        .orderBy(idColumnNameFinancas)
        .then(function(objectFinancasList) {
            for (var i = 0; i < objectFinancasList.length; i++) {
                if (objectFinancasList[i].nu_inscricao_mercantil) {
                    objectFinancasList[i].nu_inscricao_mercantil = objectFinancasList[i].nu_inscricao_mercantil.replace(".", "");
                    // objectFinancasList[i].nu_inscricao.toString().substring(0,objectFinancasList[i].nu_inscricao.toString().length-1)+'.'+objectFinancasList[i].nu_inscricao.toString().substring(objectFinancasList[i].nu_inscricao.toString().length-1,objectFinancasList[i].nu_inscricao.toString().length);
                }
            }
            var loteLimit = 10000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
            var updatedCount = 0;
            var notFoundCount = 0;
            async.whilst(
                function() {
                    return count < objectFinancasList.length;
                },
                function(done) {
                    boundObjectModel
                        .query()
                        .orderBy(idColumnNameMigracao)
                        .where(idColumnNameMigracao, objectFinancasList[count][idColumnNameFinancas])
                        .first()
                        .then(function(selectRow) {
                            if (objectFinancasList[count].nu_inscricao_mercantil) {
                                objectFinancasList[count].nu_inscricao_mercantil = objectFinancasList[count].nu_inscricao_mercantil.toString().substring(0, objectFinancasList[count].nu_inscricao_mercantil.toString().length - 1) + '.' + objectFinancasList[count].nu_inscricao_mercantil.toString().substring(objectFinancasList[count].nu_inscricao_mercantil.toString().length - 1, objectFinancasList[count].nu_inscricao_mercantil.toString().length);
                            }
                            if (selectRow) {

                                selectRow = _.mapKeys(selectRow, function(value, key) {
                                    if (key === 'fl_reducao_aliquota') {
                                        return 'fl_reducao_alíquota';
                                    }
                                    if (key === 'nu_qtd_unidade') {
                                        return 'de_qtd_unidade';
                                    }
                                    if (key === 'de_cpf_cnpj') {
                                        return 'nu_cpf_cnpj';
                                    }
                                    if (key === 'nu_inscricao') {
                                        return 'nu_inscricao_mercantil';
                                    }
                                    return key
                                });
                                selectRow = _.mapValues(selectRow, function(o, key) {
                                    if (key.startsWith('fl_')) {
                                        if (o === true) {
                                            o = 'Sim';
                                        } else if (o === false) {
                                            o = 'Não';
                                        }
                                    }
                                    return o;
                                });
                                selectRow.de_atividade_tll = selectRow.de_atividade + ' - ' + selectRow.de_atividade_tll;
                                selectRow.localizado = 'Sim';
                                delete selectRow.dt_ultima_atualizacao_mig;
                                delete selectRow.id;
                                delete selectRow.nu_codigo;
                                selectRow.de_localizado = 'Sim';
                                if (selectRow.nu_inscricao_mercantil) {
                                    selectRow.nu_inscricao_mercantil = selectRow.nu_inscricao_mercantil.toString().substring(0, selectRow.nu_inscricao_mercantil.toString().length - 1) + '.' + selectRow.nu_inscricao_mercantil.toString().substring(selectRow.nu_inscricao_mercantil.toString().length - 1, selectRow.nu_inscricao_mercantil.toString().length);
                                }
                                updatedCount++;
                            } else {
                                selectRow = {};
                                selectRow.de_localizado = 'Não';
                                selectRow.de_inscricao_imobiliaria = null;
                                selectRow.de_distrito = null;
                                selectRow.de_setor = null;
                                selectRow.de_quadra = null;
                                selectRow.de_lote = null;
                                selectRow.de_unidade = null;
                                selectRow.de_denominacao = null;
                                selectRow.de_nome_fantasia = null;
                                selectRow.fl_local_ignorado = null;
                                selectRow.de_situacao = null;
                                selectRow.de_cpf_cnpj = null;
                                selectRow.de_endereco = null;
                                selectRow.de_atividade_tll = null;
                                selectRow.fl_licenciado = null;
                                selectRow.de_anuncios_letreiros = null;
                                selectRow.dt_data_cadastro = null;
                                selectRow.fl_sociedade_profissional = null;
                                selectRow.de_tipo_atividade = null;
                                selectRow.fl_incentivo_fiscal = null;
                                selectRow.de_incentivo_base_legal = null;
                                selectRow.de_incentivo_vigencia = null;
                                selectRow["fl_reducao_alíquota"] = null;
                                selectRow.de_reducao_base_legal = null;
                                selectRow.de_regime_iss = null;
                                notFoundCount++;
                            }
                            boundObjectFinancasModel
                                .query()
                                .update(selectRow)
                                .where(idColumnNameFinancas, objectFinancasList[count][idColumnNameFinancas])
                                .then(function(numberOfAffectedRows) {
                                    if (count > 0 && count % 1000 === 0) {
                                        console.log(moment().format(momentFormat) + ': ' + 'Atualizado de ' + count + ' de ' + objectFinancasList.length + ' Em:' + boundObjectFinancasModel.tableName);
                                    }
                                    count++;

                                    done(null, updatedCount, boundObjectFinancasModel, notFoundCount);
                                }).catch(function(err) {
                                    console.log(err);
                                    done(err, null);

                                });

                        })
                        .catch(function(err) {
                            done(err);
                        });
                },
                function(err, totalInserted, boundObjectFinancasModel, notFoundCount) {
                    if (err) {
                        if (next) {
                            next(err, null);
                        } else {
                            console.log(err);
                        }
                    } else {

                        if (next) {
                            next(null, [totalInserted, boundObjectFinancasModel, notFoundCount]);
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

function processData(data) {
    var errorList = [];
    data = _.mapKeys(data, function(value, key) {
        if (key === 'CODIGO') {
            key = 'NU_CODIGO';
        } else if (key === 'NU_NUMERO') {
            key = 'DE_NUMERO';
        } else if (key === 'NU_COD_LOTEAMENTO') {
            key = 'DE_COD_LOTEAMENTO';
        } else if (key === 'DE_COMPLEM') {
            key = 'DE_COMPLEMENTO';
        } else if (key === 'NU_PROCESSO_INCLUSAO') {
            key = 'DE_PROCESSO_INCLUSAO';
        }
        return key.toLowerCase();
    });
    data = _.mapValues(data, function(o, key) {
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
            if (isNaN(o)) {
                console.log(key + ': ' + o);
            }
            o = Number(o);

        } else if (key === 'de_calcada') {
            o = o.replace(/ /g, '');
        } else if (key.startsWith('de_') && key.indexOf('cod') === -1) {
            o = _.trim(o);
            if (!o) {
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
                        de_nome_tabela: 'tb_itbi_mig',
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
                    //TODO Criar DAO para ItbiErro
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
            de_nome_tabela: 'tb_itbi_mig',
            de_nome_coluna_chave: 'nu_processo',
            nu_valor_coluna_chave: data.nu_processo,
            de_nome_coluna_erro: 'nu_sequencial',
            de_valor_coluna_erro: data.nu_sequencial.toString(),
            de_tipo: 'Dados Sem Relacionamento',
            de_mensagem: 'nu_sequencial ' + data.nu_sequencial + ' não existe na tabela de IPTUs',
            de_criticidade: 'ALTA',
            dt_criacao: new Date().toISOString()
        }
        errorList.push(errorSequencial);

    }
    delete data.nu_cod_bairro;
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
