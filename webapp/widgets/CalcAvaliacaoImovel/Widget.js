/* global define $:true */
let selfCalculo;
let resultadosBusca;
let recentsGeocodes = [];

define(
  [
    'dojo/_base/declare',
    'jimu/BaseWidget',
    // 'dojo/query' ,
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
    'esri/layers/FeatureLayer',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/geometry/Circle',
    'esri/geometry/Point',
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
    // query,
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
    FeatureLayer,
    SimpleMarkerSymbol,
    Query,
    QueryTask,
    SimpleLineSymbol,
    SimpleFillSymbol,
    Circle,
    Point,
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
    // TODO: ATUALMENTE O CÓDIGO SÓ FUNCIONA NO CHROME FAZER!!

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
          let input = document.getElementById('geocode')
          input.value = inscr
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
      searchImovel: function () {
        DocumentUtil.showSpinner(true);
        selfCalculo.clearGraphics(true);
        selfCalculo.getDataFromStm(function (err, stmData) {
          console.log('Testando se chegou aqui 1');
          console.log(stmData);
          if (err || !stmData) {
            console.log('Testando se chegou aqui 1.1');
            if (err) {
              DocumentUtil.showSpinner(false);
              DocumentUtil.showMessage('warning', 'Não foi possível se comunicar com o STM!', true, null, 'comunicacaoStmError');
            }
            if (!stmData) {
              DocumentUtil.showSpinner(false);
              DocumentUtil.showMessage('warning', 'A inscrição imobiliária informada não foi localizada no Cadastro (STM)!', true, null, 'comunicacaoStmNull');
            }
          } else {
            console.log('Testando se chegou aqui 1.2');
            let geocode = document.getElementById('geocode').value;
            //STRING = GEOCODE  "0" + string[0] + string.slice(3,8) + string.slice(10,14)
            selfCalculo.geocodeSelect = geocode;

            //TRATAMENTO DE DADOS
            // if(stmData.caracteristicas.drenagem[0] === "n"){
            //   stmData.caracteristicas.drenagem = "Não"
            // } else {
            //   stmData.caracteristicas.drenagem = "Sim"
            // }
            // if(stmData.caracteristicas.esgoto[0] === "n"){
            //   stmData.caracteristicas.esgoto = "Não"
            // } else {
            //   stmData.caracteristicas.esgoto = "Sim"
            // }

            // temp
            stmData.caracteristicas.drenagem = "Sim"
            stmData.caracteristicas.esgoto = "Sim"

            console.log('Testando se chegou aqui 1.3');
            selfCalculo.fillStmData(stmData);
            console.log('Testando se chegou aqui 1.4');
            saveGeocodeInArray(geocode);

            console.log('Testando se chegou aqui 1.5');
            activeCalculoLimpar();


            selfCalculo.searchLote(3857, function (loteFeature) {
              console.log('Testando se chegou aqui 1.6');
              selfCalculo.map.graphics.clear();

              // selfCalculo.map.setExtent(result.features[0].geometry.getExtent(), true);
              let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255]), 3), new Color([0, 255, 255, 0.6]));
              if (loteFeature) {
                let graphic = new Graphic(loteFeature.geometry, symbol);
                graphic.setSymbol(symbol);
                selfCalculo.map.graphics.add(graphic);
                activeVisualizarMapa(true);

                selfCalculo.searchGeocodeUnidade(loteFeature, stmData);
              } else {
                DocumentUtil.showMessage('warning', 'AVISO: Não existe um lote na cartografia que represente a localização do imóvel para a inscrição informada. Isso não impede que o cálculo seja efetuado!', true, null, 'buscaGeometriaError');
              }

              let total = {
                minimo: numberParaReal(stmData.resultado.valorTotalMinimo),
                medio: numberParaReal(stmData.resultado.valorTotalMedio),
                maximo: numberParaReal(stmData.resultado.valorTotalMaximo)
              };
              let valorTerreno = {
                minimo: numberParaReal(stmData.resultado.valorTerrenoMinimo),
                medio: numberParaReal(stmData.resultado.valorTerrenoMedio),
                maximo: numberParaReal(stmData.resultado.valorTerrenoMaximo)
              };
              selfCalculo.minimoTerceiraAvaliacao = stmData.valor_edificacao + stmData.resultado.valorTerrenoMinimo;

              selfCalculo.randomValues(valorTerreno, numberParaReal(stmData.valor_edificacao), total);

              selfCalculo.idImovel = stmData.inscricao;

              let coodY = stmData.dadosPlanta.nu_y;
              let coodX = stmData.dadosPlanta.nu_x;
              let areaPadrao = stmData.caracteristicas.area_terreno;
              let pavimentacao;
              if (stmData.caracteristicas.pavimentacao) {
                pavimentacao = stmData.caracteristicas.pavimentacao;
              } else {
                pavimentacao = 'Informação não constante';
              }
              let testadaMedia = stmData.caracteristicas.testada;
              let rendaSetor = stmData.dadosPlanta.nu_renda_v02;
              let areaConst = stmData.caracteristicas.area_construida;
              let padraoConserv = stmData.caracteristicas.conservacao;
              let tipo = stmData.caracteristicas.tipologia;
              let idade = stmData.caracteristicas.idade;
              let drenagem = stmData.caracteristicas.drenagem;
              let esgoto = stmData.caracteristicas.esgoto;
              let topografia = stmData.caracteristicas.topografia;
              let bloco = stmData.dadosPlanta.de_zona_calculo;
              let zonaUrbana = stmData.dadosPlanta.de_zona;
              let tipoUso;
              if (stmData.caracteristicas.tipoimovel === "predial") {
                tipoUso = "Predial";
              } else {
                tipoUso = "Territorial";
              }
              let pedologia = stmData.caracteristicas.pedologia;
              let padraoConstrucao = stmData.caracteristicas.padraoconstrucao;

              let valorEdificacao = numberParaReal(stmData.valor_edificacao);

              selfCalculo.valoresCalculados = {
                valorTerreno: valorTerreno,
                valorEdificacao: valorEdificacao,
                total: total
              };

              selfCalculo.valoresCalculadosTerceira = {
                valorTerreno: valorTerreno,
                valorEdificacao: stmData.valor_edificacao,
                total: total
              };

              let dataToExport = {
                coodY, coodX, areaPadrao, pavimentacao, testadaMedia, rendaSetor, areaConst, padraoConserv, tipo, idade, drenagem, esgoto, topografia, bloco, zonaUrbana, tipoUso, pedologia, padraoConstrucao
              }

              selfCalculo.valorUnit = stmData.valor_metro_quadrado;
              selfCalculo.CUB = stmData.cub;
              selfCalculo.depreciacao = stmData.depreciacao;

              console.log(dataToExport);
              selfCalculo.dataToExport = dataToExport;

              let buttons = [
                {
                  label: 'Cálculo Resumido',
                  attributes: {
                    class: 'btn btn-danger exportarcalculo',
                    style: 'margin-top: -26px;',
                    onclick: 'selfCalculo.exportResultCalculo("Resumido")'
                  }
                },
                {
                  label: 'Cálculo Detalhado',
                  attributes: {
                    class: 'btn btn-danger exportarcalculo',
                    style: 'margin-top: -26px; margin-left: 5px;',
                    onclick: 'selfCalculo.exportResultCalculo()'
                  }
                }]

              //DocumentUtil.showMessage('info', 'Cálculo realizado com sucesso!', true, null, 'calculoSucesso');
              DocumentUtil.showMessageWithButton(buttons, 'info', 'Cálculo realizado com sucesso!', true, null, 'calculoSucesso');


              DocumentUtil.showSpinner(false);
            });
          }
        });
      },
      searchLote: function (wkid, callback) {
        if (!wkid) {
          wkid = 3857;
        }

        let inscricao = document.getElementById('geocode').value;
        //STRING = GEOCODE  "0" + string[0] + string.slice(3,8) + string.slice(10,14)
        let geocode = "0" + inscricao[0] + inscricao.slice(3, 8) + inscricao.slice(10, 14);
        let setor = geocode.substring(2, 4);
        let serviceUrl;
        let layerFieldName;
        let shapeFieldName;

        serviceUrl = selfCalculo.config.loteServiceUrl;
        layerFieldName = 'sjr_cadastro.gis.Lote.stg_geocode';
        shapeFieldName = 'sjr_cadastro.gis.Lote.Shape';

        //let geocodeLote = geocode.substring(2, 11);
        //console.info("GEOCODE",geocodeLote)

        let query = new Query();
        let queryTask = new QueryTask(serviceUrl);
        query.returnGeometry = true;
        query.outFields = [layerFieldName, shapeFieldName];
        // query.outFields = ['*'];
        query.outSpatialReference = {
          wkid: wkid
        };
        query.where = layerFieldName + ' = ' + "'" + geocode + "'";

        queryTask.execute(query, showResults);

        function showResults(result) {
          console.info("result searchLote", result)
          if (result.features[0]) {
            selfCalculo.geometryLote = result.features[0].geometry;
            selfCalculo.map.setExtent(result.features[0].geometry.getExtent(), true);
            callback(result.features[0]);
          } else {
            console.info("Lote sem Geometria na base")
            callback(result)
            DocumentUtil.showMessage('warning', 'AVISO: Não existe um lote na cartografia que represente a localização do imóvel para a inscrição informada. Isso não impede que o cálculo seja efetuado!', true, null, 'buscaGeometriaError');
          }
        }
      },
      // searchTableLote: function(callback) {
      //   let geocode = document.getElementById('geocode').value;
      //   let geocodeLote = geocode.substring(2, 12);
      //   let serviceUrl = selfCalculo.config.tableLoteServiceUrl;
      //   let layerFieldName = 'DE_GEOCODE_LOTE';

      //   let query = new Query();
      //   let queryTask = new QueryTask(serviceUrl);
      //   query.returnGeometry = true;
      //   //query.outFields = [layerFieldName, 'de_cod_sqcodlog', 'AREA_TERRENO', 'TESTADA_T1'];
      //   //TODO VER QUAL OS CAMPOS QUE SERÃO NECESSÁRIOS NO CALCULO
      //   //TODO COLOCAR SÓ OS CAMPOS NECESSÁRIOS
      //   query.outFields = ['*'];
      //   query.outSpatialReference = {
      //     wkid: 3857
      //   };
      //   query.where = layerFieldName + ' = ' + "'" + geocodeLote + "'";

      //   queryTask.execute(query, showResults);

      //   function showResults(result) {
      //     if (result.features[0]) {
      //       console.info("tableLote --------",result)
      //       callback(result.features[0]);
      //     } else {
      //       // TODO
      //       console.info("tableLote withError --------",result)
      //       callback(result);
      //       // CALLBACK QUE MOSTRA UM LOTE SEM TESTADA PRINCIPAL
      //       //DocumentUtil.showMessage('warning', 'Não foi possível buscar dados na tabela do lote!', true, null, 'buscaTableLoteError');
      //     }
      //   }
      // },
      searchPlantaDeValores: function (testada, sqcodlog, areaTerreno, valores) {
        console.info("sqcodlog", sqcodlog);
        console.info("areaTerreno", areaTerreno)
        console.info("testada", testada)
        if (sqcodlog && areaTerreno) {
          console.info("valores ------------", valores)
          var valoresTerreno = valores.terreno;
          var valoresPredial = valores.predial;
          var valoresGeral = valores;
          areaTerreno = Number(valoresTerreno.area.replace(',', '.'));

          var valorTerrenoMinimo;
          var valorTerrenoMedio;
          var valorTerrenoMaximo;

          let serviceUrl = selfCalculo.config.plantaQuadraServiceUrl;
          let layerFieldName = 'sl_cadastro.SDE.ln_Planta_de_Valores.de_SQCODLOG';

          let query = new Query();
          let queryTask = new QueryTask(serviceUrl);
          query.returnGeometry = false;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };
          query.where = layerFieldName + ' = ' + "'" + sqcodlog + "' AND sl_cadastro.SDE.ln_Planta_de_Valores.de_n_face = '01'";
          console.info(query.where);
          queryTask.execute(query, showResults);
        } else {
          DocumentUtil.showMessage('warning', 'ERRO: Não foi possível encontrar uma relação entre o imóvel informado e uma face de quadra da planta de valores! Verifique se o logradouro do imóvel (código Logr.:' + sqcodlog.substring(6, 12) + ') é compatível com as informações da cartografia da planta de valores.', true, null, 'realizarCalculoError');
        }
        function showResults(result) {
          if (result.features.length > 0) {
            console.info("planta de valores result inteiro", result);
            selfCalculo.searchLote(31983, function (loteResult) {
              console.info("loteResult-------", loteResult);
              var plantaDeValor = result.features[0].attributes;
              console.info('planta de valor----', plantaDeValor);
              var centroidX;
              var centroidY;

              if (!loteResult.geometry) {
                centroidX = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_x"];
                centroidY = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_y"];
              } else {
                var centroid = loteResult.geometry.getCentroid();
                centroidX = centroid.x
                centroidY = centroid.y
              }

              var usoImovel = valoresGeral.isPredial
              var areaConst;
              var padraoConserv;
              var tipolog;
              var idadeImovel;
              var qtdePavimentos;

              if (usoImovel === false) {
                areaConst = 0;
                padraoConserv = 7;
                tipolog = 1;
                idadeImovel = 0;
                qtdePavimentos = 1;
              } else {
                areaConst = valoresPredial.areaConstruida;
                padraoConserv = valoresPredial.conservacao;
                tipolog = valoresPredial.tipologia;
                idadeImovel = valoresPredial.idade;
                qtdePavimentos = valoresPredial.pavimento;
              }

              var valorMinimo = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Inf"];
              var valorMedio = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Val_Unit2"];
              var valorMaximo = plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Lim_Sup"];
              //======================FRAÇÃO IDEAL====================//
              if (valoresGeral.predial.fracaoIdeal) {
                console.log('frcaoideal')
                let areater = areaTerreno
                areaTerreno = areater * valoresGeral.predial.fracaoIdeal;
              }

              var valorTerreno = calcularValorMetroQuadrado(
                centroidY,
                centroidX,
                areaTerreno,
                qtdePavimentos,
                testada,
                plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.nu_Renda_V003"],
                areaConst,
                padraoConserv,
                tipolog,
                idadeImovel,
                valoresTerreno.drenagem,
                valoresTerreno.esgoto,
                valoresTerreno.topografia,
                plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_grupo"],
                plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_zonas"],
                usoImovel
              );



              console.info("valor do m2 do terreno", valorTerreno);
              selfCalculo.valorUnit = valorTerreno;
              valorTerrenoMinimo = (areaTerreno * valorTerreno) * 0.85;
              valorTerrenoMedio = areaTerreno * valorTerreno;
              valorTerrenoMaximo = (areaTerreno * valorTerreno) * 1.15;
              console.log(valoresGeral);

              if (valores.isPredial) {
                var valorEdificacao = selfCalculo.getValorDaEdificacao(valores.predial.tipologia, valores.predial.padrao, valores.predial.areaConstruida, valores.predial.idade, valores.predial.conservacao, valores.predial.estrutura);
              } else {
                valorEdificacao = 0;
              }

              let total = {
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
                valorTerreno: valorTerreno,
                valorEdificacao: valorEdificacao,
                total: total
              };

              if (valorTerreno.minimo === 'NaN') {
                valorTerreno = {
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
                    class: 'btn btn-danger exportarcalculo',
                    style: 'margin-top: -26px;',
                    onclick: 'selfCalculo.exportResultCalculo("Resumido")'
                  }
                },
                {
                  label: 'Cálculo Detalhado',
                  attributes: {
                    class: 'btn btn-danger exportarcalculo',
                    style: 'margin-top: -26px; margin-left: 5px;',
                    onclick: 'selfCalculo.exportResultCalculo()'
                  }
                }]

              selfCalculo.randomValues(valorTerreno, valorEdificacao, total);
              if (plantaDeValor["sl_cadastro.SDE.ln_Planta_de_Valores.de_grupo"] === null) {
                DocumentUtil.showMessage('warning', 'ERRO: Para efetuar o cálculo é necessário que o imóvel informado faça parte de um dos blocos da planta de valores. A face de quadra informada não possui o campo "bloco" preenchido. Verifique o cadastro da face de quadra.', true, null, 'errorPlanta');
              } else {
                DocumentUtil.showMessageWithButton(buttons, 'info', 'Cálculo realizado com sucesso!', true, null, 'calculoSucesso');
                if (qtdePavimentos > 1) {
                  DocumentUtil.showMessage('warning', 'Este imóvel foi calculado com base em ' + qtdePavimentos + ' pavimentos, conforme informações do cadastro do sistema tributário!', true, null, 'realizarCalculoError');
                }
                //let valid = areaTerreno / testada
                //console.log(valid);
                //if (valid < 6) {
                //    DocumentUtil.showMessage('warning', 'Este imóvel foi calculado com base em uma testada de ' + testada + 'm, conforme o cadastro!', true, null, 'realizarCalculoError2');
                //}
              }
            });
          } else {
            selfCalculo.valoresCalculados = {};
            DocumentUtil.showMessage('warning', 'ERRO: Não foi possível encontrar uma relação entre o imóvel informado e uma face de quadra da planta de valores! Verifique se o logradouro do imóvel (código Logr.:' + sqcodlog.substring(6, 12) + ') é compatível com as informações da cartografia da planta de valores.', true, null, 'realizarCalculoError');
            //DocumentUtil.showMessage('warning', 'Não foi possível fazer o cálculo!', true, null, 'realizarCalculoError');
          }
        }
      },
      getValoresParaCalculo: function (data, callback) {
        let stmServiceUrl = selfCalculo.config.stmServiceUrl;
        let geocode = document.getElementById('geocode').value;
        let url = stmServiceUrl + geocode;
        let valoresTerreno = {};

        //salva ID do imovel para post da terceira avaliacao
        selfCalculo.idImovel = data.imovel_id;
        if (data) {
          let tipologia;
          let padrao;
          let areaConstruida;
          let idade = data.imovel_idade;
          let conservacao;
          let estrutura;
          let pavimento;
          let isPredial = false;

          for (let i = 0; i < data.bci_componentes.length; i++) {
            let bci_componentes = data.bci_componentes[i];

            if (bci_componentes.componente_tipo == 'Predial') {
              areaConstruida = bci_componentes.componente_area;
              pavimento = bci_componentes.componente_pavimentos;
              for (let j = 0; j < bci_componentes.componente_caracteristicas.length; j++) {
                let caracteristica = bci_componentes.componente_caracteristicas[j];
                if (caracteristica.nome === 'TIPOLOGIA') {
                  tipologia = caracteristica.conteudo.toLowerCase();
                }
                if (caracteristica.nome === 'PADRAOCONSTRUCAO') {
                  padrao = caracteristica.conteudo.toLowerCase();
                }
                if (caracteristica.nome === 'CONSERVACAO') {
                  conservacao = caracteristica.conteudo.toLowerCase();
                }
                if (caracteristica.nome === 'ESTRUTURA') {
                  estrutura = caracteristica.conteudo.toLowerCase();
                }
              }
              isPredial = true;
            } else if (bci_componentes.componente_tipo == 'Terreno') {
              valoresTerreno.area = bci_componentes.componente_area;
              valoresTerreno.pavimento = bci_componentes.componente_pavimentos;
              for (let k = 0; k < bci_componentes.componente_caracteristicas.length; k++) {
                let caracteristicaTerreno = bci_componentes.componente_caracteristicas[k];
                if (caracteristicaTerreno.nome === 'ESGOTO') {
                  valoresTerreno.esgoto = caracteristicaTerreno.conteudo.toLowerCase();
                }
                if (caracteristicaTerreno.nome === 'DRENAGEM') {
                  valoresTerreno.drenagem = caracteristicaTerreno.conteudo.toLowerCase();
                }
                if (caracteristicaTerreno.nome === 'TOPOGRAFIA') {
                  valoresTerreno.topografia = caracteristicaTerreno.conteudo.toLowerCase();
                }
              }
            }
          }

          if (tipologia && tipologia.indexOf('ap') !== -1) {
            tipologia = 'apartamento';
          }

          if (isPredial && (tipologia && padrao && areaConstruida && idade && conservacao)) {
            let dadosPredial = {
              tipologia: tipologia,
              padrao: padrao,
              areaConstruida: areaConstruida,
              idade: idade,
              conservacao: conservacao,
              estrutura: estrutura,
              pavimento: pavimento,
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
          } else if (isPredial) {
            let dadosPredial = {
              tipologia: tipologia,
              padrao: padrao,
              areaConstruida: areaConstruida,
              idade: idade,
              conservacao: conservacao,
              estrutura: estrutura,
              pavimento: pavimento,
              isPredial: isPredial
            };
            if (!tipologia) {
              dadosPredial.tipologia = 'Não preenchido';
            } else if (!padrao) {
              dadosPredial.padrao = 'Não preenchido';
            } else if (!areaConstruida) {
              dadosPredial.areaConstruida = 'Não preenchido';
            } else if (!idade) {
              dadosPredial.idade = 'Não preenchido';
            } else if (!conservacao) {
              dadosPredial.conservacao = 'Não preenchido';
            }

            DocumentUtil.showMessage('warning', 'Não foi possível realizar o calculo! Valores não preenchidos no STM!' + "\n" +
              'Tipologia = ' + dadosPredial.tipologia + '\n' +
              'Padrao = ' + dadosPredial.padrao + '\n' +
              'Área Construída = ' + dadosPredial.areaConstruida + '\n' +
              'Idade = ' + dadosPredial.idade + '\n' +
              'Conservação = ' + dadosPredial.conservacao + '\n'
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

        fetch(url)
          .then((data) => data.json())
          .then(data => {
            console.log(data);
            callback(null, data);
          })
          .catch(err => console.log(err));
        // $.getJSON(url, function(data) {
        //   console.log(data);
        //   // data = data[0];
        //   callback(null, data);
        // }).fail(function(err) {
        //   callback(err);
        // });
      },

      searchGeocodeUnidade: function (featureSelected, stmData, callback) {
        let stmServiceUrl = selfCalculo.config.stmServiceUrl;
        let geocode = document.getElementById('geocode').value;
        let url = stmServiceUrl + geocode;
        let geocodeUnidade = geocode;

        let geocodeUnidade16Char = geocode.substring(0, 16);

        let serviceUrl = selfCalculo.config.unidadeServiceUrl;
        let layerFieldName = 'DE_GEOCODE_LOTE';
        let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';

        let query = new Query();
        let queryTask = new QueryTask(serviceUrl);

        query.returnGeometry = true;
        query.outFields = ['*'];
        query.outSpatialReference = {
          wkid: 3857
        };
        query.where = layerFieldName + ' = ' + "'" + geocodeUnidade16Char + "'";
        console.info('query where', query.where);

        queryTask.execute(query, showResults);

        function showResults(result) {
          console.info("result", result);
          if (result.features[0]) {
            console.info("entrou no searchGeocodeUnidade - result - if");
            selfCalculo.getGeocodeBuffer(featureSelected, result.features[0]);
          } else {
            console.info("entrou no searchGeocodeUnidade - result - else");
            //DocumentUtil.showMessage('warning', 'Não existe unidade para esse Lote!', true, null, 'semUnidadeError');
          }
        }
      },
      fillStmData: function (stmData) {
        let dadosImovel;
        let dadosProprietario;
        let dadosTerreno;
        let dadosPredial;
        let caracteristicas;

        if (stmData) {
          let configJson = selfCalculo.config;
          // selfCalculo.resultadosBuscaModel(stmData, configJson);

          // dadosImovel = resultadosBusca.getDadosImovel();
          // dadosProprietario = resultadosBusca.getDadosProprietario();
          // dadosTerreno = resultadosBusca.getDadosTerreno();
          // dadosPredial = resultadosBusca.getDadosPredial();

          dadosImovel = stmData.imovelWS;
          caracteristicas = stmData.caracteristicas;
          console.log({ dadosImovel, caracteristicas })
        }

        let tableDiv = document.getElementById('unidadeTable');
        while (tableDiv.hasChildNodes()) {
          tableDiv.removeChild(tableDiv.firstChild);
        }
        if (stmData) {

          console.log(dadosImovel);

          let tbody = document.createElement('tbody');
          tableDiv.appendChild(tbody);

          factoryViewDataSTM("Informações gerais do Imóvel", tbody, dadosImovel);
          factoryViewDataSTM("Características gerais do Imóvel", tbody, caracteristicas);
          // factoryViewDataSTM("Informações gerais do Terreno", tbody, dadosTerreno);
          // factoryViewDataSTM("Informações gerais do Predial", tbody, dadosPredial);
        }
      },
      getGeocodeBuffer: function (featureSelected, unidadeSelected) {
        //VERIFICAR O GEOMETRY SERVER
        let serviceUrl = selfCalculo.config.loteServiceUrl;
        let gsv = new GeometryService(selfCalculo.config.geometryServerServiceUrl);
        // setup the buffer parameters
        let params = new BufferParameters();
        params.distances = [0.5];
        params.geometries = [featureSelected.geometry.getCentroid()];
        params.outSpatialReference = selfCalculo.map.spatialReference;
        params.unit = GeometryService.UNIT_KILOMETER;
        params.outFields = ['sjr_cadastro.gis.Lote.OBJECTID'];
        gsv.buffer(params, showBuffer);

        function showBuffer(bufferedGeometries) {
          let featureLayer = new FeatureLayer(serviceUrl, {
            outFields: ['sjr_cadastro.gis.Lote.OBJECTID']
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
            console.info("circleGeometry", circleGeometry);
            selfCalculo.circleGeometry = circleGeometry;
            console.info("circleGeometry", circleGeometry);
            console.info("go to layer", selfCalculo.circleGeometry);
            let circleSymb = new SimpleFillSymbol(
              SimpleFillSymbol.STYLE_NULL,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
                new Color([105, 105, 105]),
                2
              ), new Color([255, 255, 0, 0.25])
            );

            console.info("circleSymb", circleSymb);

            let graphic = new Graphic(circleGeometry, circleSymb);
            selfCalculo.map.setExtent(circleGeometry.getExtent(), true);
            // TODO fazer destacar pesquisas dentro do círculo
            selfCalculo.drawPesquisa(circleGeometry, unidadeSelected);

            let query = new Query();
            query.geometry = circleGeometry.getExtent();
            query.outFields = ['sjr_cadastro.gis.Lote.stg_geocode', 'sjr_cadastro.gis.TB_LOTES.DE_GEOCODE_LOTE', 'sjr_cadastro.gis.Lote.OBJECTID'];
            // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
            featureLayer.queryFeatures(query, selectInBuffer);

            function selectInBuffer(response) {
              let feature;
              let features = response.features;
              let inBuffer = [];
              // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
              for (let i = 0; i < features.length; i++) {
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

          for (var i = 0; i < transmissoes.length; i++) {
            if (transmissoes[i].unidade) {
              for (let f = 0; f < featureList.length; f++) {
                let hasGeocode = false;
                let hasUnidade = false;
                for (var g = 0; g < similarGeocode.length; g++) {
                  if (similarGeocode[g] === transmissoes[i].attributes['de_geocode_lote']) {
                    hasGeocode = true;
                  }
                }

                for (var g = 0; g < similarUnidade.length; g++) {
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
            DocumentUtil.showMessage('info', 'Foram localizados imóveis com unidades semelhantes no mesmo lote da inscrição informada.');
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
            DocumentUtil.showMessage('warning', 'Não foram encontradas unidades semelhantes!', true, null, 'semUnidadeSemelhanteError');
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

        let query = new Query();
        query.geometry = circleGeometry.getExtent();
        query.outFields = ['*'];
        // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
        featureLayer.queryFeatures(query, selectInBuffer);

        function selectInBuffer(response) {
          let feature;
          let features = response.features;
          let inBuffer = [];
          // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
          for (var i = 0; i < features.length; i++) {
            feature = features[i];

            let pesquisaSemelhancas = {};
            if (feature.attributes.de_Tipo_do_Imovel.trim()) {
              pesquisaSemelhancas.tipo = feature.attributes.de_Tipo_do_Imovel;
            } else {
              pesquisaSemelhancas.tipo = null;
            }

            if (feature.attributes.de_Tipologia.trim()) {
              pesquisaSemelhancas.tipologia = feature.attributes.de_Tipologia;
            } else {
              pesquisaSemelhancas.tipologia = null;
            }

            if (feature.attributes.de_Conservacao.trim()) {
              pesquisaSemelhancas.conservacao = feature.attributes.de_Conservacao;
            } else {
              pesquisaSemelhancas.conservacao = null;
            }

            if (circleGeometry.contains(feature.geometry) && pesquisaSemelhancas.tipologia === unidadeSemelhancas.tipologia) {
              if (pesquisaSemelhancas.tipo === unidadeSemelhancas.tipo) {
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
            DocumentUtil.showMessage('warning', 'AVISO: Não foram localizadas Pesquisas de Mercado que tenham características semelhantes à inscrição imobiliária informada. Isso não impede que o cálculo seja efetuado!', true, null, 'semPesquisaSemelhanteError');
          }
          // selfCalculo.drawSimilar(inBuffer, featureSelected, unidadeSelected);
        }
      },
      goToLayer: function () {
        console.info("go to layer", selfCalculo.geometryLote);
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

          console.log(
            data.coodY,
            data.coodX,
            data.areaPadrao,
            data.pavimentacao,
            data.testadaMedia,
            data.rendaSetor,
            data.areaConst,
            data.padraoConserv,
            data.tipo,
            data.idade,
            data.drenagem,
            data.esgoto,
            data.topografia,
            data.bloco,
            data.zonaUrbana,
            data.tipoUso,
            inscricao,
            selfCalculo.valoresCalculados,
            selfCalculo.CUB,
            selfCalculo.depreciacao,
            data.pedologia,
            data.padraoConstrucao
          );

          pdfMake.createPdf(pdfObjectsBlocos(
            data.coodY,
            data.coodX,
            data.areaPadrao,
            data.pavimentacao,
            data.testadaMedia,
            data.rendaSetor,
            data.areaConst,
            data.padraoConserv,
            data.tipo,
            data.idade,
            data.drenagem,
            data.esgoto,
            data.topografia,
            data.bloco,
            data.zonaUrbana,
            data.tipoUso,
            inscricao,
            selfCalculo.valoresCalculados,
            selfCalculo.CUB,
            selfCalculo.depreciacao,
            data.pedologia,
            data.padraoConstrucao
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
        let valorMinimo = selfCalculo.minimoTerceiraAvaliacao;
        let terceiraAvaliacaoValue = document.getElementById('terceiraAvaliacaoInput').value.replace(/\./g, '').replace(',', '.');
        let terceiraAvaliacaoBancariaValue = document.getElementById('terceiraAvaliacaoBancaria').value.replace(/\./g, '').replace(',', '.');
        if (Number(terceiraAvaliacaoValue) > Number(valorMinimo)) {
          let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');
          $.ajax({
            url: 'https://sigribamar.com.br/geoitbi_api_java/terceiraavaliacao',
            type: 'post',
            data: {
              geocodigo: geocode,
              username: JSON.parse(localStorage["ngStorage-dados"]).usuario.username,
              imovelId: selfCalculo.idImovel,
              valorAvaliacao: terceiraAvaliacaoValue,
              valorBancaria: terceiraAvaliacaoBancariaValue,
              valorEdificacao: selfCalculo.valoresCalculadosTerceira.valorEdificacao,
              valoresCalculados: selfCalculo.valoresCalculadosTerceira
            },
            headers: {
              authorization: headerAuthorization // If your header name has spaces or any other char not appropriate
            },
            dataType: 'json',
            success: function (data) {
              DocumentUtil.showMessage('success', 'Terceira Avaliação Salva com Sucesso!', true, null, null);
            },
            error: function (xhr, ajaxOptions, thrownError) {
              if (xhr.responseJSON) {
                DocumentUtil.showMessage('warning', xhr.responseJSON.message, true, null, 'semAutorizacaoTerceiraAvaliacao');
              } else {
                DocumentUtil.showMessage('warning', 'Não foi possível se comunicar com o servidor!', true, null, 'semAutorizacaoTerceiraAvaliacao');
              }
            }
          });
          DocumentUtil.showMessage('success', 'Terceira Avaliação Salva com Sucesso!', true, null, null);
        } else {
          DocumentUtil.showMessage('warning', 'Valor da 3ª Avaliação não pode ser menor que ' + numberParaReal(valorMinimo) + '. ', true, null, 'valorMenorQueMinimoTerceiraAvaliacao');
        }
      },
      getTransmissoes: function (featureList, featureSelected, unidadeSelected, callback) {
        let transmissaoServiceUrl = selfCalculo.config.transmissaoServiceUrl;
        let layerFieldName = 'de_geocode_lote';
        let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';
        let query = new Query();
        let queryTask = new QueryTask(transmissaoServiceUrl);
        query.returnGeometry = true;
        query.outFields = ['OBJECTID', 'de_geocode_lote', 'de_geocode'];
        query.outSpatialReference = {
          wkid: 3857
        };
        let whereQuery = layerFieldName + ' IN(';
        for (let i = 0; i < featureList.length; i++) {
          whereQuery += "'" + featureList[i].attributes['sl_cadastro.SDE.Lote.GEOC_RENU'] + "'";
          if (i + 1 < featureList.length) {
            whereQuery += ', ';
          }
        }
        whereQuery += ')';
        // query.where = whereQuery + " AND destinacao = '" + unidadeSelected.attributes.destinacao + "'" + " AND ocupacao = '" + unidadeSelected.attributes.ocupacao + "'" + " AND destinacao = '" + unidadeSelected.attributes.destinacao + "'" + " AND conservacao = '" + unidadeSelected.attributes.conservacao + "'" + " AND tipologia = '" + unidadeSelected.attributes.tipologia + "'" + " AND piscina = '" + unidadeSelected.attributes.piscina + "'" + " AND predial = '" + unidadeSelected.attributes.predial + "'";
        query.where = whereQuery;
        queryTask.execute(query, function (result) {
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
        if (tipologia === 'cobertura metálica' || tipologia === 'cob metalica' || tipologia === 'comércio com residência' || tipologia === 'com c/ residencia') {
          tipologia = 'comercio com residencia';
        }
        if (tipologia === 'edificação complementar' || tipologia === 'garagem') {
          tipologia = 'casa';
        }
        if (tipologia === 'templo') {
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

        let r8n = 1194.74;
        return valorCub * r8n;
      },
      getValorDaEdificacao: function (tipologia, padraoConstrucao, areaConstruida, idade, estadoDeConservacao, estrutura) {
        let custoUnitarioBasico = selfCalculo.getCustoUnitarioBasico(tipologia, padraoConstrucao, estrutura);
        let depreciacaoFisica = selfCalculo.getDepreciacaoFisica(idade, estadoDeConservacao);
        selfCalculo.CUB = custoUnitarioBasico;
        selfCalculo.depreciacao = depreciacaoFisica;
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
  // if (geocode.length == 19) {
  //   searchImovelButton.disabled = false;
  // } else {
  searchImovelButton.disabled = false;
  // }
}

function factoryViewDataSTM(title, tbody, dados) {
  let tr = document.createElement('tr');
  let tdLabel = document.createElement('td');
  // let tdValue = document.createElement('td');
  let label = document.createElement('label');
  tdLabel.appendChild(label);
  tdLabel.setAttribute('class', 'tbody-blue');
  tdLabel.setAttribute('colspan', '2');
  // tdValue.setAttribute('class', 'tbody-blue');
  tr.appendChild(tdLabel);
  // tr.appendChild(tdValue);
  
  let t = document.createTextNode(title);
  label.appendChild(t);
  tbody.appendChild(tr);

  const aliases =  selfCalculo.config.imovelLabels ?
   selfCalculo.config.imovelLabels : {};
  
  Reflect.ownKeys(dados).forEach(function (value) {
    const tr = document.createElement('tr');
    const tdLabel = document.createElement('td');
    const tdValue = document.createElement('td');
    const label = document.createElement('label');
    tdLabel.appendChild(label);
    tdLabel.setAttribute('class', 'td-gray');
    tr.appendChild(tdLabel);
    tr.appendChild(tdValue);

    const t = document.createTextNode(aliases[value] || value);

    const ted = (dados[value] !== 'null' && dados[value] !== null && dados[value] !== undefined && dados[value] !== '') ?
      document.createTextNode(dados[value]) : document.createTextNode('');

      label.appendChild(t);
      // if (Array.isArray(dados[value])) {
      //   tdValue.appendChild(document.createTextNode(''));
      // } else {
      tdValue.appendChild(ted);
      // }
      tbody.appendChild(tr);

  });
  // for (value in dados) {
  //   let tr = document.createElement('tr');
  //   let tdLabel = document.createElement('td');
  //   let tdValue = document.createElement('td');
  //   let label = document.createElement('label');
  //   tdLabel.appendChild(label);
  //   tdLabel.setAttribute('class', 'td-gray');
  //   tr.appendChild(tdLabel);
  //   tr.appendChild(tdValue);

  //   // let t = document.createTextNode(aliases[value]);
  //   let t = document.createTextNode(value);

  //   let ted;

  //   if (dados[value] !== 'null' && dados[value] !== null && dados[value] !== undefined && dados[value] !== '') {
  //     ted = document.createTextNode(dados[value]);
  //   } else {
  //     ted = document.createTextNode('');
  //   }

  //   if (Array.isArray(dados[value])) {
  //     ted = document.createTextNode('');
  //   }

  //   label.appendChild(t);
  //   tdValue.appendChild(ted);
  //   tbody.appendChild(tr);
  // };

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

function calcularValorMetroQuadrado(coodY, coodX, areaPadrao, qtdPavimentos, testadaMedia, rendaSetor, areaConst, padraoConserv, tipo, idade, drenagem, esgoto, topografia, bloco, zonaUrbana, tipoUso) {
  //constantes
  var eLn = 2.718281828459045;
  var valorUnit;

  if (tipo) {
    tipo = 1;
  }

  if (!qtdPavimentos) {
    qtdPavimentos = 1;
  }

  if (drenagem === 'não tem') {
    drenagem = 0;
  } else {
    drenagem = 1;
  }

  if (esgoto === 'não tem') {
    esgoto = 0;
  } else {
    esgoto = 1;
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

  if (topografia === 'plana') {
    topografia = 1;
  } else if (topografia === 'aclive suave') {
    topografia = 2;
  } else if (topografia === 'aclive acentuado') {
    topografia = 3;
  } else if (topografia === 'declive suave') {
    topografia = 4;
  } else if (topografia === 'declive acentuado') {
    topografia = 5;
  } else if (topografia === 'irregular') {
    topografia = 6;
  }

  if (zonaUrbana === 'urbano') {
    zonaUrbana = 1;
  } else if (zonaUrbana === 'urbana/industrial') {
    zonaUrbana = 2;
  } else if (zonaUrbana === 'rural') {
    zonaUrbana = 3;
  } else if (zonaUrbana === null) {
    zonaUrbana = null;
  }

  console.info('dados calculo', coodY, coodX, areaPadrao, qtdPavimentos, testadaMedia, rendaSetor, areaConst, padraoConserv, tipo, idade, drenagem, esgoto, topografia, bloco)

  if (bloco === 'Bloco I') {
    valorUnit = Math.pow((-1244.7487 + (0.000000000019918227 * Math.pow(coodY, 2)) + (-0.0000000018324684 * Math.pow(coodX, 2)) + (0.000000001801289 * Math.pow(areaPadrao, 2)) + (2.4943315 * qtdPavimentos) + (0.0019993246 * Math.pow(testadaMedia, 2)) + (0.0000030366837 * rendaSetor)), 2);
  } else if (bloco === 'Bloco II') {
    valorUnit = 7.742108705966203352487675899668e+81 * Math.pow(eLn, -0.0000000000031536032 * Math.pow(coodY, 2)) * Math.pow(eLn, -0.00000000017332165 * Math.pow(coodX, 2)) * Math.pow(eLn, -14358.838 * (1 / rendaSetor)) * Math.pow(eLn, -0.00000019996231 * Math.pow(areaPadrao, 2)) * Math.pow(eLn, 0.00036361237 * areaConst) * Math.pow(eLn, -0.0089674519 * Math.pow(padraoConserv, 2)) * Math.pow(eLn, 0.62922743 * Math.pow(tipo, 0.5)) * Math.pow(eLn, 0.0055415258 * Math.pow(testadaMedia, 2)) * Math.pow(eLn, -0.000049683898 * Math.pow(idade, 2));
  } else if (bloco === 'Bloco III') {
    valorUnit = 1 / Math.pow(0.9701669 - (0.000000000000019110612 * Math.pow(coodY, 2)) + (0.0000000000026379857 * Math.pow(coodX, 2)) - (4.7631089 * (1 / Math.pow(areaPadrao, 2))) - (0.018723065 * drenagem) - (0.0000026963265 * Math.pow(testadaMedia, 2)) + (302964390 * (1 / Math.pow(rendaSetor, 2))), 2);
  } else if (bloco === 'Bloco IV') {
    valorUnit = Math.pow(4356.8578 - 423628850000000000 * 1 / Math.pow(coodY, 2) + 0.00000000041166656 * Math.pow(coodX, 2) - 0.030671871 * Math.pow(areaPadrao, 0.5) + 1.3467551 * qtdPavimentos + 0.00067587177 * Math.pow(testadaMedia, 2) + 0.0000000000041779087 * Math.pow(rendaSetor, 2), 2);
  } else if (bloco === 'Bloco V') {
    valorUnit = 1.6763762010799043448308147134737e+57 * Math.pow(eLn, -12228988000000000 * (1 / Math.pow(coodY, 2))) * Math.pow(eLn, 0.000000000018534479 * Math.pow(coodX, 2)) * Math.pow(eLn, 0.20619312 * drenagem) * Math.pow(eLn, 0.52699801 * (1 / testadaMedia)) * Math.pow(eLn, -166797.51 * (1 / rendaSetor)) * Math.pow(eLn, -0.00000095309642 * Math.pow(areaConst, 2)) * Math.pow(eLn, 0.087573675 * Math.pow(areaPadrao, 0.5)) * Math.pow(eLn, -1.0962437 * Math.pow(padraoConserv, 0.5)) * Math.pow(eLn, -0.000060816151 * Math.pow(idade, 2));
  } else if (bloco === 'Bloco VI') {

    if (!tipoUso) {
      areaConst = 0;
      padraoConserv = 7;
      tipo = 1;
      idade = 0;
    }

    valorUnit = (2.3570325e+89 * Math.pow(eLn, -16758505000000000 * (1 / Math.pow(coodY, 2))) * Math.pow(eLn, -0.000000000064551228 * Math.pow(coodX, 2)) * Math.pow(eLn, 0.79259538 * esgoto) * Math.pow(eLn, -0.014018364 * testadaMedia) * Math.pow(rendaSetor, 0.075673609) * Math.pow(eLn, 0.0020594044 * areaConst) * Math.pow(areaPadrao, 0.35229635) * Math.pow(eLn, 1.8883073 * (1 / padraoConserv)) * Math.pow(eLn, -0.0071952145 * idade) * Math.pow(eLn, 0.15055057 * tipo)) / areaPadrao;
  } else if (bloco === 'Bloco VII') {
    valorUnit = 1 / Math.pow((0.52324161 - 0.0000000000000054410184 * Math.pow(coodY, 2) + 0.014525888 * (1 / Math.pow(testadaMedia, 0.5)) - 0.00013718481 * Math.pow(areaConst, 0.5) - 0.0013009123 * Math.log(areaPadrao) + 0.000038485322 * Math.pow(padraoConserv, 2) + 0.0000018311162 * Math.pow(idade, 2) - 0.0027996973 * (1 / Math.pow(topografia, 2)) - 0.0028490535 * (1 / Math.pow(zonaUrbana, 2))), 2);
  }
  console.info('VALOR UNIT ----', valorUnit);

  var dataToExport = {
    coodY, coodX, areaPadrao, qtdPavimentos, testadaMedia, rendaSetor, areaConst, padraoConserv, tipo, idade, drenagem, esgoto, topografia, bloco, zonaUrbana, tipoUso
  }
  selfCalculo.dataToExport = dataToExport;

  return valorUnit;
}

function saveGeocodeInArray(geocode) {
  recentsGeocodes.push(geocode);
  if (recentsGeocodes.length > 7) {
    recentsGeocodes.shift();
  }
  updateGeocodesInLocalStorage();
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