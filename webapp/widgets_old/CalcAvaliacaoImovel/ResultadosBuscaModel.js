var servico;

var configJson;
var dadosImovel = new Map();
var dadosProprietario = new Map();
var dadosBciTerreno = new Map();
var dadosBciPredial = new Map();

var webserviceJson;

define([
    'require',
    'dojo/io/script'
], 
 function (require) {
    'use strict';

    class ResultadosBuscaModel{

        constructor(stmData, json) {
            servico = stmData;
            configJson = json;
        }

        ordenateDataJson() {
            for (var item in configJson) {
                if (rotulosImovel(item)) {
                    carregaMapaDadosImovel(configJson);
                } else if (rotulosProprietario(item)) { 
                    carregaMapaDadosProprietario(configJson);
                } else if (rotulosBCI(item)) {
                    carregaMapaDadosBCI(configJson)
                } else if (rotulosCaracteristicas(item)) {
                    carregaMapaDadosCaracteristicas(configJson);
                }
            }
            console.info("dados do imovel", dadosImovel);
            console.info("dados do proprietario", dadosProprietario);
            console.info("dados do terreno", dadosBciTerreno);
            console.info("dados do predial", dadosBciPredial);
        }

        getDadosImovel() { 
            return dadosImovel;
        }

        getDadosProprietario() {
            return dadosProprietario;
        }

        getDadosTerreno() {
            return dadosBciTerreno;
        }

        getDadosPredial() {
            return dadosBciPredial;
        }
    }

    return ResultadosBuscaModel;

});


function rotulosImovel(item) {
    return item === "imovelLabels";
}

function rotulosProprietario(item) { 
    return item === "proprietarioLabels";
}

function rotulosBCI(item) {
    return item === "bciLabels";
}

function rotulosCaracteristicas(item) {
    return item === "caracteristicaComponentesLabels";
}

function carregaMapaDadosCaracteristicas(configJson) {
    var dicionario;
    var value;
    var componenteCaracteristicas;
    for (var key in configJson.caracteristicaComponentesLabels) {
        for (var i = 0; i < servico.bci_componentes.length; i++) {
            var itemBCI = servico.bci_componentes[i];
            if (itemBCI.componente_tipo === "Terreno") {
                componenteCaracteristicas = itemBCI.componente_caracteristicas;
                value = findValorJson(key, componenteCaracteristicas);
                dicionario = configJson.caracteristicaComponentesLabels[key];
                dadosBciTerreno.set(dicionario, value);
            } else if (itemBCI.componente_tipo === "Predial") {
                componenteCaracteristicas = itemBCI.componente_caracteristicas;
                value = findValorJson(key, componenteCaracteristicas);
                dicionario = configJson.caracteristicaComponentesLabels[key];
                dadosBciPredial.set(dicionario, value);
            }
        }
    }
}

function carregaMapaDadosBCI(configJson) {
    var dicionario;
    var value;
    for (var key in configJson.bciLabels) {
        for (var i = 0; i < servico.bci_componentes.length; i++) {
            var itemBCI = servico.bci_componentes[i];
            if (itemBCI.componente_tipo === "Terreno") {
                if (key === "testada") {
                    if (itemBCI.testada !== null) {
                        value = itemBCI.testada.tamanho;
                        dicionario = itemBCI.testada.descricao;
                        dadosBciTerreno.set(dicionario, value);
                    }
                } else {
                    value = findValorJson(key, itemBCI);
                    dicionario = configJson.bciLabels[key];
                    dadosBciTerreno.set(dicionario, value);
                }
            } else if (itemBCI.componente_tipo === "Predial") {
                if (key === "testada") {
                    if (itemBCI.testada !== null) {
                        value = itemBCI.testada.tamanho;
                        dicionario = itemBCI.testada.descricao;
                        dadosBciPredial.set(dicionario, value);
                    }
                } else {
                    value = findValorJson(key, itemBCI);
                    dicionario = configJson.bciLabels[key];
                    dadosBciPredial.set(dicionario, value);
                }
            }
        }
    }
}

function carregaMapaDadosImovel(configJson) {
    for (var key in configJson.imovelLabels) {
        var value = findValorJson(key, servico);
        var dicionario = configJson.imovelLabels[key];
        dadosImovel.set(dicionario, value);
    }
}

function carregaMapaDadosProprietario(configJson) {
    for(var key in configJson.proprietarioLabels){
        var value = findValorJson(key, servico);
        var dicionario = configJson.proprietarioLabels[key];
        dadosProprietario.set(dicionario, value);
    }
}

function findValorJson(chave, json) {
    if (json === servico.bci_componentes) {
        for (var item in json) {
            if (item === chave) {
                return json[chave];
            }
        }
    } else if (Array.isArray(json)) {
        for (var i = 0; i < json.length; i++) {
            if (json[i].nome === chave) {
                return json[i].conteudo;
            }
        }
    } else {
        for (var item in json) {
            if (item === chave) {
                return json[chave];
            }
        }
    }
}