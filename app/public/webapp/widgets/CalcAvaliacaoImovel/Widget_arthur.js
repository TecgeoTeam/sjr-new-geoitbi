/* global define $:true */
let selfCalculo;
let resultadosBusca;
let recentsGeocodes = [];
//
let avaliacaoFeitaPor = 0;
let POR_LOTE = 0;
let POR_FACE_DE_QUADRA = 1;

let SETOR_16 = "16";

let TIPO_DO_IMOVEL_PREDIAL_STR = 'Predial';
let TIPO_DO_IMOVEL_TERRENO_STR = 'Terreno';

let SEM_PAVIMENTACAO = 0;
let COM_PAVIMENTACAO = 1;

let NAO_TEM = 'não tem';

let NAO_PRREENCHIDO = 'Não preenchido';

let LEVEL_ZOOM_LOTE = 21;
let LEVEL_ZOOM_FACE_QUADRA = 19;
let LEVEL_ZOOM_CIRCULO = 10;


let testada;
let TipoDoImovel;
let areaConst;
//let tipologia;
let qtdePavimentos;
let padraoConserv;

let idadeImovel;
let pavimentacao;
let valorMinimo;
let valorMedio;
let valorMaximo;

let bloco;
let rendaSetor;
let limiteSuperior;
let limiteInferior;
let zonaUrbana;

let plantaDeValor;
let codigoSetor;
let centroidX;
let centroidY;
let valoresTerreno;
let valoresGeral;
let valoresPredial;
let valores;
let valoresCalculados;
let valorTerrenoCalculado;
let valorTerrenoFinal;
let idadeImovelCalc = 0;

var r8n;

