var _ = require('lodash');
var moment = require('moment');
var async = require('async');
var BairroMigracaoModel = require('../../models/bairroMigracao.model.js');

var BairroDAO = require('./../../../app/dao/tinus/bairro.dao');

var bairroDAO = new BairroDAO();

var ErroModel = require('../../models/erro.model.js');
var LogModel = require('../../models/log.model.js');
var Knex = require('knex');
var knexConfig = require('./../../../knexfile');
var knex = Knex(knexConfig.development);

var BairroMigracaoDao = {
    insert: insert,
    select: select,
    insertAll: insertAll,
    migrate: migrate
};

module.exports = BairroMigracaoDao;

function insert(bairro) {
    if (bairro) {
        // bairro = processData(bairro);
        BairroMigracaoModel
            .query()
            .insert(bairro)
            .then(function(bairroInserido) {
                // console.log(bairroInserido.id);
            })
            .catch(function(err) {
                console.log(err.message);
                console.log(bairro);
            });
    }
}

function select(firstCondition, value) {
    // bairro = processData(bairro);
    BairroMigracaoModel
        .query()
        .where(firstCondition, value)
        .debug()
        .then(function(bairroList) {
            console.log(bairroList);
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

            console.log(moment().format(momentFormat) + ': ' + 'Puxando Bairros');
            var list = bairroDAO.fillList();
            console.log(moment().format(momentFormat) + ': ' + 'Iniciando tratamento de dados dos Bairros');
            list = processDatas(list);
            console.log(moment().format(momentFormat) + ': ' + 'Tratado: ' + list.length + ' Bairros');
            knex
                .batchInsert(BairroMigracaoModel.tableName, list, 30)
                .returning('id')
                .then(function(ids) {
                    total = total + ids.length;
                    console.log(moment().format(momentFormat) + ': ' + ids.length + ' Registros inseridos da tabela de bairros com sucesso');
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
                var message = moment().format(momentFormat) + ': ' + 'Migração de Bairros finalizada. ' + n + ' Registros salvos em tb_bairro_mig';
                console.log(message);
                var log = {
                        de_mensagem: message
                    }
                    //TODO Criar DAO para BairroErro
                LogModel
                    .query()
                    .insert(log)
                    .then(function(logDB) {})
                    .catch(function(err) {
                        console.log('Erro ao registrar log de bairro');
                    });
            }

        }
    );



}

function insertAll(bairroList) {

    if (bairroList) {
        bairroList = processDatas(bairroList);
        console.log('tratado: ' + bairroList.length);
        // for (var i = 0; i < bairroList.length; i++) {
        //     insert(bairroList[i]);
        // }
        console.log(BairroMigracaoModel.tableName);

        knex
            .batchInsert(BairroMigracaoModel.tableName, bairroList, 30)
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

    data.dt_ultima_atualizacao_mig = new Date().toISOString();
    return data;
}
