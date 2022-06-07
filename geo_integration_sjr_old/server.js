var objection = require('objection');
var morgan = require('morgan');
var express = require('express');
var app = express();
var async = require('async');
var bodyParser = require('body-parser');

var config = require('./config');

var IptuMigracaoDAO = require('./app/dao/tec/iptuMigracao.dao');
var MercantilMigracaoDAO = require('./app/dao/tec/mercantilMigracao.dao');
var BcfqMigracaoDAO = require('./app/dao/tec/bcfqMigracao.dao');


var jobUtil = require('./app/util/job.util');

var port = process.env.PORT || config.port;



jobUtil.create();

app.get('/job/create', jobUtil.create);



app.listen(port);
console.log('O Webservice de Integração está rodando na porta:' + port);