var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var Knex = require('knex');



var MercantilDAO = require('./../../../app/dao/tinus/mercantil.dao');

var mercantilDAO = new MercantilDAO();

var knexConfig = require('./../../../knexfile');

var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);

var ErroModel = require('../../models/erro.model.js');
var LogModel = require('../../models/log.model.js');
var LoteMercantilFinancasModel = require('../../models/financas/loteMercantilFinancas.model.js');
var MercantilMigracaoModel = require('../../models/mercantilMigracao.model.js');
var MercantilModel = require('../../models/mercantil.model.js');
var UnidadeMercantilFinancasModel = require('../../models/financas/unidadeMercantilFinancas.model.js');
var UnidadeMercantilModel = require('../../models/unidadeMercantil.model.js');

ErroModel.knex(null);
LogModel.knex(null);
LoteMercantilFinancasModel.knex(null);
MercantilMigracaoModel.knex(null);
MercantilModel.knex(null);
UnidadeMercantilFinancasModel.knex(null);
UnidadeMercantilModel.knex(null);

var boundErroModel = ErroModel.bindKnex(knexGeoAuth);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);
var boundLoteMercantilFinancasModel = LoteMercantilFinancasModel.bindKnex(knexFinancas);
var boundMercantilMigracaoModel = MercantilMigracaoModel.bindKnex(knexGeoAuth);
var boundMercantilModel = MercantilModel.bindKnex(knexGeoAuth);
var boundUnidadeMercantilFinancasModel = UnidadeMercantilFinancasModel.bindKnex(knexFinancas);
var boundUnidadeMercantilModel = UnidadeMercantilModel.bindKnex(knexGeoAuth);
var configModel = require('../../models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);


var logMessageUtil = require('./../../../app/util/logMessage.util');


var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
var logLevel;

var MercantilMigracaoDao = {
    migrate: migrate,
    migrateLatest: migrateLatest,
    generateUnidade: generateUnidade,
    generateMercantil: generateMercantil,
    fillFinancas: fillFinancas
};

module.exports = MercantilMigracaoDao;


function insert(mercantil) {
    if (mercantil) {
        // mercantil = processData(mercantil);
        boundMercantilMigracaoModel
            .query()
            .insert(mercantil)
            .then(function(mercantilInserido) {
                // console.log(mercantilInserido.id);
            })
            .catch(function(err) {
                console.log(err.message);
                console.log(mercantil);
            });
    }
}

function migrateLatest(next) {
    async.waterfall([
        //remove os dados antigos
        function(callback) {
            boundConfigModel
                .query()
                .first()
                .then(function(row) {
                    var qtdMercantil = mercantilDAO.count()
                    if (qtdMercantil > 0) {
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
        function(result, callback) {
            generateUnidade(callback);
        },
        //através da unidade gera os lotes
        function(result, callback) {
            generateMercantil(callback);
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
                console.log(next);
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
                boundMercantilMigracaoModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundMercantilMigracaoModel]);
                    });
            },
            function(callback) {
                boundUnidadeMercantilModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundUnidadeMercantilModel]);
                    });
            },
            function(callback) {
                boundMercantilModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundMercantilModel]);
                    });
            },
            function(callback) {
                boundErroModel
                    .query()
                    .delete()
                    .whereIn('de_nome_tabela', [boundMercantilMigracaoModel.tableName, boundMercantilMigracaoModel.tableName])
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
                        console.log('Erro ao registrar log de mercantil');
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

            var log = logMessageUtil.pullMigrateByNeighborhoodMessage(boundMercantilMigracaoModel.tableName, count);
            if (logLevel === 'completo') {
                saveLog(log);
            }
            console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            var list;
            if (count === 0) {
                list = mercantilDAO.fillList('NU_COD_BAIRRO IS NULL AND DE_SITUACAO=\'ATIVO\'', 'TecGeo.IMOBILIARIO', 'NU_SEQUENCIAL');
            } else {
                list = mercantilDAO.fillList('NU_COD_BAIRRO = \'' + codBairro + '\' AND DE_SITUACAO=\'ATIVO\'', 'TecGeo.IMOBILIARIO', 'NU_SEQUENCIAL');
            }

            var handlingStart;
            log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundMercantilMigracaoModel.tableName, count);
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
            log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundMercantilMigracaoModel.tableName, count, handlingStart, list.length);
                if (logLevel === 'completo') {
                    saveLog(log);
                }
                console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
            knexGeoAuth
                .batchInsert(boundMercantilMigracaoModel.tableName, list, 30)
                .returning('id')
                .then(function(ids) {
                    total = total + ids.length;
                    log = logMessageUtil.migrateMessage(boundMercantilMigracaoModel.tableName, ids.length, count);
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
                var log = logMessageUtil.migrateMessage(boundMercantilMigracaoModel.tableName, n);
                console.log(log.de_mensagem);
                //TODO Criar DAO para MercantilErro
                boundLogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {
                        knexGeoAuth
                            .batchInsert(boundErroModel.tableName, errorList, 30)
                            .returning('id')
                            .then(function(ids) {
                                var erroLog = logMessageUtil.errorMessage(boundMercantilMigracaoModel.tableName, ids.length, boundErroModel.tableName);
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
                        console.log('Erro ao registrar log de mercantil');
                    });
            }

        }
    );

}