define(
    [
        'dojo/_base/declare',
        'jimu/BaseWidget',
        'dojo/_base/xhr',
        'dojo/_base/array',
        'dojo/dom-class',
        'dojo/dom-style',
        'dojo/touch',
        'dojo/on',
        'dojo/keys',
        'dojo/_base/lang',
        'dojox/widget/Toaster',
        'esri/dijit/ColorPicker',
        'esri/map',
        'esri/SpatialReference',
        'esri/layers/FeatureLayer',
        'esri/symbols/SimpleMarkerSymbol',
        'esri/tasks/query',
        'esri/tasks/QueryTask',
        'esri/symbols/SimpleFillSymbol',
        'esri/symbols/SimpleLineSymbol',
        'esri/geometry/Circle',
        'esri/geometry/Point',
        'esri/geometry/Extent',
        'esri/units',
        'esri/Color',
        'esri/graphic',
        'esri/config',
        'esri/tasks/BufferParameters',
        'esri/tasks/GeometryService',
        'util/DocumentUtil.js',
        'xstyle/css!./css/style.css',
        'widgets/CalcAvaliacaoImovel/ResultadosBuscaModel.js',
        'widgets/CalcAvaliacaoImovel/exportsObjectsResultCalculo.js'
    ],
    function (
        declare,
        BaseWidget,
        xhr,
        array,
        domClass,
        domStyle,
        touch,
        on,
        keys,
        lang,
        Toaster,
        ColorPicker,
        map,
        SpatialReference,
        FeatureLayer,
        SimpleMarkerSymbol,
        Query,
        QueryTask,
        SimpleFillSymbol,
        SimpleLineSymbol,
        Circle,
        Point,
        Extent,
        Units,
        Color,
        Graphic,
        esriConfig,
        BufferParameters,
        GeometryService,
        DocumentUtil,
        template,
        resultadosBuscaModel,
        exportsObjectsResultCalculo) {
        // To create a widget, you need to derive from BaseWidget.
        //  ATUALMENTE O CÓDIGO SÓ FUNCIONA NO CHROME - FAZER!!

        return declare([BaseWidget], {
            // Custom widget code goes here
            templateString: template,
            baseClass: 'jimu-widget-CalcAvaliacaoImovel',
            postCreate: function () {
                selfCalculo = this;
                // window.esriMap = this.map;
                let mainDivEditar = document.getElementById('main-page');
                let dialogDivEditar = document.createElement('dialog');
                dialogDivEditar.id = 'myWidgetDialogCalculo';
                mainDivEditar.appendChild(dialogDivEditar);
                dialogDivEditar.setAttribute('class', 'jimu-widget-tecgeo');
                $('#myWidgetDialogCalculo').load('widgets/CalcAvaliacaoImovel/dialog.html');

                $.get("http://172.16.32.46:1010/r8n", function(data, status){
                    console.log(data[0]);
                     r8n = data[0].nu_valor
                 });

            },
            startup: function () {
                activeBuscarCalculo();
                $(document).ready(function () {
                    $('.money').mask('000.000.000.000.000,00', {
                        reverse: true
                    });
                    $('.money2').mask('#.##0,00', {
                        reverse: true
                    });
                    $('#geocode').focusin(function () {
                        let geo0 = localStorage.getItem('Inscrição 0');
                        let geo1 = localStorage.getItem('Inscrição 1');
                        let geo2 = localStorage.getItem('Inscrição 2');
                        let geo3 = localStorage.getItem('Inscrição 3');
                        let geo4 = localStorage.getItem('Inscrição 4');
                        let geo5 = localStorage.getItem('Inscrição 5');
                        let geo6 = localStorage.getItem('Inscrição 6');
                        let geocodes = [geo0, geo1, geo2, geo3, geo4, geo5, geo6];
                        hinter(event, geocodes);
                    });
                });
                if (localStorage["ngStorage-insc"]) {

                    let inscr = localStorage["ngStorage-insc"].replace(/"/g, '');
                    let input = document.getElementById('geocode');
                    input.value = inscr;
                    input.disabled = true;
                    setTimeout(function () { document.getElementById('searchImovelButton').disabled = true; }, 1000);
                    this.searchImovel();
                }
            },
            buttonAction: function () {
                let element = document.getElementById('myWidgetDialogCalculo');
                if (element.hasAttribute('open')) {
                    element.removeAttribute('open');
                } else {
                    element.setAttribute('open', 'false');
                }
            },
            randomValues: function (valorTerreno, valorEdificacao, total) {
                // var valorBase = Math.floor(Math.random() * 100) + 1;
                let tableDiv = document.getElementById('estimativaTable');
                while (tableDiv.hasChildNodes()) {
                    tableDiv.removeChild(tableDiv.firstChild);
                }
                let tbody = document.createElement('tbody');
                tableDiv.appendChild(tbody);

                let trTitles = document.createElement('tr');
                tbody.appendChild(trTitles);
                let tdTitles = document.createElement('td');
                let textTitles = document.createTextNode('Valor');
                tdTitles.appendChild(textTitles);
                trTitles.appendChild(tdTitles);

                let tdMinimo = document.createElement('td');
                trTitles.appendChild(tdMinimo);
                tdMinimo.setAttribute('class', 'alert alert-success');
                let textMinimo = document.createTextNode('Mínimo');
                tdMinimo.appendChild(textMinimo);

                let tdMedio = document.createElement('td');
                trTitles.appendChild(tdMedio);
                tdMedio.setAttribute('class', 'alert alert-warning');
                let textMedio = document.createTextNode('Médio');
                tdMedio.appendChild(textMedio);

                let tdMaximo = document.createElement('td');
                trTitles.appendChild(tdMaximo);
                tdMaximo.setAttribute('class', 'alert alert-danger');
                let textMaximo = document.createTextNode('Máximo');
                tdMaximo.appendChild(textMaximo);

                let trValorTerreno = document.createElement('tr');
                tbody.appendChild(trValorTerreno);
                let tdValorTerreno = document.createElement('td');
                trValorTerreno.appendChild(tdValorTerreno);
                tdValorTerreno.setAttribute('class', 'td-gray');
                let textValorTerreno = document.createTextNode('Terreno');
                tdValorTerreno.appendChild(textValorTerreno);

                let tdValorTerrenoMinimo = document.createElement('td');
                trValorTerreno.appendChild(tdValorTerrenoMinimo);
                tdValorTerrenoMinimo.setAttribute('class', 'alert alert-success');
                let textValorTerrenoMinimo = document.createTextNode(valorTerreno.minimo);
                tdValorTerrenoMinimo.appendChild(textValorTerrenoMinimo);

                let tdValorTerrenoMedio = document.createElement('td');
                trValorTerreno.appendChild(tdValorTerrenoMedio);
                tdValorTerrenoMedio.setAttribute('class', 'alert alert-warning');
                let textValorTerrenoMedio = document.createTextNode(valorTerreno.medio);
                tdValorTerrenoMedio.appendChild(textValorTerrenoMedio);

                let tdValorTerrenoMaximo = document.createElement('td');
                trValorTerreno.appendChild(tdValorTerrenoMaximo);
                tdValorTerrenoMaximo.setAttribute('class', 'alert alert-danger');
                let textValorTerrenoMaximo = document.createTextNode(valorTerreno.maximo);
                tdValorTerrenoMaximo.appendChild(textValorTerrenoMaximo);

                let trValorConstrucao = document.createElement('tr');
                tbody.appendChild(trValorConstrucao);
                let tdValorConstrucao = document.createElement('td');
                trValorConstrucao.appendChild(tdValorConstrucao);
                tdValorConstrucao.setAttribute('class', 'td-gray');
                let textValorConstrucao = document.createTextNode('Edificação');
                tdValorConstrucao.appendChild(textValorConstrucao);

                let tdValorConstrucaoMinimo = document.createElement('td');
                trValorConstrucao.appendChild(tdValorConstrucaoMinimo);
                tdValorConstrucaoMinimo.setAttribute('class', 'alert alert-success');
                let textValorConstrucaoMinimo = document.createTextNode(valorEdificacao);
                tdValorConstrucaoMinimo.appendChild(textValorConstrucaoMinimo);

                let tdValorConstrucaoMedio = document.createElement('td');
                trValorConstrucao.appendChild(tdValorConstrucaoMedio);
                tdValorConstrucaoMedio.setAttribute('class', 'alert alert-warning');
                let textValorConstrucaoMedio = document.createTextNode(valorEdificacao);
                tdValorConstrucaoMedio.appendChild(textValorConstrucaoMedio);

                let tdValorConstrucaoMaximo = document.createElement('td');
                trValorConstrucao.appendChild(tdValorConstrucaoMaximo);
                tdValorConstrucaoMaximo.setAttribute('class', 'alert alert-danger');
                let textValorConstrucaoMaximo = document.createTextNode(valorEdificacao);
                tdValorConstrucaoMaximo.appendChild(textValorConstrucaoMaximo);

                let trTotal = document.createElement('tr');
                tbody.appendChild(trTotal);
                let tdTotal = document.createElement('td');
                trTotal.appendChild(tdTotal);
                tdTotal.setAttribute('class', 'td-gray');
                let textTotal = document.createTextNode('Total');
                tdTotal.appendChild(textTotal);

                let tdTotalMinimo = document.createElement('td');
                trTotal.appendChild(tdTotalMinimo);
                tdTotalMinimo.setAttribute('class', 'alert alert-success');
                let textTotalMinimo = document.createTextNode(total.minimo);
                tdTotalMinimo.appendChild(textTotalMinimo);

                let tdTotalMedio = document.createElement('td');
                trTotal.appendChild(tdTotalMedio);
                tdTotalMedio.setAttribute('class', 'alert alert-warning');
                let textTotalMedio = document.createTextNode(total.medio);
                tdTotalMedio.appendChild(textTotalMedio);

                let tdTotalMaximo = document.createElement('td');
                trTotal.appendChild(tdTotalMaximo);
                tdTotalMaximo.setAttribute('class', 'alert alert-danger');
                let textTotalMaximo = document.createTextNode(total.maximo);
                tdTotalMaximo.appendChild(textTotalMaximo);
            },
            searchImovel: function ()
            {
                DocumentUtil.showSpinner(true);
                selfCalculo.clearGraphics(true);
                selfCalculo.getDataFromStm(function (err, stmData){
                    if (err || !stmData){
                        if (err){
                            DocumentUtil.showSpinner(false);
                            DocumentUtil.showMessage('warning', 'Não foi possível se comunicar com o STM!', true, null, 'comunicacaoStmError');
                        }
                        if (!stmData){
                            DocumentUtil.showSpinner(false);
                            DocumentUtil.showMessage('warning', 'A inscrição imobiliária informada não foi localizada no Cadastro (STM)!', true, null, 'comunicacaoStmNull');
                        }
                    } else {
                        let geocode = document.getElementById('geocode').value;
                        selfCalculo.geocodeSelect = geocode;
                        selfCalculo.fillStmData(stmData);
                        saveGeocodeInArray(geocode);
                        activeCalculoLimpar();
                        selfCalculo.searchTableLote(function (tableLoteFeature){
                            valores = selfCalculo.getValoresParaCalculo(stmData);
                            if (valores && valores.isPredial){
                                let refCadastral = stmData.imovel_ref_cadastral;
                                let inscricao = refCadastral.replace(/[^\d]+/g, '');
                                let setorQuadra = inscricao.substring(2, 8);
                                let sqcodlog;
                                if (!stmData.imovel_codigo_logradouro){
                                    DocumentUtil.showSpinner(false);
                                    DocumentUtil.showMessage('warning', 'AVISO: Não é possível realizar o cálculo. O imóvel não possui em seu cadastro, um código do logradouro válido. Verifique o cadastro do imóvel.', true, null, 'buscaLogradouroError');
                                }
                                if (stmData.imovel_codigo_logradouro.length >= 6){
                                    sqcodlog = setorQuadra + stmData.imovel_codigo_logradouro;
                                } else {
                                    sqcodlog = setorQuadra + "0" + stmData.imovel_codigo_logradouro;
                                }
                                    
                                if (stmData.bci_componentes["0"].testada === null){
                                    selfCalculo.searchPlantaDeValores(stmData.bci_componentes["1"].testada.tamanho, sqcodlog, stmData.bci_componentes["0"].componente_area, valores);
                                } else {
                                    selfCalculo.searchPlantaDeValores(stmData.bci_componentes["0"].testada.tamanho, sqcodlog, stmData.bci_componentes["0"].componente_area, valores);
                                }
                                //selfCalculo.searchPlantaDeValores(tableLoteFeature.attributes['TESTADA_T1'], tableLoteFeature.attributes['de_cod_sqcodlog'], tableLoteFeature.attributes['AREA_TERRENO'], valores);
                            } else if (valores && !valores.isPredial){
                                let refCadastral = stmData.imovel_ref_cadastral;
                                inscricao = refCadastral.replace(/[^\d]+/g, '');
                                setorQuadra = inscricao.substring(2, 8);
                                 
                                if (stmData.imovel_codigo_logradouro.length >= 6){
                                    sqcodlog = setorQuadra + stmData.imovel_codigo_logradouro;
                                } else {
                                    sqcodlog = setorQuadra + "0" + stmData.imovel_codigo_logradouro;
                                }
                                testada = stmData.bci_componentes["0"].testada.tamanho;

                                if (stmData.bci_componentes["0"].testada === null){
                                    selfCalculo.searchPlantaDeValores(stmData.bci_componentes["1"].testada.tamanho, sqcodlog, stmData.bci_componentes["0"].componente_area, valores);
                                } else {
                                    selfCalculo.searchPlantaDeValores(stmData.bci_componentes["0"].testada.tamanho, sqcodlog, stmData.bci_componentes["0"].componente_area, valores);
                                }
                                //selfCalculo.searchPlantaDeValores(tableLoteFeature.attributes['TESTADA_T1'], tableLoteFeature.attributes['de_cod_sqcodlog'], tableLoteFeature.attributes['AREA_TERRENO'], valores);
                            }
                        });
                        selfCalculo.searchLote(3857, function(loteFeature){
                            selfCalculo.map.graphics.clear();
                            // selfCalculo.map.setExtent(result.features[0].geometry.getExtent(), true);
                            let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID,
                                    new Color([0, 255, 255]), 3),
                                new Color([0, 255, 255, 0.6]));
                            if (loteFeature){
                                let graphic = new Graphic(loteFeature.geometry, symbol);
                                graphic.setSymbol(symbol);
                                selfCalculo.map.graphics.add(graphic);
                                selfCalculo.searchGeocodeUnidade(loteFeature, stmData);
                                /*selfCalculo.searchGeocodeUnidade(loteFeature, stmData, function(result){
                                    if (result.features[0]){
                                        let coordZoomLote = loteFeature.geometry.getCentroid();
                                        selfCalculo.map.centerAndZoom(coordZoomLote, ZOOM_LOTE);
                                    } 

                                });*/
                            }
                                //selfCalculo.map.setExtent(loteFeature.geometry.getExtent());
                                

                            //{
                                //selfCalculo.searchFaceDeQuadra(3857, function (buscarFeatureDafaceDaQuadra); // localizar por face

                            //    DocumentUtil.showMessage('warning', 'AVISO: Não foi encontrado um lote na cartografia para a inscrição informada. Importante que o departamento responsável atualize o lote na cartografia. Para  avaliar este imóvel, o sistema utilizou as coordenadas de centro da face de quadra da qual se localiza o imóvel.', true, null, 'buscaGeometriaError');
                            //}
                            DocumentUtil.showSpinner(false);
                        });
                    }
                });
            },
            searchLote: function (wkid, callback) {
                if (!wkid) {
                    wkid = 3857;
                }
                let geocode = document.getElementById('geocode').value;
                let setor = geocode.substring(2, 4);
                let serviceUrl = null;
                let layerFieldName = null;
                let shapeFieldName = null;
                // REALIZAR MAIS TESTES
                if (setor !== '07' && setor !== '08' && setor !== '11' && setor !== '10') {
                    serviceUrl = selfCalculo.config.loteNPServiceUrl;
                    layerFieldName = 'sl_cadastro.SDE.TB_LOTES.DE_GEOCODE_LOTE';
                    shapeFieldName = 'sl_cadastro.SDE.Lote_Nao_Prioritario_v04.Shape';
                } else {
                    serviceUrl = selfCalculo.config.loteServiceUrl;
                    layerFieldName = 'sl_cadastro.SDE.TB_LOTES.DE_GEOCODE_LOTE';
                    shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';
                }

                let geocodeLote = geocode.substring(2, 12);
                let queryLote = new Query();
                let queryTaskLote = new QueryTask(serviceUrl);
                queryLote.returnGeometry = true;
                queryLote.outFields = [layerFieldName, shapeFieldName, 'sl_cadastro.SDE.TB_LOTES.DE_COD_SQCODLOG', 'sl_cadastro.SDE.TB_LOTES.NU_AREA_TERRENO'];
                queryLote.outSpatialReference = {
                    wkid: wkid
                };
                queryLote.where = layerFieldName + ' = ' + "'" + geocodeLote + "'";
                queryTaskLote.execute(queryLote, showResults);

                function showResults(result) {                    
                    if (result.features[0]) {
                        let zoom_Lote = result.features[0].geometry.getPoint(0, 0);   
                        selfCalculo.map.centerAndZoom(zoom_Lote, LEVEL_ZOOM_LOTE);
                       //selfCalculo.map.setExtent(result.features[0].geometry.getExtent(), true);
                       //selfCalculo.map.setExtent(selfCalculo.map.extent, true);
                        callback(result.features[0]);
                    } else {
                        result.outSpatialReference = {
                            wkid: wkid
                        };
                        callback(result);
                    }
                       // DocumentUtil.showMessage('warning', 'AVISO: Não foi encontrado um lote na cartografia que contenha a inscrição informada.' +
                       // Importante que o departamento responsável atualize o lote na cartografia.', true, null, 'buscaGeometriaError');                   
                }
            },
            searchTableLote: function (callback) {
                let geocode = document.getElementById('geocode').value;
                let geocodeLote = geocode.substring(2, 12);
                let serviceUrl = selfCalculo.config.tableLoteServiceUrl;
                let layerFieldName = 'DE_GEOCODE_LOTE';

                let queryBuscaLote = new Query();
                let queryTaskBuscaLote = new QueryTask(serviceUrl);
                queryBuscaLote.returnGeometry = true;
                //query.outFields = [layerFieldName, 'de_cod_sqcodlog', 'AREA_TERRENO', 'TESTADA_T1'];
                // VER QUAL OS CAMPOS QUE SERÃO NECESSÁRIOS NO CALCULO
                // COLOCAR SÓ OS CAMPOS NECESSÁRIOS
                queryBuscaLote.outFields = ['*'];
                queryBuscaLote.outSpatialReference = {
                    wkid: 3857
                };
                queryBuscaLote.where = layerFieldName + ' = ' + "'" + geocodeLote + "'";
                queryTaskBuscaLote.execute(queryBuscaLote, showResults);

                function showResults(result) {
                    if (result.features[0]) {
                        callback(result.features[0]);
                    } else {
                        callback(result);
                        // CALLBACK QUE MOSTRA UM LOTE SEM TESTADA PRINCIPAL
                        //DocumentUtil.showMessage('warning', 'Não foi possível buscar dados na tabela do lote!', true, null, 'buscaTableLoteError');
                    }
                }
            },
            searchPlantaDeValores: function (testada, sqcodlog, areaDoTerreno, valores){
                if (sqcodlog && areaDoTerreno){
                    valoresTerreno = valores.terreno;
                    valoresPredial = valores.predial;
                    valoresGeral = valores;

                    areaDoTerreno = Number(valoresTerreno.area.replace(',', '.'));

                    let valorTerrenoMinimo = 0;
                    let valorTerrenoMedio = 0;
                    let valorTerrenoMaximo = 0;

                    let serviceUrl = selfCalculo.config.plantaQuadraServiceUrl;
                    let layerFieldName = 'sl_cadastro.SDE.ln_Planta_de_Valores.de_SQCODLOG';

                    let queryPlanta = new Query();
                    let queryTaskPlanta = new QueryTask(serviceUrl);
                    queryPlanta.returnGeometry = true;
                    queryPlanta.outFields = ['*'];
                    queryPlanta.outSpatialReference = {wkid: 3857}; //31983};
                    queryPlanta.where = layerFieldName + ' = ' + "'" + sqcodlog + "' AND sl_cadastro.SDE.ln_Planta_de_Valores.de_n_face = '01'";
                    queryTaskPlanta.execute(queryPlanta, showResults);
                } 
                function showResults(resultFaceDeQuadra){
                    let AplicaSimbologiaFaceQuadra;
                    let graphic;
                    avaliacaoFeitaPor = POR_LOTE;
                    if (resultFaceDeQuadra.features.length > 0) { // encontrou face de quadra
                        plantaDeValor = resultFaceDeQuadra.features[0].attributes;
                        codigoSetor = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_n_setor"];
                        selfCalculo.searchLote(31983, function (loteResult){
                            if (loteResult.geometry) { // geometria do lote encontrada . Está em UTM
                                avaliacaoFeitaPor = POR_LOTE;
                                let centroid = loteResult.geometry.getCentroid();
                                coordX = centroid.x;
                                coordY = centroid.y;                                                        
                                selfCalculo.executaCalculo(areaDoTerreno, coordX, coordY);                               
                            }else{
                                if (resultFaceDeQuadra.features[0].geometry) { // calculo será feito por face de quadra
                                    avaliacaoFeitaPor = POR_FACE_DE_QUADRA;
                                    AplicaSimbologiaFaceQuadra = new 
                                        esri.symbol.SimpleFillSymbol(esri.symbol.SimpleFillSymbol.STYLE_NULL,
                                        new esri.symbol.SimpleLineSymbol(esri.symbol.SimpleLineSymbol.STYLE_DASHDOT,
                                        new esri.Color([0, 255, 255]), 4), new esri.Color([255, 255, 0, 0.25]));
                                    graphic = new 
                                        Graphic(resultFaceDeQuadra.features[0].geometry, AplicaSimbologiaFaceQuadra);
                                    graphic.setSymbol(AplicaSimbologiaFaceQuadra);
                                    selfCalculo.map.graphics.add(graphic);

                                    let coordFace = resultFaceDeQuadra.features[0].geometry.getPoint(0, 0);   
                                    selfCalculo.map.centerAndZoom(coordFace, LEVEL_ZOOM_FACE_QUADRA);
                                                               
                                    if (codigoSetor == SETOR_16){
                                        let queryTaskEstaNoSetor161 = new QueryTask(selfCalculo.config.geometryServerSetor16Url);
                                        let queryPontoEstaNoSetor161 = new Query();
                                        queryPontoEstaNoSetor161.geometry = resultFaceDeQuadra.features[0].geometry;
                                        queryPontoEstaNoSetor161.returnGeometry = true;
                                        queryPontoEstaNoSetor161.outFields = ['*'];
                                        queryPontoEstaNoSetor161.spatialRelationship = Query.SPATIAL_REL_INTERSECTS;
                                        queryPontoEstaNoSetor161.outSpatialReference = {wkid: 3857};//31983};//{wkid: 3857};
                                        queryTaskEstaNoSetor161.execute(queryPontoEstaNoSetor161).then(function(resultsSetor16){
                                            if (resultsSetor16) {
                                                if (resultsSetor16.features[0]) {
                                                    setorDentroSetor161 = true;                                            
                                                } else {
                                                  setorDentroSetor161 = false;  
                                                }
                                            } else {
                                                setorDentroSetor161 = false;
                                            }
                                             //transofrmar geometria em utm para calcular o centro da face erepassar para o calculo
                                            selfCalculo.geometriaDaFaceEmUTM(resultFaceDeQuadra.features[0], function(face){
                                                if (face){
                                                    let geometriaDaFace = face.features[0].geometry;
                                                    let extentDaFaceUTM = geometriaDaFace.getExtent();
                                                    coordX = (extentDaFaceUTM.xmin + extentDaFaceUTM.xmax) / 2;
                                                    coordY = (extentDaFaceUTM.ymin + extentDaFaceUTM.ymax) / 2;
                                                    selfCalculo.executaCalculo(areaDoTerreno, coordX, coordY);
                                                }
                                            });
                                        });
                                    }
                                    else{
                                        //não está no setor 16
                                        //transofrmar geometria em utm para calcular o centro da face erepassar para o calculo
                                        selfCalculo.geometriaDaFaceEmUTM(resultFaceDeQuadra.features[0], function(face){
                                            if (face){
                                                let geometriaDaFace = face.features[0].geometry;
                                                let extentDaFaceUTM = geometriaDaFace.getExtent();
                                                coordX = (extentDaFaceUTM.xmin + extentDaFaceUTM.xmax) / 2;
                                                coordY = (extentDaFaceUTM.ymin + extentDaFaceUTM.ymax) / 2;
                                                selfCalculo.executaCalculo(areaDoTerreno, coordX, coordY);                                          
                                            }
                                            else{
                                                // não encontrou face de quadra
                                                selfCalculo.valoresCalculados = {};
                                                DocumentUtil.showSpinner(false);
                                                DocumentUtil.showMessage('info', 'ATENÇÃO: Não foi possível encontrar uma correspondênica entre o imóvel' +  
                                                ' informado e uma face de quadra na planta de valores! Verifique se o logradouro do' + 
                                                ' imóvel (código Logr.:' + sqcodlog.substring(6, 12) + ') é  mesmo código utilizado na planta de' + 
                                                ' valores da cartografia.', true, null, 'realizarCalculoError');                                            
                                            }
                                        });
                                    }
                                }                        
                                else{

                                    // não encontrou face de quadra
                                    selfCalculo.valoresCalculados = {};
                                    DocumentUtil.showSpinner(false);
                                    DocumentUtil.showMessage('info', 'ATENÇÃO: Não foi possível encontrar uma correspondênica entre o imóvel' +  
                                    ' informado e uma face de quadra na planta de valores! Verifique se o logradouro do' + 
                                    ' imóvel (código Logr.:' + sqcodlog.substring(6, 12) + ') é  mesmo código utilizado na planta de' + 
                                    ' valores da cartografia.', true, null, 'realizarCalculoError');
                                }        
                            }
                        });
                    }
                    else
                    {
                        //não encontrou uma face de quadra
                        selfCalculo.valoresCalculados = {};
                        DocumentUtil.showSpinner(false);
                        DocumentUtil.showMessage('info', 'ATENÇÃO: Não foi possível encontrar uma correspondênica entre o imóvel' +  
                            ' informado e uma face de quadra da planta de valores! Verifique se o logradouro do' + 
                            ' imóvel (código Logr.:' + sqcodlog.substring(6, 12) + ') é  mesmo código utilizado na planta de' + 
                            ' valores da cartografia.', true, null, 'realizarCalculoError');
                    }
                }
            },
            geometriaDaFaceEmUTM: function(featureDaFace, callback){
                // Retorna um featureSet com a geometria da face de quadra em coordenadas UTM
                // O zoom e a simbologia é feito em coordenadas WebMercator, mas para realizar
                // o cálculo é necessário que as coordenadas sejam em UTM
                let serviceUrlPlanta = selfCalculo.config.plantaQuadraServiceUrl;
                let queryPlanta = new Query();
                let queryTaskPlanta = new QueryTask(serviceUrlPlanta);
                queryPlanta.returnGeometry = true;
                queryPlanta.outFields = ['*'];
                queryPlanta.outSpatialReference = {wkid: 31983};
                queryPlanta.objectIds = [featureDaFace.attributes["sl_cadastro.SDE.ln_Planta_de_Valores.OBJECTID"]];
                //queryPlanta.where = "sl_cadastro.SDE.ln_Planta_de_Valores.OBJECTID = " + featureDaFace.attributes["sl_cadastro.SDE.ln_Planta_de_Valores.OBJECTID"]; //    attributes['sl_cadastro.SDE.TB_FACE_DE_QUADRA.OBJECTID']; // "sl_cadastro.SDE.ln_Planta_de_Valores.OBJECTID"
                queryTaskPlanta.execute(queryPlanta).then(function(result){
                    if (result.features[0]){
                        callback(result);
                    } else {
                        callback(null);
                    }
                });
            },
            executaCalculo: function (areaDoTerreno, coordX, coordY){
                if (!testada){
                    testada = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Med_Testa"];
                }
                TipoDoImovel = valoresGeral.isPredial;
                if (TipoDoImovel === false){
                    areaConst = 0;
                    padraoConserv = 7;
                    tipologia = 1;
                    idadeImovel = 0;
                    pavimentacao = COM_PAVIMENTACAO;
                }else {
                    areaConst = valoresPredial.areaConstruida;
                    padraoConserv = valoresPredial.conservacao;
                    tipologia = valoresPredial.tipologia;
                    idadeImovel = valoresPredial.idade;
                    pavimentacao = valoresPredial.pavimentacao;
                }
                valorMinimo = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Inf"];
                valorMedio = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Val_Unit2"];
                valorMaximo = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Sup"];                
                bloco = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_grupo"];
                rendaSetor = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Renda_V003"];
                limiteSuperior = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Sup"];
                limiteInferior = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Inf"];
                zonaUrbana = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_zonas"];

                valorTerrenoCalculado = calcularValorMetroQuadrado(
                    coordY,
                    coordX,
                    areaDoTerreno,
                    pavimentacao,
                    testada,
                    rendaSetor,
                    areaConst,
                    padraoConserv,
                    tipologia,
                    idadeImovel,
                    valoresTerreno.drenagem,
                    valoresTerreno.esgoto,
                    valoresTerreno.topografia,
                    bloco,
                    codigoSetor,
                    zonaUrbana,
                    TipoDoImovel
                );
                if (valoresGeral.predial){
                    if (valoresGeral.predial.fracaoIdeal){
                        let areater = areaDoTerreno;
                        areaDoTerreno = areater * valoresGeral.predial.fracaoIdeal;
                    }
                }
                selfCalculo.valorDoMetroQuadrado = valorTerrenoCalculado;
                valorTerrenoMinimo = (areaDoTerreno * valorTerrenoCalculado) * 0.85;
                valorTerrenoMedio = areaDoTerreno * valorTerrenoCalculado;
                valorTerrenoMaximo = (areaDoTerreno * valorTerrenoCalculado) * 1.15;
                let valorEdificacao = 0;
                if (valores.isPredial){
                    valorEdificacao = selfCalculo.getValorDaEdificacao(
                        valores.predial.tipologia,
                        valores.predial.padrao,
                        valores.predial.areaConstruida,
                        valores.predial.idade,
                        valores.predial.conservacao,
                        valores.predial.estrutura);
                }else{
                    valorEdificacao = 0;
                }
                let total =
                {
                    minimo: valorEdificacao + valorTerrenoMinimo,
                    medio: valorEdificacao + valorTerrenoMedio,
                    maximo: valorEdificacao + valorTerrenoMaximo
                };
                selfCalculo.minimoTerceiraAvaliacao = valorEdificacao + valorTerrenoMinimo;
                valorEdificacao = numberParaReal(valorEdificacao);
                total.minimo = numberParaReal(total.minimo);
                total.medio = numberParaReal(total.medio);
                total.maximo = numberParaReal(total.maximo);
                valorTerrenoMinimo = numberParaReal(valorTerrenoMinimo);
                valorTerrenoMedio = numberParaReal(valorTerrenoMedio);
                valorTerrenoMaximo = numberParaReal(valorTerrenoMaximo);
                valorTerreno = {
                        minimo: valorTerrenoMinimo,
                        medio: valorTerrenoMedio,
                        maximo: valorTerrenoMaximo
                };
                selfCalculo.valoresCalculados = {
                    valorTerrenoFinal: valorTerreno,
                    valorEdificacao: valorEdificacao,
                    total: total
                };
                if (valorTerreno.minimo === 'NaN') { 
                    valorTerreno =
                        {
                            minimo: 0,
                            medio: 0,
                            maximo: 0
                        };
                    valorEdificacao = 0;
                    selfCalculo.valoresCalculados.total.minimo = 0;
                    selfCalculo.valoresCalculados.total.medio = 0;
                    selfCalculo.valoresCalculados.total.maximo = 0;
                }
                let buttons = [
                    {
                        label: 'Cálculo Resumido',
                        attributes: {
                            class: 'btn btn-primary exportarcalculo',
                            style: 'margin-top: -26px;',
                            onclick: 'selfCalculo.exportResultCalculo("Resumido")'
                    }
                    },
                   
                    {
                        label: 'Cálculo Detalhado',
                        attributes: {
                            class: 'btn btn-primary exportarcalculo',
                            style: 'margin-top: -26px; margin-left: 5px;',
                           onclick: 'selfCalculo.exportResultCalculo()'
                    }

                }];
                selfCalculo.randomValues(valorTerreno, valorEdificacao, total);
                if (avaliacaoFeitaPor === POR_FACE_DE_QUADRA){
                    DocumentUtil.showSpinner(false);
                    DocumentUtil.showMessage('warning', 'CÁLCULO REALIZADO COM SUCESSO! OBS:' + 
                        'Não foi encontrado um lote na cartografia para a inscrição informada e isso não ' + 
                        'impede que seja feito o cálculo. Importante que o departamento responsável atualize' + 
                        ' o lote na cartografia. Para  avaliar este imóvel, o sistema utilizou as coordenadas' + 
                        ' de centro da face de quadra onde se localiza o imóvel.', true, null, 'buscaGeometriaError');
                    DocumentUtil.showMessageWithButton(buttons, 'info', 'CÁLCULO REALIZADO COM SUCESSO!!', true, null, 'calculoSucesso');
                    // return true;
                }
                else {
                    DocumentUtil.showSpinner(false);
                    DocumentUtil.showMessage('warning', 'CALCULO REALIZADO COM SUCESSO!' + 
                        ' OBS: O cálculo foi realizado com o uso da localização geográfica do lote existente' + 
                        ' na cartografia.', true, null, 'buscaGeometriaError');
                    DocumentUtil.showMessageWithButton(buttons, 'info', 'CÁLCULO REALIZADO COM SUCESSO!!', true, null, 'calculoSucesso');
                   //return true;
                }
                //activeVisualizarMapa(true);
            },
            getValoresParaCalculo: function (data, callback){
                let stmServiceUrl = selfCalculo.config.stmServiceUrl;
                let geocode = document.getElementById('geocode').value;
                let url = stmServiceUrl + geocode;
                valoresTerreno = {};
                //salva ID do imovel para post da terceira avaliacao
                selfCalculo.idImovel = data.imovel_id;
                if (data) {
                    let padrao;
                    let areaConstruida;
                    //let idade = data.imovel_idade;
                    var dataAgora = new Date();
                    let conservacao;
                    let estrutura;
                    let isPredial = false;
                    let tipologia;
                    let tempAreaConstruida = [];
                    let usoDoImovel = data.imovel_uso.toLowerCase();
                                      
                    if (usoDoImovel != 'predial'){
                        let anoAtual = dataAgora.getFullYear(); // ano atual
                        let anoAquisicaoImovel =data.proprietario_aquisicao;
                        if (anoAquisicaoImovel != null){
                            idade = anoAtual - anoAquisicaoImovel; // calcula idade do imóvel
                        }
                    }
                   
                    for (let i = 0; i < data.bci_componentes.length; i++){
                        let bci_componentes = data.bci_componentes[i];

                        //recuperar o ano de aquisição do imóvel ou de construção do predial
                        // quando for territorial o ano deve ser pego de proprietário_aquisicao;
                         if (usoDoImovel === 'predial'){
                            if (bci_componentes.componente_tipo.toLowerCase() === usoDoImovel){
                                let anoAtual = dataAgora.getFullYear(); // ano atual
                                let anoAquisicaoImovel = bci_componentes.componente_ano;
                                if (anoAquisicaoImovel != null){
                                    idade = anoAtual - anoAquisicaoImovel; // calcula idade do imóvel
                                }
                            }
                        }             

                        if (bci_componentes.componente_tipo == TIPO_DO_IMOVEL_PREDIAL_STR){
                            tempAreaConstruida.push(parseFloat(bci_componentes.componente_area));
                            areaConstruida = tempAreaConstruida.reduce((a, b) => a + b, 0); // somas as áreas das edificações
                            qtidadePavimentos = bci_componentes.componente_pavimentos;
                            
                            for (let j = 0; j < bci_componentes.componente_caracteristicas.length; j++){
                                let caracteristica = bci_componentes.componente_caracteristicas[j];
                               
                                if (caracteristica.nome === 'TIPOLOGIA')
                                {
                                  tipologia = caracteristica.conteudo.toLowerCase();
                                }
                                if (caracteristica.nome === 'PADRAOCONSTRUCAO')
                                {
                                    padrao = caracteristica.conteudo.toLowerCase();
                                }
                                if (caracteristica.nome === 'CONSERVACAO')
                                {
                                    conservacao = caracteristica.conteudo.toLowerCase();
                                }
                                if (caracteristica.nome === 'ESTRUTURA')
                                {
                                    estrutura = caracteristica.conteudo.toLowerCase();
                                }
                            }
                            isPredial = true;
                            if (tipologia && tipologia.indexOf('ap') !== -1){
                                tipologia = 'apartamento';
                            }

                        } else if (bci_componentes.componente_tipo == TIPO_DO_IMOVEL_TERRENO_STR) {
                            valoresTerreno.area = bci_componentes.componente_area;
                            for (k = 0; k < bci_componentes.componente_caracteristicas.length; k++) {
                                let caracteristicaTerreno = bci_componentes.componente_caracteristicas[k];
                                valoresTerreno.area = bci_componentes.componente_area;
                                if (caracteristicaTerreno.nome === 'ESGOTO') {
                                    valoresTerreno.esgoto = caracteristicaTerreno.conteudo.toLowerCase();
                                }
                                if (caracteristicaTerreno.nome === 'DRENAGEM') {
                                    valoresTerreno.drenagem = caracteristicaTerreno.conteudo.toLowerCase();
                                }
                                if (caracteristicaTerreno.nome === 'TOPOGRAFIA') {
                                    valoresTerreno.topografia = caracteristicaTerreno.conteudo.toLowerCase();
                                }
                                if (caracteristicaTerreno.nome === 'PAVIMENTACAO') {
                                    valoresTerreno.pavimentacao = caracteristicaTerreno.conteudo.toLowerCase();
                                }
                            }
                        }
                    }

                    if (isPredial && (tipologia && padrao && areaConstruida && idade && conservacao)) {
                        let dadosPredial = {
                            tipologia: tipologia,
                            padrao: padrao,
                            areaConstruida: areaConstruida,
                            idade: idade,
                            conservacao: conservacao,
                            estrutura: estrutura,
                            pavimentacao: pavimentacao, 
                            isPredial: isPredial
                        };
                        if (data.imovel_tipo_condominio === 'PCD') {
                            dadosPredial.fracaoIdeal = data.imovel_fracao_ideal;
                        }
                        if (data.imovel_tipo_condominio === 'ECD') {
                            dadosPredial.fracaoIdeal = data.imovel_fracao_ideal;
                        }
                        return {
                            predial: dadosPredial,
                            terreno: valoresTerreno,
                            isPredial: isPredial
                        };
                    } else if (isPredial){
                        dadosPredial = {
                            tipologia: tipologia,
                            padrao: padrao,
                            areaConstruida: areaConstruida,
                            idade: idade,
                            conservacao: conservacao,
                            estrutura: estrutura,
                            pavimentacao: pavimentacao,
                            isPredial: isPredial
                        };
                        if (!tipologia) {
                            dadosPredial.tipologia = NAO_PRREENCHIDO;
                        } else if (!padrao) {
                            dadosPredial.padrao = NAO_PRREENCHIDO;
                        } else if (!areaConstruida) {
                            dadosPredial.areaConstruida = NAO_PRREENCHIDO;
                        } else if (!idade) {
                            dadosPredial.idade = NAO_PRREENCHIDO;
                        } else if (!conservacao) {
                            dadosPredial.conservacao = NAO_PRREENCHIDO;
                        }
                        DocumentUtil.showSpinner(false);
                        DocumentUtil.showMessage('info', 'Não foi possível efetuar o cálculo, pois existem atributos do imóvel que não estão preenchidos no STM! Verifique o cadastro do imóvel.' + "\n" +
                            ' Tipologia = ' + dadosPredial.tipologia + '\u00a0' +
                            ' Padrao = ' + dadosPredial.padrao + '\u00a0' +
                            ' Área Construída = ' + dadosPredial.areaConstruida + '\u00a0' +
                            ' Idade = ' + dadosPredial.idade + '\u00a0' +
                            ' Conservação = ' + dadosPredial.conservacao + '\u00a0'
                            , true, null, 'realizarCalculoError');
                        return null;
                    } else {
                        return {
                            isPredial: isPredial,
                            terreno: valoresTerreno
                        };
                    }
                }
            },
            getDataFromStm: function (callback) {
                let stmServiceUrl = selfCalculo.config.stmServiceUrl;
                let geocode = document.getElementById('geocode').value;
                let url = stmServiceUrl + geocode;
                $.getJSON(url, function (data) {
                    data = data[0];
                    callback(null, data);
                }).fail(function (err) {
                    callback(err);
                });
            },
          
            searchGeocodeUnidade: function (featureSelected, stmData, callback) {
                let stmServiceUrl = selfCalculo.config.stmServiceUrl;
                let geocode = document.getElementById('geocode').value;
                let url = stmServiceUrl + geocode;
                let geocodeUnidade = geocode;
                let geocodeUnidade16Char = geocode.substring(0, 16);
  
                let layerFieldName = 'DE_GEOCODE_STM';
                let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';
                let serviceUrl = selfCalculo.config.unidadeServiceUrl;
                let queryBuscaGeocode = new Query();
                let queryTaskBuscaGeocode = new QueryTask(serviceUrl);

                queryBuscaGeocode.returnGeometry = true;
                queryBuscaGeocode.outFields = ['*'];
                queryBuscaGeocode.outSpatialReference = {
                    wkid: 3857
                };
                queryBuscaGeocode.where = layerFieldName + ' = ' + "'" + geocodeUnidade16Char + "'";
                queryTaskBuscaGeocode.execute(queryBuscaGeocode, showResults);
                function showResults(result){
                    if (result.features[0]){
                        selfCalculo.getGeocodeBuffer(featureSelected, result.features[0]);
                    } 
                }
            },
            fillStmData: function (stmData){
                let dadosImovel;
                let dadosProprietario;
                let dadosTerreno;
                let dadosPredial;
                if (stmData) {
                    let configJson = selfCalculo.config;
                    selfCalculo.resultadosBuscaModel(stmData, configJson);
                    dadosImovel = resultadosBusca.getDadosImovel();
                    dadosProprietario = resultadosBusca.getDadosProprietario();
                    dadosTerreno = resultadosBusca.getDadosTerreno();
                    dadosPredial = resultadosBusca.getDadosPredial();
                }
                let tableDiv = document.getElementById('unidadeTable');
                while (tableDiv.hasChildNodes()) {
                    tableDiv.removeChild(tableDiv.firstChild);
                }
                if (stmData) {
                    let tbody = document.createElement('tbody');
                    tableDiv.appendChild(tbody);
                    factoryViewDataSTM("Informações gerais do Imovel", tbody, dadosImovel);
                    factoryViewDataSTM("Informações gerais do Proprietario", tbody, dadosProprietario);
                    factoryViewDataSTM("Informações gerais do Terreno", tbody, dadosTerreno);
                    factoryViewDataSTM("Informações gerais do Predial", tbody, dadosPredial);
                }
            },
            getGeocodeBuffer: function (featureSelected, unidadeSelected) {
                let serviceUrl = selfCalculo.config.loteServiceUrl;
                let gsv = new GeometryService(selfCalculo.config.geometryServerServiceUrl);
                // setup the buffer parameters
                let params = new BufferParameters();
                params.distances = [0.5];
                params.geometries = [featureSelected.geometry.getCentroid()];
                params.outSpatialReference = selfCalculo.map.spatialReference;
                params.unit = GeometryService.UNIT_KILOMETER;
                params.outFields = ['sl_cadastro.SDE.Lote.OBJECTID_1'];
                gsv.buffer(params, showBuffer);
                function showBuffer(bufferedGeometries) {
                    let featureLayer = new FeatureLayer(serviceUrl, {
                        outFields: ['sl_cadastro.SDE.Lote.OBJECTID_1']
                    });
                    let featureSymbol = new SimpleMarkerSymbol(
                        SimpleMarkerSymbol.STYLE_CIRCLE,
                        12,
                        new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_NULL,
                            new Color([247, 34, 101, 0.9]),
                            1
                        ),
                        new Color([207, 34, 171, 0.5])
                    );
                    featureLayer.setSelectionSymbol(featureSymbol);
                    array.forEach(bufferedGeometries, function (circleGeometry) {
                    selfCalculo.circleGeometry = circleGeometry;
                    let circleSymb = new SimpleFillSymbol(
                        SimpleFillSymbol.STYLE_NULL,
                        new SimpleLineSymbol(
                            SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                            new Color([105, 105, 105]),
                            2
                        ), new Color([255, 255, 0, 0.25])
                    );
                    let graphic = new Graphic(circleGeometry, circleSymb);
                    //selfCalculo.map.setExtent(circleGeometry.getExtent(), true);

                    //var zoom_Circulo = circleGeometry.geometry.getCentroid();   
                    let zoom_Circulo = circleGeometry.geometry.getPoint(0, 0); 
                    selfCalculo.map.centerAndZoom(zoom_Circulo, LEVEL_ZOOM_CIRCULO);

                    //  fazer destacar pesquisas dentro do círculo
                    selfCalculo.drawPesquisa(circleGeometry, unidadeSelected);
                    queryGeocodeBuffer = new Query();
                    queryGeocodeBuffer.geometry = circleGeometry.getExtent();
                    queryGeocodeBuffer.outFields = ['sl_cadastro.SDE.Lote.GEOC_RENU', 'sl_cadastro.SDE.TB_LOTES.DE_GEOCODE_LOTE', 'sl_cadastro.SDE.Lote.OBJECTID_1'];
                    // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
                    featureLayer.queryFeatures(queryGeocodeBuffer, selectInBuffer);
                    function selectInBuffer(response) {
                        let feature;
                        let features = response.features;
                        let inBuffer = [];
                        // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
                        for (i = 0; i < features.length; i++) {
                            feature = features[i];
                            if (circleGeometry.contains(feature.geometry.getCentroid())) {
                                inBuffer.push(feature);
                            }
                        // inBuffer.push(feature.attributes[featureLayer.objectIdField]);
                        }
                        selfCalculo.drawSimilar(inBuffer, featureSelected, unidadeSelected);
                        let query = new Query();
                        query.objectIds = inBuffer;
                    }
                    selfCalculo.map.graphics.add(graphic);
                  });
                }
            },
            drawSimilar: function (featureList, featureSelected, unidadeSelected) {
                let count = 0;
                let similarFeatures = [];
                selfCalculo.getTransmissoesWithUnidade(featureList, featureSelected, unidadeSelected, function (transmissoes) {
                    let similarGeocode = [];
                    let similarUnidade = [];
                    let similarSameLote = [];
                    for (i = 0; i < transmissoes.length; i++) {
                        if (transmissoes[i].unidade) {
                            for (f = 0; f < featureList.length; f++) {
                                let hasGeocode = false;
                                let hasUnidade = false;
                                for (g = 0; g < similarGeocode.length; g++) {
                                    if (similarGeocode[g] === transmissoes[i].attributes['de_geocode_lote']) {
                                        hasGeocode = true;
                                    }
                                }
                                for (g = 0; g < similarUnidade.length; g++) {
                                    if (similarUnidade[g] === transmissoes[i].unidade.attributes.de_geocode_stm) {
                                        hasUnidade = true;
                                    }
                                }

                                if (!hasGeocode && (transmissoes[i].attributes['de_geocode_lote'] === featureList[f].attributes['sl_cadastro.SDE.Lote.GEOC_RENU'])) {
                                    if (transmissoes[i].attributes['de_geocode_lote'] === unidadeSelected.attributes['GEOCODE_LOTE']) {
                                        similarSameLote.push(transmissoes[i].unidade.attributes.de_geocode_stm);
                                    } else {
                                        similarFeatures.push(featureList[f]);
                                    }
                                    similarGeocode.push(transmissoes[i].attributes['de_geocode_lote']);
                                }
                                if (!hasUnidade && (transmissoes[i].attributes['de_geocode_lote'] === featureList[f].attributes['sl_cadastro.SDE.Lote.GEOC_RENU'])) {
                                    if (transmissoes[i].attributes['de_geocode_lote'] === unidadeSelected.attributes['GEOCODE_LOTE']) {
                                        similarSameLote.push(transmissoes[i].unidade.attributes.de_geocode_stm);
                                    }
                                    similarUnidade.push(transmissoes[i].unidade.attributes.de_geocode_stm);
                                }
                            }
                        }
                    }

                    if (similarSameLote.length) {

                        DocumentUtil.showMessage('info', 'Foram localizados imóveis com transmissões semelhantes no mesmo lote da inscrição informada. Estes imóveis podem ser usados como referência para fazer comparações.');
                    }

                    // DocumentUtil.showMessage('info', 'Unidades semelhantes: ' + similarUnidade, true, null, 'unidadesSemelhantesMessage');
                    if (similarFeatures) {
                        for (var i = 0; i < similarFeatures.length; i++) {
                            let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 1]), 2), new Color([255, 255, 0, 0.3]));
                            let graphic = new Graphic(similarFeatures[i].geometry, symbol);
                            graphic.setSymbol(symbol);
                            selfCalculo.map.graphics.add(graphic);
                        }
                    } else {
                        DocumentUtil.showMessage('warning', 'Não foram encontrados imóveis com transmissoes semelhantes a este imóvel que possa permitir comparações!', true, null, 'semUnidadeSemelhanteError');
                    }
                });
            },
            drawPesquisa: function (circleGeometry, unidadeSelected) {
                let serviceUrl = selfCalculo.config.pesquisaServiceUrl;
                let layerFieldName = 'Geocode_Correto';
                let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';

                let featureLayer = new FeatureLayer(serviceUrl, {
                    outFields: ['OBJECTID']
                });

                let featureSymbol = new SimpleMarkerSymbol(
                    SimpleMarkerSymbol.STYLE_CIRCLE,
                    12,
                    new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_NULL,
                        new Color([247, 34, 101, 0.9]),
                        1
                    ),
                    new Color([207, 34, 171, 0.5])
                );

                let unidadeSemelhancas = {};

                if (unidadeSelected.attributes.PREDIAL) {
                    unidadeSemelhancas.tipo = selfCalculo.config.pesquisaUnidade.tipo[unidadeSelected.attributes.PREDIAL];
                } else {
                    unidadeSemelhancas.tipo = 'Territorial';
                }

                if (unidadeSelected.attributes.TIPOLOGIA) {
                    unidadeSemelhancas.tipologia = selfCalculo.config.pesquisaUnidade.tipologia[unidadeSelected.attributes.TIPOLOGIA];
                } else {
                    unidadeSemelhancas.tipologia = null;
                }

                if (unidadeSelected.attributes.CONSERVACAO) {
                    unidadeSemelhancas.conservacao = selfCalculo.config.pesquisaUnidade.conservacao[unidadeSelected.attributes.CONSERVACAO];
                } else {
                    unidadeSemelhancas.conservacao = null;
                }

                featureLayer.setSelectionSymbol(featureSymbol);
                let queryDrawPesquisa = new Query();
                queryDrawPesquisa.geometry = circleGeometry.getExtent();
                queryDrawPesquisa.outFields = ['*'];
                // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
                featureLayer.queryFeatures(queryDrawPesquisa, selectInBuffer);

                function selectInBuffer(response) {
                    let feature;
                    let features = response.features;
                    let inBuffer = [];
                    // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
                    for (var i = 0; i < features.length; i++) {
                        feature = features[i];

                        let pesquisaSemelhancas = {};
                        if (feature.attributes.de_Tipo_do_Imovel != null){
                            if (feature.attributes.de_Tipo_do_Imovel.trim()) {
                                pesquisaSemelhancas.tipo = feature.attributes.de_Tipo_do_Imovel;
                            } else {
                                pesquisaSemelhancas.tipo = null;
                            }

                        }else{
                            pesquisaSemelhancas.tipo = null;
                        }

                        if (feature.attributes.de_Tipologia != null){
                            if (feature.attributes.de_Tipologia.trim()) {
                                pesquisaSemelhancas.tipologia = feature.attributes.de_Tipologia;
                            } else {
                                pesquisaSemelhancas.tipologia = null;
                            }
                        }else{
                            pesquisaSemelhancas.tipologia = null;
                        }

                        
                        if (feature.attributes.de_Conservacao != null){
                            if (feature.attributes.de_Conservacao.trim()) {
                                pesquisaSemelhancas.conservacao = feature.attributes.de_Conservacao;
                            } else {
                                pesquisaSemelhancas.conservacao = null;
                            }
                        }else{
                            pesquisaSemelhancas.conservacao = null;
                        }

                        if (circleGeometry.contains(feature.geometry) && pesquisaSemelhancas.tipologia === unidadeSemelhancas.tipologia) {
                            if (pesquisaSemelhancas.tipo === unidadeSemelhancas.tipo){
                                if (pesquisaSemelhancas.conservacao === unidadeSemelhancas.conservacao) {
                                    inBuffer.push(feature);
                                }
                            }
                        }
                        // inBuffer.push(feature.attributes[featureLayer.objectIdField]);
                    }
                    if (inBuffer.length > 0) {
                        for (var i = 0; i < inBuffer.length; i++) {
                            let defaultSym1 = new SimpleMarkerSymbol('circle', 25,
                                new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 2, 2, 0.55]), 5),
                                new Color([255, 255, 255, 1]));
                            let graphic = new Graphic(inBuffer[i].geometry, defaultSym1);
                            graphic.setSymbol(defaultSym1);
                            selfCalculo.map.graphics.add(graphic);
                        }
                    } else {
                        DocumentUtil.showMessage('warning', 'AVISO: Não foram localizadas Pesquisas de Mercado que tenham características semelhantes à inscrição informada, mas isso não impede que o cálculo seja realizado!', true, null, 'semPesquisaSemelhanteError');
                    }
                    //selfCalculo.drawSimilar(inBuffer, featureSelected, unidadeSelected);
                }
            },
            goToLayer: function () {
                selfCalculo.map.setExtent(selfCalculo.geometryLote.getExtent(), true);
            },
            exportResultCalculo: function (object) {
                let inscricao = document.getElementById('geocode').value;
                let data = selfCalculo.dataToExport;
                if (object === 'Resumido') {
                    pdfMake.createPdf(pdfObjectBlocosResumido(
                        data.bloco,
                        inscricao,
                        selfCalculo.valoresCalculados
                    )).open();
                } else {
                    pdfMake.createPdf(pdfObjectsBlocos(
                        data.coordX,
                        data.coordY,
                        data.areaDoTerrenoTotal,
                        data.pavimentacaoDoImovel,
                        data.testadaDoTerreno,
                        data.rendaSetor,
                        data.areaConst,
                        data.padraoConserv,
                        data.tipologiaDoImovel,
                        data.idade,
                        data.drenagemDoImovel,
                        data.esgoto,
                        data.topografiaDoImovel,
                        data.bloco,
                        data.codigoSetor,
                        data.zonaUrbana,
                        data.TipoDoImovel,
                        inscricao,
                        selfCalculo.valoresCalculados,
                        selfCalculo.valorDoMetroQuadrado,
                        selfCalculo.CUB,
                        selfCalculo.depreciacao,
                        selfCalculo.fatorY,
                        selfCalculo.fatorX,
                        selfCalculo.fatorAreaTerreno,
                        selfCalculo.fatorpavimentacao,
                        selfCalculo.fatorTestadaTerreno,
                        selfCalculo.fatorRenda,
                        selfCalculo.valorEstatistico1,
                        selfCalculo.fatorRedeDrenagem,
                        selfCalculo.valorTotalDoImovel,
                        selfCalculo.valorEstatistico2,
                        selfCalculo.padraoConstrucao,
                        selfCalculo.idadeDoImovel,
                        selfCalculo.estadoDeConservacao
                    )).open();
                }
            },
            putLabel: function (json, labels) {
                let result = {};

                for (let variable in json) {
                    if (json.hasOwnProperty(variable)) {
                        var label;
                        if (labels[variable]) {
                            label = labels[variable];
                        } else {
                            label = variable;
                        }
                        result[variable] = {
                            label: label,
                            value: json[variable]
                        };
                    }
                }
                return result;
            },
            saveTerceiraAvaliacao: function () {
                let geocode = document.getElementById('geocode').value;
                valorMinimo = selfCalculo.minimoTerceiraAvaliacao;
                let salvarTerceiraAvaliacaoURL = selfCalculo.salvarTerceiraAvaliacaoURL;
                let terceiraAvaliacaoValue = document.getElementById('terceiraAvaliacaoInput').value.replace(/\./g, '').replace(',', '.');
                let terceiraAvaliacaoBancariaValue = document.getElementById('terceiraAvaliacaoBancaria').value.replace(/\./g, '').replace(',', '.');
                if (Number(terceiraAvaliacaoValue) > Number(valorMinimo)) {
                    let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');
                    $.ajax({
                        url: salvarTerceiraAvaliacaoURL,
                        type: 'post',
                        data: {
                            geocodigo: geocode,
                            id_imovel: selfCalculo.idImovel,
                            valor: terceiraAvaliacaoValue,
                            valorBancaria: terceiraAvaliacaoBancariaValue,
                            valoresCalculados: selfCalculo.valoresCalculados
                        },
                        headers: {
                            authorization: headerAuthorization // If your header name has spaces or any other char not appropriate
                        },
                        dataType: 'json',
                        success: function (data) {
                            DocumentUtil.showSpinner(false);
                            DocumentUtil.showMessage('success', 'Terceira Avaliação Salva com Sucesso!', true, null, null);

                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            DocumentUtil.showSpinner(false);
                            if (xhr.responseJSON) {
                                DocumentUtil.showMessage('warning', xhr.responseJSON.message, true, null, 'semAutorizacaoTerceiraAvaliacao');
                            } else {
                                DocumentUtil.showMessage('warning', 'Não foi possível fazer a comunicação com o servidor!', true, null, 'semAutorizacaoTerceiraAvaliacao');
                            }
                        }
                    });
                } else {
                    DocumentUtil.showMessage('warning', 'Valor da 3ª Avaliação não pode ser menor que ' + numberParaReal(valorMinimo) + '. ', true, null, 'valorMenorQueMinimoTerceiraAvaliacao');
                }
            },
            getTransmissoes: function (featureList, featureSelected, unidadeSelected, callback) {
                let transmissaoServiceUrl = selfCalculo.config.transmissaoServiceUrl;
                let layerFieldName = 'de_geocode_lote';
                let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';
                let queryBuscaTransmissoes = new Query();
                let queryTaskBuscaTransmissoes = new QueryTask(transmissaoServiceUrl);
                queryBuscaTransmissoes.returnGeometry = true;
                queryBuscaTransmissoes.outFields = ['OBJECTID', 'de_geocode_lote', 'de_geocode'];
                queryBuscaTransmissoes.outSpatialReference = {
                    wkid: 3857
                };

                let whereQuery = "";
                if (featureList.length > 0 ){
                    whereQuery = layerFieldName + ' IN(';
                    for (let i = 0; i < featureList.length; i++) {
                        whereQuery += "'" + featureList[i].attributes['sl_cadastro.SDE.Lote.GEOC_RENU'] + "'";
                        if (i + 1 < featureList.length) {
                            whereQuery += ', ';
                        }
                    }
                    whereQuery += ')';
                }
                // query.where = whereQuery + " AND destinacao = '" + unidadeSelected.attributes.destinacao + "'" + " AND ocupacao = '" + unidadeSelected.attributes.ocupacao + "'" + " AND destinacao = '" + unidadeSelected.attributes.destinacao + "'" + " AND conservacao = '" + unidadeSelected.attributes.conservacao + "'" + " AND tipologia = '" + unidadeSelected.attributes.tipologia + "'" + " AND piscina = '" + unidadeSelected.attributes.piscina + "'" + " AND predial = '" + unidadeSelected.attributes.predial + "'";
                queryBuscaTransmissoes.where = whereQuery;
                queryTaskBuscaTransmissoes.execute(queryBuscaTransmissoes, function (result) {
                    let transmissoes = result.features;
                    callback(transmissoes);
                });
            },
            getTransmissoesWithUnidade: function (featureList, featureSelected, unidadeSelected, callback) {
                let unidadeServiceUrl = selfCalculo.config.unidadeServiceUrl;

                selfCalculo.getTransmissoes(featureList, featureSelected, unidadeSelected, function (transmissoes) {
                    let query = new Query();
                    let queryTask = new QueryTask(unidadeServiceUrl);
                    query.returnGeometry = true;
                    query.outFields = ['OBJECTID', 'DE_GEOCODE_STM', 'DE_TIPOLOGIA', 'DE_DESTINACAO', 'DE_CONSERVACAO'];
                    query.outSpatialReference = {
                        wkid: 3857
                    };
                    let whereQuery = 'de_geocode_stm' + ' IN(';
                    for (let i = 0; i < transmissoes.length; i++) {
                        whereQuery += "'" + transmissoes[i].attributes['de_geocode'] + "'";
                        if (i + 1 < transmissoes.length) {
                            whereQuery += ', ';
                        }
                    }
                    whereQuery += ')';
                    query.where = whereQuery + " AND DE_TIPOLOGIA = '" + unidadeSelected.attributes.DE_TIPOLOGIA + "'" + " AND DE_DESTINACAO = '" + unidadeSelected.attributes.DE_DESTINACAO + "'" + " AND DE_CONSERVACAO = '" + unidadeSelected.attributes.DE_CONSERVACAO + "'";
                    // query.where = whereQuery;

                    queryTask.execute(query, function (result) {
                        for (let i = 0; i < transmissoes.length; i++) {
                            for (let f = 0; f < result.features.length; f++) {
                                if (transmissoes[i].attributes['de_geocode'] === result.features[f].attributes['de_geocode_stm']) {
                                    transmissoes[i].unidade = result.features[f];
                                }
                            }
                        }
                        callback(transmissoes);
                    });
                });
            },
            clearGraphics: function (keepGeocodeInput) {
                selfCalculo.map.graphics.clear();
                if (keepGeocodeInput !== true) {
                    let geocodeInput = document.getElementById('geocode');
                    geocodeInput.value = null;
                }

                selfCalculo.geocodeSelect = null;
                activeTerceiraAvaliacao();
                activeCalculoLimpar();
                activeVisualizarMapa(false);
                selfCalculo.randomValues({
                    minimo: '',
                    medio: '',
                    maximo: ''
                }, '', {
                        minimo: '',
                        medio: '',
                        maximo: ''
                    });

                selfCalculo.fillStmData(null);
                activeBuscarCalculo();
            },
            getDepreciacaoFisica: function (idade, conservacao) {
                let coef = selfCalculo.config.coeficienteDepreciacao;
                if (idade === '0') {
                    idade = 2;
                }
                if (idade > 99) {
                    idade = 100;
                }
                let round = Math.round(((idade / 80) * 100));
                if (round % 2 !== 0) {
                    if (round === 1) {
                        round = 2;
                    } else {
                        round = round - 1;
                    }
                }
                let vidaReferencial = String(round);
                if (vidaReferencial > 100) {
                    vidaReferencial = 100;
                }
                return coef[vidaReferencial][conservacao];
            },
            getCustoUnitarioBasico: function (tipologia, padraoConstrucao, estrutura) {
                if (tipologia === 'cobertura metálica' || tipologia === 'cob metalica' || tipologia === 'comércio com residência' || tipologia === 'com c/ residencia' || tipologia === 'telheiro') {
                    tipologia = 'comercio com residencia';
                }
                if (tipologia === 'edificação complementar' || tipologia === 'garagem') {
                    tipologia = 'casa';
                }
                if (tipologia === 'templo' || tipologia === 'deposito') {
                    tipologia = 'loja/sala/conjunto';
                }
                if (tipologia.indexOf('ap') > 1) {
                    tipologia = 'apartamento'
                }

                var valorCub = selfCalculo.config.cub[tipologia][padraoConstrucao];

                if (estrutura.indexOf('mad') > 1) {
                    estrutura = 'madeira'
                }
                if (estrutura === 'mista alv/conc') {
                    estrutura = 'concreto'
                }
                if (estrutura === 'metálica') {
                    estrutura = 'metalica'
                }
                if (tipologia === 'telheiro' || tipologia === 'galpão' || tipologia === 'galpao' || tipologia.indexOf('indus') > 1) {
                    valorCub = selfCalculo.config.cub[tipologia][estrutura];
                }
                if (tipologia === 'deposito' || tipologia === 'depósito') {
                    valorCub = selfCalculo.config.cub[tipologia][padraoConstrucao][estrutura];
                }

                
                return valorCub * r8n;
                
                
            },
            getValorDaEdificacao: function (tipologia, padraoConstrucao, areaConstruida, idade, estadoDeConservacao, estrutura) {
                let custoUnitarioBasico = selfCalculo.getCustoUnitarioBasico(tipologia, padraoConstrucao, estrutura);
                let depreciacaoFisica = selfCalculo.getDepreciacaoFisica(idade, estadoDeConservacao);
                selfCalculo.CUB = custoUnitarioBasico;
                selfCalculo.depreciacao = depreciacaoFisica;
                selfCalculo.padraoConstrucao = padraoConstrucao;
                selfCalculo.idadeDoImovel = idade;
                selfCalculo.estadoDeConservacao = estadoDeConservacao;
                let valorEdificacao = 0.20 * custoUnitarioBasico * areaConstruida + 0.80 * custoUnitarioBasico * depreciacaoFisica * areaConstruida;
                return valorEdificacao;
            },
            resultadosBuscaModel: function (stmData, configJson) {
                resultadosBusca = new resultadosBuscaModel(stmData, configJson);
                resultadosBusca.ordenateDataJson();
            }
        });
    });

