var moment = require('moment');
moment.locale('pt-br');

var momentFormat = 'DD/MM/YYYY - HH:mm:ss';

var LogMessageUtil = {
    updateMessage: updateMessage,
    removeMessage: removeMessage,
    generateMessage: generateMessage,
    generateSemImpostoMessage:generateSemImpostoMessage,
    migrateMessage: migrateMessage,
    pullMigrateByNeighborhoodMessage: pullMigrateByNeighborhoodMessage,
    handlingMigrateByNeighborhoodMessage: handlingMigrateByNeighborhoodMessage,
    errorMessage: errorMessage,
    routineMessage: routineMessage,
    notFoundMessage: notFoundMessage

};

module.exports = LogMessageUtil;

function migrateMessage(tableName, rows, codBairro) {
	var message;
	if(codBairro){
		message = 'Migração do bairro '+codBairro+' finalizada. ' + rows + ' Registros migrados.'
	}else{
		message = 'Migração finalizada. ' + rows + ' Registros migrados.';
	}
    var log = {
        de_mensagem: message,
        de_nome_tabela: tableName,
        de_tipo: 'migração',
        nu_registro: rows
    }
    return log;
}

function pullMigrateByNeighborhoodMessage(tableName, codBairro) {
    var log = {
        de_mensagem: 'Puxando dados do bairro ' + codBairro,
        de_nome_tabela: tableName,
        de_tipo: 'migração',
        nu_registro: null
    }
    return log;
}

function handlingMigrateByNeighborhoodMessage(tableName, codBairro, handlingStart, rows) {
    var message;
    if (!handlingStart) {
    	message = 'Iniciando tratamento de dados do bairro ' + codBairro;
    } else {
        message = 'Tratamento do bairro '+ codBairro+' finalizado. Duração: ' + handlingStart.fromNow(true);

    }

    var log = {
        de_mensagem: message,
        de_nome_tabela: tableName,
        de_tipo: 'tratamento',
        nu_registro: rows
    }
    return log;
}

function routineMessage(routineStart, err) {
    var message;
    if (!routineStart) {
        message = 'Rotina de Migração iniciada.';
    } else {
        console.log("ERRO", err);
        if (err) {
            var errorMessage = err.message;
            if (errorMessage.indexOf('-') !== -1) {
                errorMessage = errorMessage.substring(errorMessage.indexOf('-'));
            }

            message = 'Rotina de Migração encerrada devido a um erro. Duração: ' + routineStart.fromNow(true) + '\n' + errorMessage;
        } else {
            message = 'Rotina de Migração finalizada. Duração: ' + routineStart.fromNow(true);
        }

    }
    var log = {
        de_mensagem: message,
        de_tipo: 'rotina',
    }
    return log;
}

function errorMessage(tableName, rows, errorTableName) {
    var log = null;
    if (rows || rows == 0) {
        log = {
            de_mensagem: 'Erros de salvos em ' + errorTableName + '. ' + rows + ' Registros com erro.',
            de_nome_tabela: tableName,
            de_tipo: 'erro',
            nu_registro: rows
        }
    }

    return log;
}


function updateMessage(tableName, rows) {
    var log = {
        de_mensagem: 'Atualização finalizada. ' + rows + ' Registros atualizados.',
        de_nome_tabela: tableName,
        de_tipo: 'atualização',
        nu_registro: rows
    }
    return log;
}

function notFoundMessage(tableName, rows) {
    var log = {
        de_mensagem: 'Não foi possível atualizar todos os registros. ' + rows + ' Registros não encontrados.',
        de_nome_tabela: tableName,
        de_tipo: 'não encontrados',
        nu_registro: rows
    }
    return log;
}

function removeMessage(tableName, rows) {
    var log = {
        de_mensagem: 'Remoção de registros antigos finalizada. ' + rows + ' Registros removidos.',
        de_nome_tabela: tableName,
        de_tipo: 'exclusão',
        nu_registro: rows
    }
    return log;
}

function generateMessage(tableName, rows, generatorTableName, routineStart) {
    var message;
    if(!routineStart){
        message = 'Geração através de ' + generatorTableName + '. ' + rows + ' Registros gerados.';
    }else{
        message = 'Geração de '+tableName+' através de '+generatorTableName+ ' finalizada. Duração: ' + routineStart.fromNow(true);
    }
    var log = {
        de_mensagem: message,
        de_nome_tabela: tableName,
        de_tipo: 'geração',
        nu_registro: rows
    }
    return log;
}

function generateSemImpostoMessage(tableName, rows, generatorTableName, routineStart) {
    var message;
    if(!routineStart){
        message = 'Geração através de ' + generatorTableName + '. ' + rows + ' Registros sem imposto gerados.';
    }else{
        message = 'Geração de '+tableName+' sem imposto através de '+generatorTableName+ ' finalizada. Duração: ' + routineStart.fromNow(true);
    }
    var log = {
        de_mensagem: message,
        de_nome_tabela: tableName,
        de_tipo: 'geração',
        nu_registro: rows
    }
    return log;
}