function generateUnidade(next) {
    // iptu = processData(iptu);
    boundMercantilMigracaoModel
        .query()
        .select(['tb_iptu_mig.de_geocodigo', 'tb_iptu_mig.de_inscricao_imobiliaria', 'tb_iptu_mig.de_distrito', 'tb_iptu_mig.de_setor', 'tb_iptu_mig.de_quadra', 'tb_iptu_mig.de_lote', 'tb_iptu_mig.de_unidade', 'tb_mercantil_mig.*'])
        .leftJoin('tb_iptu_mig', 'tb_mercantil_mig.nu_sequencial', 'tb_iptu_mig.nu_sequencial')
        .then(function(unidadeMercantilList) {

            // for (var i = 0; i < unidadeMercantilList.length; i++) {
            //     if (!unidadeMercantilList[i].de_geocodigo) {
            //         unidadeMercantilList[i].de_geocodigo = '000000000000';
            //         unidadeMercantilList[i].de_inscricao_imobiliaria = '0.0000.000.00.0000.0000.0';
            //         unidadeMercantilList[i].de_distrito = '0';
            //         unidadeMercantilList[i].de_setor = '0000';
            //         unidadeMercantilList[i].de_quadra = '000';
            //         unidadeMercantilList[i].de_lote = '0000';
            //         unidadeMercantilList[i].de_unidade = '0000';

            //     }
            // }

            knexGeoAuth
                .batchInsert(boundUnidadeMercantilModel.tableName, unidadeMercantilList, 30)
                .returning('id')
                .then(function(ids) {

                    var log = logMessageUtil.generateMessage(boundUnidadeMercantilModel.tableName, ids.length, boundMercantilMigracaoModel.tableName);
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

//TODO
function generateMercantil(next) {
    boundUnidadeMercantilModel
        .query()
        .distinct('de_geocodigo')
        .whereNotNull('de_geocodigo')
        .then(function(unidadeMercantilList) {
            knexGeoAuth
                .batchInsert(boundMercantilModel.tableName, unidadeMercantilList, 30)
                .returning('de_geocodigo')
                .then(function(geocodigos) {
                    var message = moment().format(momentFormat) + ': ' + 'Inseridos. ' + unidadeMercantilList.length + ' Registros salvos em ' + boundMercantilModel.tableName;
                    console.log(message);
                    var mercantilLimit = 2000;
                    var totalOffset = geocodigos.length;
                    var offset = 0;
                    var handlingStart = moment();
                    async.whilst(
                        function() {
                            return offset < totalOffset;
                        },
                        function(done) {
                            boundMercantilModel
                                .query()
                                .orderBy('de_geocodigo')
                                .eager('unidadesMercantis(orderByDeUnidade)', {
                                    orderByDeUnidade: function(builder) {
                                        builder.orderBy('de_unidade');
                                    }
                                })
                                .limit(mercantilLimit).offset(offset)
                                .then(function(mercantilList) {
                                    for (var i = 0; i < mercantilList.length; i++) {
                                        var primeiro = 0;
                                        var unidadeBase;
                                        var nu_quantidade_fornos = 0;
                                        var nu_quantidade_guindastes = 0;
                                        var nu_quantidade_maquinas = 0;
                                        var nu_quantidade_motores = 0;

                                        unidadeBase = mercantilList[i].unidadesMercantis[primeiro];

                                        mercantilList[i].nu_sequencial = unidadeBase.nu_sequencial;
                                        mercantilList[i].nu_inscricao = unidadeBase.nu_inscricao;
                                        mercantilList[i].de_inscricao_imobiliaria = unidadeBase.de_inscricao_imobiliaria;
                                        mercantilList[i].de_distrito = unidadeBase.de_distrito;
                                        mercantilList[i].de_setor = unidadeBase.de_setor;
                                        mercantilList[i].de_quadra = unidadeBase.de_quadra;
                                        mercantilList[i].de_lote = unidadeBase.de_lote;
                                        mercantilList[i].de_unidade = unidadeBase.de_unidade;
                                        mercantilList[i].nu_codigo = unidadeBase.nu_codigo;
                                        mercantilList[i].fl_incentivo_fiscal = unidadeBase.fl_incentivo_fiscal;
                                        mercantilList[i].fl_local_ignorado = unidadeBase.fl_local_ignorado;
                                        mercantilList[i].fl_licenciado = unidadeBase.fl_licenciado;
                                        mercantilList[i].fl_reducao_aliquota = unidadeBase.fl_reducao_aliquota;
                                        mercantilList[i].fl_sociedade_profissional = unidadeBase.fl_sociedade_profissional;
                                        mercantilList[i].dt_data_cadastro = unidadeBase.dt_data_cadastro;
                                        mercantilList[i].de_anuncios_letreiros = unidadeBase.de_anuncios_letreiros;
                                        mercantilList[i].de_atividade = unidadeBase.de_atividade;
                                        mercantilList[i].de_atividade_tll = unidadeBase.de_atividade_tll;
                                        mercantilList[i].de_cpf_cnpj = unidadeBase.de_cpf_cnpj;
                                        mercantilList[i].de_denominacao = unidadeBase.de_denominacao;
                                        mercantilList[i].de_endereco = unidadeBase.de_endereco;
                                        mercantilList[i].de_incentivo_base_legal = unidadeBase.de_incentivo_base_legal;
                                        mercantilList[i].de_incentivo_vigencia = unidadeBase.de_incentivo_vigencia;
                                        mercantilList[i].de_nome_fantasia = unidadeBase.de_nome_fantasia;
                                        mercantilList[i].de_reducao_base_legal = unidadeBase.de_reducao_base_legal;
                                        mercantilList[i].de_regime_horario_especial = unidadeBase.de_regime_horario_especial;
                                        mercantilList[i].de_regime_iss = unidadeBase.de_regime_iss;
                                        mercantilList[i].de_regime_maquinas_afins = unidadeBase.de_regime_maquinas_afins;
                                        mercantilList[i].de_regime_ocupacao_area_public = unidadeBase.de_regime_ocupacao_area_public;
                                        mercantilList[i].de_regime_publicidade = unidadeBase.de_regime_publicidade;
                                        mercantilList[i].de_regime_tlf = unidadeBase.de_regime_tlf;
                                        mercantilList[i].de_situacao = unidadeBase.de_situacao;
                                        mercantilList[i].de_tipo_atividade = unidadeBase.de_tipo_atividade;
                                        mercantilList[i].nu_qtd_unidade = mercantilList[i].unidadesMercantis.length;

                                        for (var u = 0; u < mercantilList[i].unidadesMercantis.length; u++) {
                                            nu_quantidade_fornos += Number(mercantilList[i].unidadesMercantis[u].nu_quantidade_fornos);
                                            nu_quantidade_guindastes += Number(mercantilList[i].unidadesMercantis[u].nu_quantidade_guindastes);
                                            nu_quantidade_maquinas += Number(mercantilList[i].unidadesMercantis[u].nu_quantidade_maquinas);
                                            nu_quantidade_motores += Number(mercantilList[i].unidadesMercantis[u].nu_quantidade_motores);
                                        }

                                        mercantilList[i].nu_quantidade_fornos = nu_quantidade_fornos;
                                        mercantilList[i].nu_quantidade_guindastes = nu_quantidade_guindastes;
                                        mercantilList[i].nu_quantidade_maquinas = nu_quantidade_maquinas;
                                        mercantilList[i].nu_quantidade_motores = nu_quantidade_motores;
                                    }
                                    var total = 0;
                                    for (var i = 0; i < mercantilList.length; i++) {
                                        boundMercantilModel
                                            .query()
                                            .patch(mercantilList[i])
                                            .where('de_geocodigo', mercantilList[i].de_geocodigo)
                                            .then(function(updated) {
                                                total++;
                                                if (total >= mercantilList.length) {
                                                    offset += mercantilList.length;
                                                    var log = logMessageUtil.generateMessage(boundMercantilModel.tableName, offset, boundUnidadeMercantilModel.tableName);
                                                    if (logLevel === 'completo') {
                                                        saveLog(log);
                                                    }
                                                    console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
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

                                var log = logMessageUtil.generateMessage(boundMercantilModel.tableName, n, boundUnidadeMercantilModel.tableName, handlingStart);
                                console.log(log.de_mensagem);
                                boundLogModel
                                    .query()
                                    .insert(log)
                                    .then(function(logDB) {})
                                    .catch(function(err) {
                                        console.log('Erro ao registrar log de iptu');
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
                fillTableFinancas(boundUnidadeMercantilFinancasModel, boundUnidadeMercantilModel, callback);

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

                                list[i].de_atividade_tll = list[i].de_atividade + ' - ' + list[i].de_atividade_tll;
                                delete list[i].id;

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
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'nu_inscricao_imobiliaria';
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
                                selectRow.nu_inscricao_imobiliaria = null;
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
        } else if (key === 'FL_REDUCAO_ALÍQUOTA') {
            key = 'FL_REDUCAO_ALIQUOTA';
        }
        return key.toLowerCase();
    });
    data = _.mapValues(data, function(o, key) {
        if (key.startsWith('nu_') && key !== 'nu_codigo' && key !== 'nu_sequencial') {
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
            if (o !== null) {

                if (o.toLowerCase() === 'n') {
                    o = false;
                } else if (o.toLowerCase() === 's') {
                    o = true;
                } else if (o.toLowerCase() === 'não' || o.toLowerCase() === 'nao') {
                    o = false;
                } else if (o.toLowerCase() === 'sim') {
                    o = true;
                }



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
                        de_nome_tabela: 'tb_mercantil_mig',
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
                    //TODO Criar DAO para MercantilErro
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
            de_nome_tabela: 'tb_mercantil_mig',
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