function activeBuscarCalculo(event) {
    let geocode = document.getElementById('geocode').value;

    let searchImovelButton = document.getElementById('searchImovelButton');
    if (geocode.length == 17) {
        searchImovelButton.disabled = false;
    } else {
        searchImovelButton.disabled = true;
    }
}

function factoryViewDataSTM(title, tbody, dados) {
    let tr = document.createElement('tr');
    let tdLabel = document.createElement('td');
    let tdValue = document.createElement('td');
    let label = document.createElement('label');
    tdLabel.appendChild(label);
    tdLabel.setAttribute('class', 'tbody-blue');
    tdValue.setAttribute('class', 'tbody-blue');
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);
    let t = document.createTextNode(title);

    label.appendChild(t);
    tbody.appendChild(tr);
    dados.forEach(function (value, key) {
        let tr = document.createElement('tr');
        let tdLabel = document.createElement('td');
        let tdValue = document.createElement('td');
        let label = document.createElement('label');
        tdLabel.appendChild(label);
        tdLabel.setAttribute('class', 'td-gray');
        tr.appendChild(tdLabel);
        tr.appendChild(tdValue);

        let t = document.createTextNode(key);

        let ted;
        if (value !== 'null' && value !== null && value !== undefined) {
            ted = document.createTextNode(value);
        } else {
            ted = document.createTextNode('');
        }

        label.appendChild(t);
        tdValue.appendChild(ted);
        tbody.appendChild(tr);
    }, dados);
}

