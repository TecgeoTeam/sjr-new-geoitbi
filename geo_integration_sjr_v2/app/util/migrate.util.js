var async = require('async');
var Knex = require('knex');
var moment = require('moment');

var knexConfig = require('./../../knexfile');
var knexGeoAuth = Knex(knexConfig.geoAuth);
var knexFinancas = Knex(knexConfig.financas);

var IptuMigracaoDAO = require('../dao/tec/iptuMigracao.dao');
var MercantilMigracaoDAO = require('../dao/tec/mercantilMigracao.dao');
var BcfqMigracaoDAO = require('../dao/tec/bcfqMigracao.dao');
var ItbiMigracaoDAO = require('../dao/tec/itbiMigracao.dao');
var ImlMigracaoDAO = require('../dao/tec/imlMigracao.dao');

var LogModel = require('../models/log.model.js');
LogModel.knex(null);
var boundLogModel = LogModel.bindKnex(knexGeoAuth);

var logMessageUtil = require('./logMessage.util');

var MigrateUtil = {
    migrateAllData: migrateAllData,
};

module.exports = MigrateUtil;


function migrateAllData() {
    var routineStart;
    console.log("======MIGRAÇÃO INICIADA======");
    async.waterfall([
        function(callback) {
            var log = logMessageUtil.routineMessage();
            console.log(log.de_mensagem);
            //TODO Criar DAO para IptuErro
            boundLogModel
                .query()
                .insert(log)
                .then(function(logDB) {
                    routineStart = moment();
                    IptuMigracaoDAO.migrateAll(callback);
                })
                .catch(function(err) {
                    console.log('Erro ao registrar log de atualização de lotes em Financas');
                });
        },
        function(result, callback) {
            ImlMigracaoDAO.migrateLatest(callback);
        },
        function(result, callback) {
            ImlMigracaoDAO.fillFinancas(callback);
        },
        function(result, callback) {
            BcfqMigracaoDAO.migrateLatest(callback);
        },
        function(result, callback) {
            BcfqMigracaoDAO.fillFinancas(callback);
        },
        // function(result, callback) {
        //     ItbiMigracaoDAO.migrateLatest(callback);
        // },
        // function(result, callback) {
        //     ItbiMigracaoDAO.fillFinancas(callback);
        // },
        function(result, callback) {
            IptuMigracaoDAO.generateTables(callback);
        },
        function(result, callback) {
            IptuMigracaoDAO.fillFinancas(callback);
        }

    ], function(err, result) {
        var log;
        if (err) {
            log = logMessageUtil.routineMessage(routineStart, err);
        } else {
            log = logMessageUtil.routineMessage(routineStart);
        }

        console.log(log.de_mensagem);
        //TODO Criar DAO para IptuErro
        boundLogModel
            .query()
            .insert(log)
            .then(function(logDB) {})
            .catch(function(err) {
                console.log(err);
            });
    });

}
