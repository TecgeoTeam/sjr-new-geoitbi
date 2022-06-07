var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var LoteamentoMigracaoModel = require('../../models/loteamentoMigracao.model.js');

var LoteamentoDAO = require('./../../../app/dao/tinus/loteamento.dao');

var loteamentoDAO = new LoteamentoDAO();

var ErroModel = require('../../models/erro.model.js');
var LogModel = require('../../models/log.model.js');
var Knex = require('knex');
var knexConfig = require('./../../../knexfile');
var knex = Knex(knexConfig.development);

var LoteamentoMigracaoDao = {
    insert: insert,
    select: select,
    insertAll: insertAll,
    migrate: migrate
};

module.exports = LoteamentoMigracaoDao;

function insert(loteamento) {
    if (loteamento) {
        // loteamento = processData(loteamento);
        LoteamentoMigracaoModel
            .query()
            .insert(loteamento)
            .then(function(loteamentoInserido) {
                // console.log(loteamentoInserido.id);
            })
            .catch(function(err) {
                console.log(err.message);
                console.log(loteamento);
            });
    }
}

function select(firstCondition, value) {
    // loteamento = processData(loteamento);
    LoteamentoMigracaoModel
        .query()
        .where(firstCondition, value)
        .debug()
        .then(function(loteamentoList) {
            console.log(loteamentoList);
        })
        .catch(function(err) {


            console.log(err.message);
        });
}

function migrate() {

    var max = 1
    var count = 0;
    var total = 0;
    var momentFormat = 'DD/MM/YYYY - HH:mm:ss';
    async.whilst(
        function() {
            return count < max;
        },
        function(done) {

            console.log(moment().format(momentFormat) + ': ' + 'Puxando Loteamentos');
            var list = loteamentoDAO.fillList();
            console.log(moment().format(momentFormat) + ': ' + 'Iniciando tratamento de dados dos Loteamentos');
            list = processDatas(list);
            console.log(moment().format(momentFormat) + ': ' + 'Tratado: ' + list.length + ' Loteamentos');
            knex
                .batchInsert(LoteamentoMigracaoModel.tableName, list, 30)
                .returning('id')
                .then(function(ids) {
                    total = total + ids.length;
                    console.log(moment().format(momentFormat) + ': ' + ids.length + ' Registros inseridos da tabela de loteamentos com sucesso');
                    console.log(moment().format(momentFormat) + ': ' + total + ' Registros inseridos com sucesso ao total');
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
                console.log(err);
            } else {
                var message = moment().format(momentFormat) + ': ' + 'Migração de Loteamentos finalizada. ' + n + ' Registros salvos em tb_loteamento_mig';
                console.log(message);
                var log = {
                        de_mensagem: message
                    }
                    //TODO Criar DAO para LoteamentoErro
                LogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de loteamento');
                    });
            }

        }
    );



}

function insertAll(loteamentoList) {

    if (loteamentoList) {
        loteamentoList = processDatas(loteamentoList);
        console.log('tratado: ' + loteamentoList.length);
        // for (var i = 0; i < loteamentoList.length; i++) {
        //     insert(loteamentoList[i]);
        // }
        console.log(LoteamentoMigracaoModel.tableName);

        knex
            .batchInsert(LoteamentoMigracaoModel.tableName, loteamentoList, 30)
            .returning('id')
            .then(function(ids) {
                console.log(ids.length);
            })
            .catch(function(err) {
                console.log(err);
            });
    }

}

function processDatas(list) {
    for (var i = 0; i < list.length; i++) {
        list[i] = processData(list[i]);
    }
    return list;
}

function processData(data) {
    data = _.mapKeys(data, function(value, key) {
        if (key === 'NU_CODIGO') {
            key = 'DE_CODIGO';
        }
        return key.toLowerCase();
    });
    data = _.mapValues(data, function(o, key) {
        if (key.startsWith('nu_') || key === 'id') {
            o = _.replace(o, /\./g, '');
            o = _.replace(o, ',', '.');
            o = Number(o);

        } else if (key.startsWith('de_')) {
            o = _.trim(o);
        }
        return o;
    });
    data.id= undefined;
    data.dt_ultima_atualizacao_mig = new Date().toISOString();
    return data;
}
