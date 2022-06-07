var Knex = require('knex');
var schedule = require('node-schedule');

var knexConfig = require('./../../knexfile');
var knexGeoAuth = Knex(knexConfig.geoAuth);

var configModel = require('./../../app/models/config.model');
configModel.knex(null);
var boundConfigModel = configModel.bindKnex(knexGeoAuth);

var migrateUtil = require('./../../app/util/migrate.util');

//Cria uma regra para executar a migração todo dia as 18
var dayOfWeekEnun = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
var logLevelEnum = {COMPLETO:'completo', BASICO:'básico'}
var self = this;
var logLevel = logLevelEnum.BASICO;

var jobUtil = {
	create: create,
	logLevel:logLevel,
	logLevelEnum:logLevelEnum
};

module.exports = jobUtil;


function create(req, res, next) {
	var job = self.job;
	if (job) {
		job.cancel();
		console.log('tarefa anterior cancelado');
	}
	boundConfigModel
		.query()
		.first()
		.then(function(row) {
			var configJson = row.de_config;
			var scheduleConfig = configJson.schedule;
			logLevel =  configJson.logLevel;
			console.log(logLevel);
			var rule = new schedule.RecurrenceRule();
			rule.dayOfWeek = scheduleConfig.dayOfWeek;
			rule.hour = scheduleConfig.hour;
			rule.minute = scheduleConfig.minute;

			var msg = 'Migração irá rodar ';
			for (var i = 0; i < rule.dayOfWeek.length; i++) {
				msg += dayOfWeekEnun[rule.dayOfWeek[i]];
				if (i < rule.dayOfWeek.length - 1)
					if (rule.dayOfWeek[i + 2]) {
						msg += ', '
					} else {
						msg += ' e '
					}
			}
			msg += ' às ' + rule.hour + ':' + rule.minute;

			console.log(msg);

			 //self.job = schedule.scheduleJob('migracao', rule, migrateUtil.migrateAllData);
			 migrateUtil.migrateAllData();

			if (res) {
				res.json({
					message: msg
				});
			}
		});

}