function activeTerceiraAvaliacao() {
    let geocodeSelect = document.getElementById('geocode');
    let searchImovelButton = document.getElementById('searchImovelButton');
    let terceiraAvaliacaoInput = document.getElementById('terceiraAvaliacaoInput');
    let terceiraAvaliacaoButton = document.getElementById('terceiraAvaliacaoButton');
    let terceiraAvaliacaoBancaria = document.getElementById('terceiraAvaliacaoBancaria');
    if (geocodeSelect.value !== null) {
        terceiraAvaliacaoInput.disabled = false;
        terceiraAvaliacaoButton.disabled = false;
        terceiraAvaliacaoBancaria.disabled = false;
    } else {
        terceiraAvaliacaoInput.disabled = true;
        terceiraAvaliacaoInput.value = null;
        terceiraAvaliacaoButton.disabled = true;
        terceiraAvaliacaoBancaria.disabled = true
    }
}

function activeCalculoLimpar() {
    let geocodeSelect = selfCalculo.geocodeSelect;
    let calculoLimparButton = document.getElementById('calculoLimparButton');
    if (geocodeSelect) {
        calculoLimparButton.disabled = false;
    } else {
        calculoLimparButton.disabled = true;
    }
}

function activeVisualizarMapa(active) {
    let visualizarNoMapaButton = document.getElementById('visualizarNoMapaButton');
    //let exportButton = document.getElementById('exportResultCalculo');
    if (active) {
        visualizarNoMapaButton.disabled = false;
    } else {
        visualizarNoMapaButton.disabled = true;
    }
}

