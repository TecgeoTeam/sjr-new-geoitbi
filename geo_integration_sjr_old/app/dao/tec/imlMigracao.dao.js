var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var Knex = require('knex');

var knexConfig = require('./../../../knexfile');
var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);

var ImlDAO = require('./../../../app/dao/tinus/iml.dao');

var imlDAO = new ImlDAO();

var logMessageUtil = require('./../../../app/util/logMessage.util');

var ErroModel = require('../../models/erro.model.js');
var ImlMigracaoModel = require('../../models/imlMigracao.model.js');
var LogradouroModel = require('../../models/logradouro.model.js');
var LogModel = require('../../models/log.model.js');



ErroModel.knex(null);
ImlMigracaoModel.knex(null);
LogModel.knex(null);

var boundErroModel = ErroModel.bindKnex(knexGeoAuth);
var boundImlMigracaoModel = ImlMigracaoModel.bindKnex(knexGeoAuth);
var boundLogradouroModel = LogradouroModel.bindKnex(knexFinancas);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);

var configModel = require('../../models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);

var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
var logLevel;



var ImlMigracaoDao = {
    migrateLatest: migrateLatest,
    fillFinancas: fillFinancas
};

module.exports = ImlMigracaoDao;


function migrateLatest(next) {
    async.waterfall([
        //remove os dados antigos
        function(callback) {
            boundConfigModel
                .query()
                .first()
                .then(function(row) {
                    var configJson = row.de_config;
                    logLevel = configJson.logLevel;
                    var qtdIml = imlDAO.count();
                    if (qtdIml > 0) {
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
        // ,
        // function(result, callback) {
        //     fillFinancas(callback);
        // }
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

function fillFinancas(next) {
    async.parallel([
            // function(callback) {
            //     //preenche unidades do banco financas
            //     fillTableFinancas(boundUnidadeFinancasModel, boundImlMigracaoModel, callback);
            // },
            // function(callback) {
            //     fillTableFinancasLogradouro(boundLogradouroModel, boundImlMigracaoModel, callback);
            // },
            function(callback) {
               updateTableFinancasLogradouro(boundLogradouroModel, boundImlMigracaoModel, 'de_codlogradouro', 'de_codigo_anterior', callback);
            }
            // function(callback) {
            //     updateTableFinancas(boundLoteFinancasModel, boundLoteModel, 'de_geocodigo_', 'de_geocodigo', callback);

            // },

            // function(callback) {
            //     updateTableFinancas(boundQuadraFinancasModel, boundQuadraModel, 'de_ggeocodigo', 'de_geocodigo', callback);
            // },

            // function(callback) {
            //     updateTableFinancas(boundBairroFinancasModel, boundBairroModel, 'de_cod_bairro', 'de_geocodigo', callback);
            // },

            // function(callback) {
            //     updateTableFinancas(boundRegionalFinancasModel, boundRegionalModel, 'de_regional_', 'de_geocodigo', callback);
            // },

            // function(callback) {
            //     updateTableFinancas(boundSetorFinancasModel, boundSetorModel, 'de_geocodigo_', 'de_geocodigo', callback);
            // },
            // function(callback) {
            //     updateTableFinancas(boundDistritoFinancasModel, boundDistritoModel, 'nu_distrito', 'de_geocodigo', callback);
            // }
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
                }
                for (var i = 0; i < logs.length; i++) {
                    console.log(logs[i].de_mensagem);
                }

                //TODO Criar DAO para ImlErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function(logDB) {})
                    .catch(function(err) {
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

function fillTableFinancasLogradouro(boundObjectFinancasModel, boundObjectModel, next) {
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
                        .orderBy('de_codigo')
                        .limit(loteLimit).offset(offset)
                        .then(function(list) {
                            for (var i = 0; i < list.length; i++) {
                                delete list[i].de_bairros;
                                delete list[i].de_nome;
                                list[i].objectid = offset + i + 1;
                                list[i] = _.mapKeys(list[i], function(value, key) {
                                    if (key === 'de_codigo') {
                                        return 'codigo';
                                    }
                                    if (key === 'de_codigo_anterior') {
                                        return 'codanter';
                                    }
                                    if (key === 'de_limite_logradouro_final') {
                                        return 'logfinal';
                                    }
                                    if (key === 'de_limite_logradouro_inicial') {
                                        return 'loginicio';
                                    }
                                    if (key === 'de_titulo') {
                                        return 'titulo';
                                    }
                                    if (key === 'de_nome_completo') {
                                        return 'nome';
                                    }
                                    if (key === 'de_origem') {
                                        return 'origem';
                                    }
                                    if (key === 'de_prep') {
                                        return 'prep';
                                    }
                                    if (key === 'de_tipo') {
                                        return 'tipo';
                                    }
                                    if (key === 'fl_permite_apgi') {
                                        return 'apgi';
                                    }
                                    if (key === 'nu_limite_face_final') {
                                        return 'dsqffinal';
                                    }
                                    if (key === 'nu_limite_face_inicial') {
                                        return 'dsqfinicio';
                                    }
                                    return key
                                });

                                delete list[i].dt_ultima_atualizacao_mig;
                                delete list[i].id;
                                delete list[i].nu_codigo;
                            }
                            // O JOIN ESTÁ AQUI
                            knexFinancas
                                .batchInsert(boundObjectFinancasModel.tableName, list, 30)
                                .returning('codigo')
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
                                    if (key === 'de_complemento') {
                                        return 'de_complem';
                                    }
                                    if (key === 'de_cpf_cnpj') {
                                        return 'nu_cpf_cnpj';
                                    }
                                    if (key === 'de_face_quadra') {
                                        return 'de_face';
                                    }
                                    if (key === 'de_geocodigo') {
                                        return 'geocodigo';
                                    }
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'nu_inscricao_imobiliaria';
                                    }
                                    if (key === 'de_numero') {
                                        return 'nu_numero';
                                    }
                                    if (key === 'dt_datahabite_se') {
                                        return 'de_datahabite_se';
                                    }
                                    if (key === 'nu_cod_bairro') {
                                        return 'de_cod_bairro';
                                    }
                                    if (key === 'nu_cod_regional') {
                                        return 'nu_regional';
                                    }
                                    if (key === 'nu_tlp_arrecadado_0') {
                                        return 'nu_tlp__arrecadado_0';
                                    }
                                    return key
                                });
                                if (list[i].fl_carne_devolvido === true) {
                                    list[i].fl_carne_devolvido = 'Sim';
                                } else if (list[i].fl_carne_devolvido === false) {
                                    list[i].fl_carne_devolvido = 'Não';
                                }
                                delete list[i].dt_ultima_atualizacao_mig;
                                delete list[i].id;
                                delete list[i].nu_codigo;
                            }

                            knexFinancas
                                .batchInsert(boundObjectFinancasModel.tableName, list, 30)
                                .returning('geocodigo')
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

function updateTableFinancasLogradouro(boundObjectFinancasModel, boundObjectModel, idColumnNameFinancas, idColumnNameMigracao, next) {
    console.log("==========UPDATE LOGRADOURO==========")
    if (!idColumnNameMigracao) {
        idColumnNameMigracao = 'de_geocodigo';
    }
    boundObjectFinancasModel
        .query()
        .delete()
        .orderBy(idColumnNameFinancas)
        .then(function(objectFinancasList) {
            var loteLimit = 100000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
            var max = 0;
            async.whilst(
                function() {
                    return count <= max;
                },
                function(done) {
                    console.log("passou");
                    boundObjectModel
                        .query()
                        .orderBy(idColumnNameMigracao)
                        .limit(loteLimit).offset(offset)
                        .then(function(selectRow) {

                            function pad(num, size) {
                                var s = "000000000" + num;
                                return s.substr(s.length - size);
                            }

                            if (selectRow) {
                                //DE-PARA DE LOGRADOURO
                                for (var i = 0; i < selectRow.length; i++) {
                                    selectRow[i].objectid = offset + i + 1;
                                    selectRow[i].de_codigo_anterior = pad(selectRow[i].de_codigo_anterior, 7);
                                    selectRow[i] = _.mapKeys(selectRow[i], function(value, key) {
                                            if (key === 'objectid') {
                                                return 'OBJECTID';
                                            }
                                            if (key === 'de_codigo_anterior') {
                                                return 'de_codlogradouro';
                                            }
                                            //COBRAR ESSE CAMPO DA TINUS
                                            // if (key === 'idtipologradouro') {
                                            //     return 'nu_idtipologr';
                                            // }
                                            if (key === 'de_nome_completo') {
                                                return 'de_nomelogradouro';
                                            }
                                            if (key === 'de_limite_logradouro_inicial') {
                                                return 'nu_idlogradouroini';
                                            }
                                            if (key === 'de_limite_logradouro_final') {
                                                return 'nu_idlogradourofim';
                                            }
                                            if (key === 'de_limite_logradouro_final') {
                                                return 'nu_idbairro';
                                            }
                                            //COBRAR ESSE CAMPO DA TINUS
                                            // if (key === 'CEP') {
                                            //     return 'de_cep';
                                            // }
                                            return key
                                        });
                                        delete selectRow[i].dt_ultima_atualizacao_mig;
                                        delete selectRow[i].id;
                                        delete selectRow[i].de_bairros;
                                        delete selectRow[i].de_codigo;
                                        delete selectRow[i].nu_limite_face_inicial;
                                        delete selectRow[i].nu_limite_face_final;
                                        delete selectRow[i].de_tipo;
                                        delete selectRow[i].de_nome;
                                        delete selectRow[i].de_origem;
                                        delete selectRow[i].fl_permite_apgi;
                                        delete selectRow[i].de_prep;
                                        delete selectRow[i].de_titulo;
                                }

                            } else {
                                selectRow = {};
                                selectRow.codigo = null;
                                selectRow.codanter = null;
                                selectRow.logfinal = null;
                                selectRow.loginicio = null;
                                selectRow.titulo = null;
                                selectRow.nome = null;
                                selectRow.origem = null;
                                selectRow.prep = null;
                                selectRow.tipo = null;
                                selectRow.apgi = null;
                                selectRow.dsqffinal = null;
                                selectRow.dsqfinicio = null;
                            }

                            knexFinancas
                                .batchInsert(boundObjectFinancasModel.tableName, selectRow, 30)
                                .returning('de_codlogradouro')
                                .then(function(numberOfAffectedRows) {
                                    if (count > 0 && count % 1000 === 0) {
                                        offset += numberOfAffectedRows.length;
                                        console.log(moment().format(momentFormat) + ': ' + 'Atualizado de ' + count + ' de ' + objectFinancasList.length + ' Em:' + boundObjectFinancasModel.tableName);
                                    }
                                    count++;

                                    done(null, count, boundObjectFinancasModel);
                                }).catch(function(err) {
                                    console.log(err);
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
            var loteLimit = 10000;
            var totalOffset = 100000;
            var wereAllInserted = false;
            var offset = 0;
            var count = 0;
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

                            if (selectRow) {
                                selectRow = _.mapKeys(selectRow, function(value, key) {
                                    if (key === 'de_complemento') {
                                        return 'de_complem';
                                    }
                                    if (key === 'de_cpf_cnpj') {
                                        return 'nu_cpf_cnpj';
                                    }
                                    if (key === 'de_face_quadra') {
                                        return 'de_face';
                                    }
                                    if (key === 'de_geocodigo') {
                                        return 'geocodigo';
                                    }
                                    if (key === 'de_inscricao_imobiliaria') {
                                        return 'nu_inscricao_imobiliaria';
                                    }
                                    if (key === 'de_numero') {
                                        return 'nu_numero';
                                    }
                                    if (key === 'dt_datahabite_se') {
                                        return 'de_datahabite_se';
                                    }
                                    if (key === 'nu_cod_bairro') {
                                        return 'de_cod_bairro';
                                    }
                                    if (key === 'nu_cod_regional') {
                                        return 'nu_regional';
                                    }
                                    if (key === 'nu_tlp_arrecadado_0') {
                                        return 'nu_tlp__arrecadado_0';
                                    }
                                    if (key === 'de_padrao_qualidade') {
                                        return 'padraoqual';
                                    }
                                    if (key === 'de_imposto') {
                                        return 'imposto';
                                    }
                                    if (key === 'de_situacao_exercicio_atual') {
                                        return 'sitexeatual';
                                    }
                                    if (key === 'nu_qtd_quadra') {
                                        return 'de_qtd_quadra';
                                    }
                                    if (key === 'nu_qtd_lote') {
                                        return 'de_qtd_lote';
                                    }
                                    if (key === 'nu_qtd_unidade') {
                                        return 'de_qtd_unidade';
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
                                selectRow.localizado = 'Sim';
                                delete selectRow.dt_ultima_atualizacao_mig;
                                delete selectRow.id;
                                delete selectRow.nu_codigo;
                                selectRow.de_localizado = 'Sim';
                            } else {
                                selectRow = {};
                                selectRow.de_localizado = 'Não';
                                selectRow.de_geocodigo = null;
                                selectRow.nu_inscricao_imobiliaria = null;
                                selectRow.de_proprietario = null;
                                selectRow.nu_cpf_cnpj = null;
                                selectRow.de_logradouro = null;
                                selectRow.nu_numero = null;
                                selectRow.de_complem = null;
                                selectRow.de_cep = null;
                                selectRow.de_distrito = null;
                                selectRow.de_setor = null;
                                selectRow.de_quadra = null;
                                selectRow.de_lote = null;
                                selectRow.de_qtd_unidade = null;
                                selectRow.de_natureza = null;
                                selectRow.nu_regional = null;
                                selectRow.de_regional = null;
                                selectRow.de_cod_bairro = null;
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
                                selectRow.iml_lancado_0 = null;
                                selectRow.tlp_lancado_0 = null;
                                selectRow.iml_lancado_1 = null;
                                selectRow.tlp_lancado_1 = null;
                                selectRow.iml_lancado_2 = null;
                                selectRow.tlp_lancado_2 = null;
                                selectRow.iml_lancado_3 = null;
                                selectRow.tlp_lancado_3 = null;
                                selectRow.iml_lancado_4 = null;
                                selectRow.tlp_lancado_4 = null;
                                selectRow.iml_lancado_5 = null;
                                selectRow.tlp_lancado_5 = null;
                                selectRow.iml_lancado_6 = null;
                                selectRow.tlp_lancado_6 = null;
                                selectRow.iml_arrecadado_0 = null;
                                selectRow.tlp__arrecadado_0 = null;
                                selectRow.iml_arrecadado_1 = null;
                                selectRow.tlp_arrecadado_1 = null;
                                selectRow.iml_arrecadado_2 = null;
                                selectRow.tlp_arrecadado_2 = null;
                                selectRow.iml_arrecadado_3 = null;
                                selectRow.tlp_arrecadado_3 = null;
                                selectRow.iml_arrecadado_4 = null;
                                selectRow.tlp_arrecadado_4 = null;
                                selectRow.iml_arrecadado_5 = null;
                                selectRow.tlp_arrecadado_5 = null;
                                selectRow.iml_arrecadado_6 = null;
                                selectRow.tlp_arrecadado_6 = null;
                                selectRow.nu_sequencial = null;
                            }
                            selectRow.nu_area_unidade = null;


                            boundObjectFinancasModel
                                .query()
                                .update(selectRow)
                                .where(idColumnNameFinancas, objectFinancasList[count][idColumnNameFinancas])
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

function removeAll(next) {
    async.parallel([
            function(callback) {
                boundImlMigracaoModel
                    .query()
                    .delete()
                    // .where('age', '>', 100)
                    .then(function(numberOfDeletedRows) {
                        callback(null, [numberOfDeletedRows, boundImlMigracaoModel]);
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
                //TODO Criar DAO para ImlErro
                boundLogModel
                    .query()
                    .insert(logs)
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de iml');
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
            

            var dbResponse = imlDAO.fillList();
            if (!dbResponse.error) {
                var list = dbResponse.result;
                var handlingStart;
                // log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundImlMigracaoModel.tableName, count);
                // handlingStart = moment();
                // if (logLevel === 'completo') {
                //     saveLog(log);
                // }
                // console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                list = processDatas(list);

                for (var i = 0; i < list.errorList.length; i++) {
                    errorList.push(list.errorList[i]);
                }
                list = list.dataList;

                // log = logMessageUtil.handlingMigrateByNeighborhoodMessage(boundImlMigracaoModel.tableName, count, handlingStart, list.length);
                // if (logLevel === 'completo') {
                //     saveLog(log);
                // }
                // console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);

                knexGeoAuth
                    .batchInsert(boundImlMigracaoModel.tableName, list, 30)
                    .returning('de_codigo')
                    .then(function(ids) {
                        total = total + ids.length;
                        log = logMessageUtil.migrateMessage(boundImlMigracaoModel.tableName, ids.length, count);
                        if (logLevel === 'completo') {
                            saveLog(log);
                        }
                        console.log(moment().format(momentFormat) + ': ' + log.de_mensagem);
                        console.log('\n ============================')
                        count++;
                        done(null, total);
                    });
                    // .catch(function(err) {
                    //     next(err);
                    // });

            } else {
                done(new Error('Não foi possível a comunicação com o banco de Integração'));
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

                var log = logMessageUtil.migrateMessage(boundImlMigracaoModel.tableName, n);
                console.log(log.de_mensagem);

                //TODO Criar DAO para ImlErro
                boundLogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {
                        knexGeoAuth
                            .batchInsert(boundErroModel.tableName, errorList, 30)
                            .returning('id')
                            .then(function(ids) {
                                var erroLog = logMessageUtil.errorMessage(boundImlMigracaoModel.tableName, ids.length, boundErroModel.tableName);
                                boundLogModel
                                    .query()
                                    .insert(erroLog)
                                    .then(function(errorlogDB) {
                                        if(errorlogDB){
                                        console.log(errorlogDB.de_mensagem);
                                        }
                                    })
                                    .catch(function(err) {
                                        console.log(err);
                                    });
                            })
                            .catch(function(err) {
                                console.log(err);
                            });
                    })
                    .catch(function(err) {
                        console.log('Erro ao registrar erros log de iml');
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
    data = _.mapKeys(data, function(value, key) {
        if (key === 'NU_CODIGO') {
            key = 'DE_CODIGO';
        } else if (key === 'NU_NUMERO') {
            key = 'DE_NUMERO';
        } else if (key === 'NU_CODIGO_ANTERIOR') {
            key = 'DE_CODIGO_ANTERIOR';
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
            o = Number(o);

        } else if (key === 'de_calcada') {
            o = o.replace(/ /g, '');
        } else if (key === 'de_codigo' || key === 'de_codigo_anterior') {
            if(o){
            var output = o;
            o = output;
            }
        } else if (key.startsWith('de_') && key.indexOf('cod') === -1) {
            o = _.trim(o);
            if (o === '') {
                o = null;
            }
        } else if (key.startsWith('fl_')) {
            if (o && (o.toLowerCase() === 'não' || o.toLowerCase() === 'nao'|| o.toLowerCase() === 'n')) {
                o = false;
            } else if (o && (o.toLowerCase() === 'sim'|| o.toLowerCase() === 's')) {
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
                        de_nome_tabela: 'tb_iml_mig',
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


    delete data.de_logradouro;
    delete data.sub1;

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