function numberParaReal(numero) {
    var numero = numero.toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
}

function calcularValorMetroQuadrado(coordY, coordX, areaDoTerrenoTotal, pavimentacaoDoImovel, testadaDoTerreno, rendaSetor, areaConst, padraoConserv, tipologiaDoImovel, idade, drenagemDoImovel, esgoto, topografiaDoImovel, bloco, codigoSetor, zonaUrbana, TipoDoImovel) {
    let eLn = 2.718281828459045;
    let valorDoMetroQuadrado;
    let coordNMinimoAmostra;
    let coordNMaximoAmostra;
    let coordEMinimoAmostra;
    let coordEMaximoAmostra;
    let areaDoTerrenoTotalMinimoAmostra;
    let areaDoTerrenoTotalMaximoAmostra;
    let testadaTerrenoMinimoAmostra;
    let testadaTerrenoMaximoAmostra;
    let rendaSetorMinimoAmostra;
    let rendaSetorMaximoAmostra;
    let pavimentacaoMinimo;
    let pavimentacaoMaximo;
    let tipologiaMinimoAmostra;
    let tipologiaMaximoAmostra;
    let idadeMinimoAmostra;
    let idadeMaximoAmostra;
    let PadraoConservMinimoAmostra;
    let PadraoConservMaximoAmostra;

    let valorTotalDoImovel;
    let fatorRedeDrenagem;
    let fatorpavimentacao;
    let fatorTipologia;
    let fatorIdadeImovel;
    let fatorTipo;
    let fatorAreaTerreno;
    let fatorTestadaTerreno;
    let fatorRenda;
    let fatorPadraoConservacao;
    let fatorAreaConstruida;

    let valorEstatistico1;
    let valorEstatistico2;

    let fatorY;
    let fatorX;
    let setorDentroSetor161 = 0;

    if (tipologiaDoImovel) {
        tipologiaDoImovel = 1;
    }

    if (!pavimentacaoDoImovel || pavimentacaoDoImovel === NAO_TEM) {
        pavimentacaoDoImovel = 1;
    } else{
        pavimentacaoDoImovel = 2;
    }

    if (drenagemDoImovel === NAO_TEM) {
        drenagemDoImovel = 1;
    } else {
        drenagemDoImovel = 2;
    }

    if (esgoto === NAO_TEM) {
        esgoto = 1;
    } else {
        esgoto = 2;
    }

    if (padraoConserv === 'otimo') {
        padraoConserv = 1;
    } else if (padraoConserv === 'bom' || padraoConserv === 'boa') {
        padraoConserv = 2;
    } else if (padraoConserv === 'regular') {
        padraoConserv = 3;
    } else if (padraoConserv === 'precário' || padraoConserv === 'precaria') {
        padraoConserv = 4;
    }

    if (topografiaDoImovel === 'plana') {
        topografiaDoImovel = 1;
    } else if (topografiaDoImovel === 'aclive suave') {
        topografiaDoImovel = 2;
    } else if (topografiaDoImovel === 'aclive acentuado') {
        topografiaDoImovel = 3;
    } else if (topografiaDoImovel === 'declive suave') {
        topografiaDoImovel = 4;
    } else if (topografiaDoImovel === 'declive acentuado') {
        topografiaDoImovel = 5;
    } else if (topografiaDoImovel === 'irregular') {
        topografiaDoImovel = 6;
    }

    if (zonaUrbana === 'urbano') {
        zonaUrbana = 1;
    } else if (zonaUrbana === 'urbana/industrial') {
        zonaUrbana = 2;
    } else if (zonaUrbana === 'rural') {
        zonaUrbana = 3;
    } else if (zonaUrbana === null) {
        if (codigoSetor != '16'){
             zonaUrbana = 1;
        }
        else{
             zonaUrbana = null;
        }
    }

    var calculoSetoresValorTotal = ['01', '02', '03', '09', '13', '16'];
     if (calculoSetoresValorTotal.indexOf(codigoSetor) != -1) {
        areaConst = 0;
        padraoConserv = 7;
        tipologia = 1;
        idade = 0;
    }  
 if (codigoSetor == '07' || codigoSetor == '10') {
        // BLOCO B
        bloco = 'BLOCO I-B';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }
      
        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        pavimentacaoMinimo = selfCalculo.config.LimiteAmostraSetor07e10.pavimentacao.MinimoAmostra;
        pavimentacaoMaximo = selfCalculo.config.LimiteAmostraSetor07e10.pavimentacao.MaximoAmostra;
        if (pavimentacaoDoImovel < pavimentacaoMinimo) {
            pavimentacaoDoImovel = pavimentacaoMinimo;
        }
        if (pavimentacaoDoImovel > pavimentacaoMaximo) {
            pavimentacaoDoImovel = pavimentacaoMaximo;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor07e10.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        fatorY = 0.000000000019918227 * (coordY * coordY);
        fatorX = -0.0000000018324684 * (coordX * coordX);
        
     

        fatorAreaTerreno = 0.000000001801289 * (areaDoTerrenoTotal * areaDoTerrenoTotal);
        fatorpavimentacao = 2.4943315 * pavimentacaoDoImovel;
        fatorTestadaTerreno = 0.0019993246 * (testadaDoTerreno * testadaDoTerreno);
        fatorRenda = 0.0000030366837 * rendaSetor;

        valorEstatistico1 = -1244.7487 +
            fatorY + fatorX +
            fatorAreaTerreno +
            fatorpavimentacao +
            fatorTestadaTerreno +
            fatorRenda;

        valorDoMetroQuadrado = valorEstatistico1 * valorEstatistico1;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorpavimentacao = fatorpavimentacao;
        selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
        selfCalculo.fatorRenda = fatorRenda;
        selfCalculo.valorEstatistico1 = valorEstatistico1;
    }
    else if (codigoSetor == '08' || codigoSetor == '11') {

        bloco = 'BLOCO I-A'; // mesma formula do I-B
               
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }
      
        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        pavimentacaoMinimo = selfCalculo.config.LimiteAmostraSetor08e11.pavimentacao.MinimoAmostra;
        pavimentacaoMaximo = selfCalculo.config.LimiteAmostraSetor08e11.pavimentacao.MaximoAmostra;
        if (pavimentacaoDoImovel < pavimentacaoMinimo) {
            pavimentacaoDoImovel = pavimentacaoMinimo;
        }
        if (pavimentacaoDoImovel > pavimentacaoMaximo) {
            pavimentacaoDoImovel = pavimentacaoMaximo;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor08e11.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        fatorY = 0.000000000019918227 * (coordY * coordY);
        fatorX = -0.0000000018324684 * (coordX * coordX);

        fatorAreaTerreno = 0.000000001801289 * (areaDoTerrenoTotal * areaDoTerrenoTotal);
        fatorpavimentacao = 2.4943315 * pavimentacaoDoImovel;
        fatorTestadaTerreno = 0.0019993246 * (testadaDoTerreno * testadaDoTerreno);
        fatorRenda = 0.0000030366837 * rendaSetor;

        valorEstatistico1 = -1244.7487 +
            fatorY + fatorX +
            fatorAreaTerreno +
            fatorpavimentacao +
            fatorTestadaTerreno +
            fatorRenda;

        valorDoMetroQuadrado = valorEstatistico1 * valorEstatistico1;

    } else if (codigoSetor == '01') {
        bloco = 'BLOCO II';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor01.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor01.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor01.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor01.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor01.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor01.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor01.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor01.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor01.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor01.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        /*BLOCO_2
        // Nova formula do bloco ii (25/01/2019 - enviada por email ao Sérgio Antol)
        ln(Valor Total) = 367,54497 + 
        -3,1536032e-12 * COORD_N²  + 
        -1,7332165e-10 * COORD_E²  + 
        -14358,838 * 1/RENDA_SETOR  + 
        -1,9996231e-07 * ÁREA_TER²  + 
        0,0055415258 * FRENTE_TER²
        */

        fatorY = -3.1536032e-12 * (coordY * coordY);
        fatorX = -1.7332165e-10 * (coordX * coordX);

        fatorRenda = -14358.838 * (1 / rendaSetor);
        fatorAreaTerreno = -1.9996231e-07 * (areaDoTerrenoTotal * areaDoTerrenoTotal);
        fatorTestadaTerreno = 0.0055415258 * (testadaDoTerreno * testadaDoTerreno);
       
        valorEstatistico1 = 367.54497 +
            fatorY + fatorX +
            fatorRenda +
            fatorAreaTerreno +
            fatorTestadaTerreno;
        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1); // exponencial
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorpavimentacao = fatorpavimentacao;
        selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
        selfCalculo.fatorRenda = fatorRenda;
        selfCalculo.valorEstatistico1 = valorEstatistico1;
        selfCalculo.valorTotalDoImovel = valorTotalDoImovel;

         /*
        // CALCULO ANTERIOR AS ÚLTIMAS MUDANCAS DO LUIS NO CALCULO DO BLOCO II
        fatorY = -0.0000000000031536032 * (coordY * coordY);
        fatorX = -1.7332165e-10 * (coordX * coordX);

        fatorRenda = -14358.838 * (1 / rendaSetor);
        fatorAreaTerreno = -1.9996231e-07 * (areaDoTerrenoTotal * areaDoTerrenoTotal);
        fatorAreaConstruida = 0.00036361237 * areaConst;
        fatorPadraoConservacao = -0.0089674519 * (padraoConserv * padraoConserv);
        fatorTipologia = 0.62922743 * Math.sqrt(tipologia);
        fatorTestadaTerreno = 0.0055415258 * (testadaDoTerreno * testadaDoTerreno);
        fatorIdadeImovel = 0.000049683898 * (idade * idade);

        valorEstatistico1 = 367.35515 +
            fatorY + fatorX +
            fatorRenda +
            fatorAreaTerreno +
            fatorAreaConstruida +
            fatorPadraoConservacao +
            fatorTipologia +
            fatorTestadaTerreno +
            fatorIdadeImovel;

        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1);
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        */

    } else if (codigoSetor == '04' || codigoSetor == '05' || codigoSetor == '06') {
        bloco = 'BLOCO III';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }

        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        redeDeDrenagemMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.redeDeDrenagem.MinimoAmostra;
        redeDeDrenagemMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.redeDeDrenagem.MaximoAmostra;
        if (drenagemDoImovel < redeDeDrenagemMinimoAmostra) {
            drenagemDoImovel = redeDeDrenagemMinimoAmostra;
        }
        if (drenagemDoImovel > redeDeDrenagemMaximoAmostra) {
            drenagemDoImovel = redeDeDrenagemMaximoAmostra;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor0405e06.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        fatorY = -1.9110612e-14 * (coordY * coordY);
        fatorX = 2.6379857e-12 * (coordX * coordX);

        fatorAreaTerreno = -4.7631089 * (1 / (areaDoTerrenoTotal * areaDoTerrenoTotal));
        fatorRedeDrenagem = -0.018723065 * drenagemDoImovel;
        fatorTestadaTerreno = -2.963265e-06 * (testadaDoTerreno * testadaDoTerreno);
        fatorRenda = 3.0296439e+08 * (1 / (rendaSetor * rendaSetor));

        valorEstatistico1 = 0.9701669 +
            fatorY + fatorX +
            fatorAreaTerreno +
            fatorRedeDrenagem +
            fatorTestadaTerreno +
            fatorRenda;
        valorEstatistico2 = valorEstatistico1 * valorEstatistico1;
        valorDoMetroQuadrado = 1 / valorEstatistico2;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorRedeDrenagem = fatorRedeDrenagem;
        selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
        selfCalculo.fatorRenda = fatorRenda;
        selfCalculo.valorEstatistico1 = valorEstatistico1;
        selfCalculo.valorEstatistico2 = valorEstatistico2;

    } else if (codigoSetor == '12' || codigoSetor == '14' || codigoSetor == '15') {
        bloco = 'BLOCO IV';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }   

        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        pavimentacaoMinimo = selfCalculo.config.LimiteAmostraSetor12141516.pavimentacao.MinimoAmostra;
        pavimentacaoMaximo = selfCalculo.config.LimiteAmostraSetor12141516.pavimentacao.MaximoAmostra;
        if (pavimentacaoDoImovel < pavimentacaoMinimo) {
            pavimentacaoDoImovel = pavimentacaoMinimo;
        }
        if (pavimentacaoDoImovel > pavimentacaoMaximo) {
            pavimentacaoDoImovel = pavimentacaoMaximo;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        fatorY = -423628850000000000 / (coordY * coordY);
        fatorX = 0.00000000041166656 * (coordX * coordX);

        fatorAreaTerreno = -0.030671871 * Math.sqrt(areaDoTerrenoTotal);
        fatorpavimentacao = 1.3467551 * pavimentacaoDoImovel;
        fatorTestadaTerreno = 0.00067587177 * (testadaDoTerreno * testadaDoTerreno);
        fatorRenda = 0.0000000000041779087 * (rendaSetor * rendaSetor);

        valorEstatistico1 = 4356.8578 +
            fatorY + fatorX +
            fatorAreaTerreno +
            fatorpavimentacao +
            fatorTestadaTerreno +
            fatorRenda;
        valorDoMetroQuadrado = valorEstatistico1 * valorEstatistico1;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorpavimentacao = fatorpavimentacao;
        selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
        selfCalculo.fatorRenda = fatorRenda;
        selfCalculo.valorEstatistico1 = valorEstatistico1;

    } else if (codigoSetor == '02' || codigoSetor == '03' || codigoSetor == '13') {
        bloco = 'BLOCO V';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor020313.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor020313.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor020313.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor020313.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }

        redeDeDrenagemMinimoAmostra = selfCalculo.config.LimiteAmostraSetor020313.redeDeDrenagem.MinimoAmostra;
        redeDeDrenagemMaximoAmostra = selfCalculo.config.LimiteAmostraSetor020313.redeDeDrenagem.MaximoAmostra;
        if (drenagemDoImovel < redeDeDrenagemMinimoAmostra) {
            drenagemDoImovel = redeDeDrenagemMinimoAmostra;
        }
        if (drenagemDoImovel > redeDeDrenagemMaximoAmostra) {
            drenagemDoImovel = redeDeDrenagemMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor020313.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor020313.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor020313.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor020313.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

      
        /*
        2. BLOCO_5
        // Nova fórmula para este bloco encaminhada por e-mail ao Sergio Antol no dia 25/01/2019
        ln(Valor Total) = 144,32798 + 
        -1,3209366e+16 * 1/COORD_N² +
         1,5919961e-11 * COORD_E² + 
         0,193399 * REDE_DRENAGEM + 
         -169284,71 * 1/RENDA_SETOR + 
         0,085658933 * Área terreno½ 
        */

        fatorY = -1.3209366e+16 * (1/(coordY * coordY));
        fatorX = 1.5919961e-11 * (coordX * coordX);
        fatorRedeDrenagem = 0.193399 * drenagemDoImovel;
        fatorRenda = -169284.71 * (1 / rendaSetor);
        fatorAreaTerreno = 0.085658933 * Math.sqrt(areaDoTerrenoTotal);

        valorEstatistico1 = 144.32798 +
            fatorY + fatorX +
            fatorRedeDrenagem +
            fatorAreaTerreno;

        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1); // esxponencial
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.fatorRenda =fatorRenda;
        selfCalculo.valorTotalDoImovel = valorTotalDoImovel
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorRedeDrenagem = fatorRedeDrenagem;
        selfCalculo.valorEstatistico1 = valorEstatistico1;
        

        /*
        // calculo anterior ao dia 25/01/2019
        fatorY = -13209366000000000 / (coordY * coordY);
        fatorX = 0.000000000015919961 * (coordX * coordX);
        fatorRedeDrenagem = 0.193399 * (drenagem);
        fatorRenda = -169284.71 * (1 / rendaSetor);
        fatorAreaConstruida = -0.00000089526065 * drenagem;
        fatorAreaTerreno = 0.085658933 * Math.sqrt(areaDoTerrenoTotal);
        fatorPadraoConservacao = -1.1596139 * Math.sqrt(padraoConserv);
        fatorIdadeImovel = -0.000066874663 * (idade * idade);


        valorEstatistico1 = 147.39603 +
            fatorY + fatorX +
            fatorRedeDrenagem +
            fatorRenda +
            fatorAreaConstruida +
            fatorAreaTerreno +
            fatorPadraoConservacao +
            fatorIdadeImovel;

        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1);
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        */

    } else if (codigoSetor == '09') {
         bloco = 'BLOCO VI';
        coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.coordN.MinimoAmostra;
        coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.coordN.MaximoAmostra;
        if (coordY < coordNMinimoAmostra) {
            coordY = coordNMinimoAmostra;
        }
        if (coordY > coordNMaximoAmostra) {
            coordY = coordNMaximoAmostra;
        }

        coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.coordE.MinimoAmostra;
        coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.coordE.MaximoAmostra;
        if (coordX < coordEMinimoAmostra) {
            coordX = coordEMinimoAmostra;
        }
        if (coordX > coordEMaximoAmostra) {
            coordX = coordEMaximoAmostra;
        }

        redeDeEsgotoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.redeEsgoto.MinimoAmostra;
        redeDeEsgotoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.redeEsgoto.MaximoAmostra;
        if (esgoto < redeDeEsgotoMinimoAmostra) {
            esgoto = redeDeEsgotoMinimoAmostra;
        }
        if (esgoto > redeDeEsgotoMaximoAmostra) {
            esgoto = redeDeEsgotoMaximoAmostra;
        }

        testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.testadaTerreno.MinimoAmostra;
        testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.testadaTerreno.MaximoAmostra;
        if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
            testadaDoTerreno = testadaTerrenoMinimoAmostra;
        }
        if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
            testadaDoTerreno = testadaTerrenoMaximoAmostra;
        }

        rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.rendaSetor.MinimoAmostra;
        rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.rendaSetor.MaximoAmostra;
        if (rendaSetor < rendaSetorMinimoAmostra) {
            rendaSetor = rendaSetorMinimoAmostra;
        }
        if (rendaSetor > rendaSetorMaximoAmostra) {
            rendaSetor = rendaSetorMaximoAmostra;
        }

        areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.areaDoTerreno.MinimoAmostra;
        areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.areaDoTerreno.MaximoAmostra;
        if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
        }
        if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
            areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
        }

        tipologiaMinimoAmostra = selfCalculo.config.LimiteAmostraSetor09.tipoImovel.MinimoAmostra;
        tipologiaMaximoAmostra = selfCalculo.config.LimiteAmostraSetor09.tipoImovel.MaximoAmostra;
        if (tipologia < tipologiaMinimoAmostra) {
            tipologia = tipologiaMinimoAmostra;
        }
        if (tipologia > tipologiaMaximoAmostra) {
            tipologia = tipologiaMaximoAmostra;
        }

        fatorY = -16758505000000000 * 1 / (coordY * coordY);
        fatorX = -0.000000000064551228 * (coordX * coordX);
        fatorRedeDrenagem = 0.79259538 * esgoto;
        fatorTestadaTerreno = -0.014018364 * testadaDoTerreno;
        fatorRenda = 0.075673609 *  Math.log(rendaSetor);
        fatorAreaTerreno = 0.35229635 * Math.log(areaDoTerrenoTotal);
 
        valorEstatistico1 = 206.25131 +
            fatorY + fatorX +
            fatorRedeDrenagem +
            fatorTestadaTerreno +
            fatorRenda +
            fatorAreaTerreno;
   
        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1);
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        selfCalculo.fatorY = fatorY;
        selfCalculo.fatorX = fatorX;
        selfCalculo.valorTotalDoImovel = valorTotalDoImovel;
        selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
        selfCalculo.fatorRedeDrenagem = fatorRedeDrenagem;
        selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
        selfCalculo.fatorRenda = fatorRenda;
        selfCalculo.valorEstatistico1 = valorEstatistico1;

       
        /*
        // Nova fórmula para este bloco encaminhada por e-mail ao Sergio Antol no dia 25/01/2019
        ln(Valor Total) = 206,25131 + 
        -1,6758505e+16 * 1/COORD_N² + 
        -6,4551228e-11 * COORD_E² + 
        0,79259538 * REDE_ESGOTO + 
        -0,014018364 * FRENTE_TER + 
        0,075673609 * ln(RENDA_SETOR)  + 
        0,35229635 * ln(Área terreno) 
        */
        
        /*
        calculo anterior ao dia 25/01/2019
        fatorY = -16758505000000000 / (coordY * coordY);
        fatorX = -0.000000000064551228 * (coordX * coordX);
        fatorRedeDrenagem = 0.79259538 * esgoto;
        fatorTestadaTerreno = -0.014018364 * testadaDoTerreno;
        fatorRenda = 0.07567360 * Math.log(rendaSetor);
        fatorAreaConstruida = 0.0020594044 * areaConst;
        fatorAreaTerreno = 0.35229635 * Math.log(areaDoTerrenoTotal);
        fatorPadraoConservacao = 1.8883073 * (1 / padraoConserv);
        fatorIdadeImovel = 0.0071952145 * idade;
        fatorTipologia = 0.15055057 * tipologia;

        valorEstatistico1 = 205.831 +
            fatorY + fatorX +
            fatorRedeDrenagem +
            fatorTestadaTerreno +
            fatorRenda +
            fatorAreaConstruida +
            fatorAreaTerreno +
            fatorPadraoConservacao +
            fatorIdadeImovel +
            fatorTipologia;

        valorTotalDoImovel = Math.pow(eLn, valorEstatistico1);
        valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
        */

     } else if (codigoSetor === '16') {
        setorDentroSetor161 = 0; // =161 = 16.1 **************** remover isso depois de fazer a pesquisa espacial
        if (setorDentroSetor161 == -1) { // esta dentro da área especial 16.1
            bloco = 'BLOCO IV';
            coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordN.MinimoAmostra;
            coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordN.MaximoAmostra;
            if (coordY < coordNMinimoAmostra) {
                coordY = coordNMinimoAmostra;
            }
            if (coordY > coordNMaximoAmostra) {
                coordY = coordNMaximoAmostra;
            }

            coordEMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordE.MinimoAmostra;
            coordEMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.coordE.MaximoAmostra;
            if (coordX < coordEMinimoAmostra) {
                coordX = coordEMinimoAmostra;
            }
            if (coordX > coordEMaximoAmostra) {
                coordX = coordEMaximoAmostra;
            }

            areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.areaDoTerreno.MinimoAmostra;
            areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.areaDoTerreno.MaximoAmostra;
            if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
                areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
            }
            if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
                areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
            }

            pavimentacaoMinimo = selfCalculo.config.LimiteAmostraSetor12141516.pavimentacao.MinimoAmostra;
            pavimentacaoMaximo = selfCalculo.config.LimiteAmostraSetor12141516.pavimentacao.MaximoAmostra;
            if (pavimentacaoDoImovel < pavimentacaoMinimo) {
                pavimentacaoDoImovel = pavimentacaoMinimo;
            }
            if (pavimentacaoDoImovel > pavimentacaoMaximo) {
                pavimentacaoDoImovel = pavimentacaoMaximo;
            }

            testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.testadaTerreno.MinimoAmostra;
            testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.testadaTerreno.MaximoAmostra;
            if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
                testadaDoTerreno = testadaTerrenoMinimoAmostra;
            }
            if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
                testadaDoTerreno = testadaTerrenoMaximoAmostra;
            }

            rendaSetorMinimoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.rendaSetor.MinimoAmostra;
            rendaSetorMaximoAmostra = selfCalculo.config.LimiteAmostraSetor12141516.rendaSetor.MaximoAmostra;
            if (rendaSetor < rendaSetorMinimoAmostra) {
                rendaSetor = rendaSetorMinimoAmostra;
            }
            if (rendaSetor > rendaSetorMaximoAmostra) {
                rendaSetor = rendaSetorMaximoAmostra;
            }

            fatorY = -423628850000000000 / (coordY * coordY);
            fatorX = 0.00000000041166656 * (coordX * coordX);

            fatorAreaTerreno = -0.030671871 * Math.sqrt(areaDoTerrenoTotal);
            fatorpavimentacao = 1.3467551 * pavimentacaoDoImovel;
            fatorTestadaTerreno = 0.00067587177 * (testadaDoTerreno * testadaDoTerreno);
            fatorRenda = 0.0000000000041779087 * (rendaSetor * rendaSetor);

            valorEstatistico1 = 4356.8578 +
                fatorY + fatorX +
                fatorAreaTerreno +
                fatorpavimentacao +
                fatorTestadaTerreno +
                fatorRenda;
            valorDoMetroQuadrado = valorEstatistico1 * valorEstatistico1;
            selfCalculo.fatorY = fatorY;
            selfCalculo.fatorX = fatorX;
            selfCalculo.fatorAreaTerreno = fatorAreaTerreno;
            selfCalculo.fatorTestadaTerreno = fatorTestadaTerreno;
            selfCalculo.fatorRenda = fatorRenda;
            selfCalculo.valorEstatistico1 = valorEstatistico1;

        } else if (setorDentroSetor161 == 0) {
            bloco = 'VII'

            coordNMinimoAmostra = selfCalculo.config.LimiteAmostraSetor16.coordN.MinimoAmostra;
            coordNMaximoAmostra = selfCalculo.config.LimiteAmostraSetor16.coordN.MaximoAmostra;
            if (coordY < coordNMinimoAmostra) {
                coordY = coordNMinimoAmostra;
            }
            if (coordY > coordNMaximoAmostra) {
                coordY = coordNMaximoAmostra;
            }

            testadaTerrenoMinimoAmostra = selfCalculo.config.LimiteAmostraSetor16.testadaTerreno.MinimoAmostra;
            testadaTerrenoMaximoAmostra = selfCalculo.config.LimiteAmostraSetor16.testadaTerreno.MaximoAmostra;
            if (testadaDoTerreno < testadaTerrenoMinimoAmostra) {
                testadaDoTerreno = testadaTerrenoMinimoAmostra;
            }
            if (testadaDoTerreno > testadaTerrenoMaximoAmostra) {
                testadaDoTerreno = testadaTerrenoMaximoAmostra;
            }

            areaDoTerrenoTotalMinimoAmostra = selfCalculo.config.LimiteAmostraSetor16.areaDoTerreno.MinimoAmostra;
            areaDoTerrenoTotalMaximoAmostra = selfCalculo.config.LimiteAmostraSetor16.areaDoTerreno.MaximoAmostra;
            if (areaDoTerrenoTotal < areaDoTerrenoTotalMinimoAmostra) {
                areaDoTerrenoTotal = areaDoTerrenoTotalMinimoAmostra;
            }
            if (areaDoTerrenoTotal > areaDoTerrenoTotalMaximoAmostra) {
                areaDoTerrenoTotal = areaDoTerrenoTotalMaximoAmostra;
            }

            topografiaDoImovelMinimoAmostra = selfCalculo.config.LimiteAmostraSetor16.topografia.MinimoAmostra;
            topografiaDoImovelMaximoAmostra = selfCalculo.config.LimiteAmostraSetor16.topografia.MaximoAmostra;
            if (topografiaDoImovel < topografiaDoImovelMinimoAmostra) {
                topografiaDoImovel = topografiaDoImovelMinimoAmostra;
            }
            if (topografiaDoImovel > topografiaDoImovelMaximoAmostra) {
                topografiaDoImovel = topografiaDoImovelMaximoAmostra;
            }

            zonaUrbanaMinimoAmostra = selfCalculo.config.LimiteAmostraSetor16.zonaurbana.MinimoAmostra;
            zonaUrbanaMaximoAmostra = selfCalculo.config.LimiteAmostraSetor16.zonaurbana.MaximoAmostra;
            if (zonaUrbana < zonaUrbanaMinimoAmostra) {
                zonaUrbana = zonaUrbanaMinimoAmostra;
            }
            if (zonaUrbana > zonaUrbanaMaximoAmostra) {
                zonaUrbana = zonaUrbanaMaximoAmostra;
            }

            fatorY = -5.4410184e-15 * (coordY * coordY);
            fatorTestadaTerreno = 0.014525888 * Math.sqrt(testadaDoTerreno);
            fatorAreaTerreno = -0.0013009123 * Math.log(areaDoTerrenoTotal);
            fatorTopografia = -0.0027996973 * (topografiaDoImovel * topografiaDoImovel);
            fatorZonaUrbana = -0.0028490535 * (zonaUrbana * zonaUrbana);

            valorEstatistico1 = 0.5251274 +
                fatorY +
                fatorTestadaTerreno +
                fatorAreaTerreno +
                fatorTopografia +
                fatorZonaUrbana;
            valorEstatistico2 = valorEstatistico1 * valorEstatistico1;
            valorTotalDoImovel = 1 / valorEstatistico2;
            valorDoMetroQuadrado = valorTotalDoImovel / areaDoTerrenoTotal;
            
        }
        
    }    
    var dataToExport = {
        coordX, coordY, areaDoTerrenoTotal, pavimentacaoDoImovel, testadaDoTerreno,
        rendaSetor, areaConst, padraoConserv, tipologiaDoImovel, idade, drenagemDoImovel,
        esgoto, topografiaDoImovel, bloco, codigoSetor, zonaUrbana, TipoDoImovel
    }
    selfCalculo.dataToExport = dataToExport;
    return valorDoMetroQuadrado;
}

function saveGeocodeInArray(geocode) {
    if (recentsGeocodes.indexOf(geocode) != - 1){
        recentsGeocodes.push(geocode);
        if (recentsGeocodes.length > 7) {
            recentsGeocodes.shift();
        }
        updateGeocodesInLocalStorage();
    }
}

function updateGeocodesInLocalStorage() {
    for (var i = 0; i < recentsGeocodes.length; i++) {
        localStorage.setItem("Inscrição " + i, recentsGeocodes[i]);
    }
}

function hinter(event, array) {
    var input = event.target;
    var containerGeocodes = document.getElementById('containerGeocodes');
    var min_characters = 0;

    if (input.value.length < min_characters) {
        return;
    } else {
        containerGeocodes.innerHTML = "";
        array.forEach(function (item) {
            var option = document.createElement('option');
            if (item !== null) {
                option.value = item;
                containerGeocodes.appendChild(option);
            }
        });
    }
}
