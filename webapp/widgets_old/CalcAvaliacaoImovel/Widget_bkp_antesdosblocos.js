/* global define $:true */
let selfCalculo;
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
    'xstyle/css!./css/style.css'
  ],
  function(
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
    template) {
    // To create a widget, you need to derive from BaseWidget.
    // TODO: ATUALMENTE O CÓDIGO SÓ FUNCIONA NO CHROME FAZER!!

    return declare([BaseWidget], {
      // Custom widget code goes here
      templateString: template,
      baseClass: 'jimu-widget-CalcAvaliacaoImovel',
      postCreate: function() {
        selfCalculo = this;
        // window.esriMap = this.map;

        let mainDivEditar = document.getElementById('main-page');
        let dialogDivEditar = document.createElement('dialog');
        dialogDivEditar.id = 'myWidgetDialogCalculo';
        mainDivEditar.appendChild(dialogDivEditar);
        dialogDivEditar.setAttribute('class', 'jimu-widget-tecgeo');
        $('#myWidgetDialogCalculo').load('widgets/CalcAvaliacaoImovel/dialog.html');
      },
      startup: function() {
        activeBuscarCalculo();
        $(document).ready(function() {
          $('.money').mask('000.000.000.000.000,00', {
            reverse: true
          });
          $('.money2').mask('#.##0,00', {
            reverse: true
          });
        });
        if(localStorage["ngStorage-insc"]){
          let inscr = localStorage["ngStorage-insc"].replace(/"/g ,'');
          let input = document.getElementById('geocode')
          input.value = inscr
          input.disabled = true;
          setTimeout(function() { document.getElementById('searchImovelButton').disabled = true; }, 1000);
          this.searchImovel();
        }
      },
      buttonAction: function() {
        let element = document.getElementById('myWidgetDialogCalculo');
        if (element.hasAttribute('open')) {
          element.removeAttribute('open');
        } else {
          element.setAttribute('open', 'false');
        }
      },
      randomValues: function(valorTerreno, valorEdificacao, total) {
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
      searchImovel: function() {
        DocumentUtil.showSpinner(true);
        selfCalculo.clearGraphics(true);
        selfCalculo.getDataFromStm(function(err, stmData) {
          if (err) {
            DocumentUtil.showSpinner(false);
            DocumentUtil.showMessage('warning', 'Não foi possível se comunicar com a STM!', true, null, 'comunicacaoStmError');
          } else {
            let geocode = document.getElementById('geocode').value;
            selfCalculo.geocodeSelect = geocode;
            selfCalculo.fillStmData(stmData);

            activeCalculoLimpar();

            selfCalculo.searchTableLote(function(tableLoteFeature) {
              let valores = selfCalculo.getValoresParaCalculo(stmData);

              if (valores && valores.isPredial) {
                selfCalculo.searchPlantaDeValores(tableLoteFeature.attributes['TESTADA_T1'], tableLoteFeature.attributes['de_cod_sqcodlog'], tableLoteFeature.attributes['AREA_TERRENO'], valores);
              } else if (valores && !valores.isPredial) {
                selfCalculo.searchPlantaDeValores(tableLoteFeature.attributes['TESTADA_T1'], tableLoteFeature.attributes['de_cod_sqcodlog'], tableLoteFeature.attributes['AREA_TERRENO'], valores);
              }
            });

            selfCalculo.searchLote(3857, function(loteFeature) {
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
                // TODO
                DocumentUtil.showMessage('warning', 'Não foi possível buscar geometria do lote!', true, null, 'buscaGeometriaError');
              }
              DocumentUtil.showSpinner(false);
            });
          }
        });
      },
      searchLote: function(wkid, callback) {
        if (!wkid) {
          wkid = 3857;
        }

        let geocode = document.getElementById('geocode').value;
        let geocodeLote = geocode.substring(2, 12);
        let serviceUrl = selfCalculo.config.loteServiceUrl;
        let layerFieldName = 'sl_cadastro.SDE.Lote.GEOC_RENU';
        let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';

        let query = new Query();
        let queryTask = new QueryTask(serviceUrl);
        query.returnGeometry = true;
        query.outFields = [layerFieldName, shapeFieldName, 'sl_cadastro.SDE.Lote.de_cod_sqcodlog', 'sl_cadastro.SDE.TB_LOTES.AREA_TERRENO'];
        // query.outFields = ['*'];
        query.outSpatialReference = {
          wkid: wkid
        };
        query.where = layerFieldName + ' = ' + "'" + geocodeLote + "'";

        queryTask.execute(query, showResults);

        function showResults(result) {
          if (result.features[0]) {
            callback(result.features[0]);
          } else {
            // TODO
            DocumentUtil.showMessage('warning', 'Não foi possível buscar geometria do lote!', true, null, 'buscaGeometriaError');
          }
        }
      },
      searchTableLote: function(callback) {
        let geocode = document.getElementById('geocode').value;
        let geocodeLote = geocode.substring(2, 12);
        let serviceUrl = selfCalculo.config.tableLoteServiceUrl;
        let layerFieldName = 'GEOCODE_LOTE';

        let query = new Query();
        let queryTask = new QueryTask(serviceUrl);
        query.returnGeometry = true;
        query.outFields = [layerFieldName, 'de_cod_sqcodlog', 'AREA_TERRENO', 'TESTADA_T1'];
        // query.outFields = ['*'];
        query.outSpatialReference = {
          wkid: 3857
        };
        query.where = layerFieldName + ' = ' + "'" + geocodeLote + "'";

        queryTask.execute(query, showResults);

        function showResults(result) {
          if (result.features[0]) {
            callback(result.features[0]);
          } else {
            // TODO
            DocumentUtil.showMessage('warning', 'Não foi possível buscar dados na tabela do lote!', true, null, 'buscaTableLoteError');
          }
        }
      },
      searchPlantaDeValores: function(testada, sqcodlog, areaTerreno, valores) {
        if (sqcodlog && areaTerreno) {
          var valoresTerreno = valores.terreno;
          var valoresPredial = valores.predial;
          areaTerreno = Number(valoresTerreno.area.replace(',', '.'));
          testada = Number(testada.replace(',', '.'));
          var valorTerrenoMinimo;
          var valorTerrenoMedio;
          var valorTerrenoMaximo;

          let serviceUrl = selfCalculo.config.plantaQuadraServiceUrl;
          let layerFieldName = 'de_SQCODLOG';

          let query = new Query();
          let queryTask = new QueryTask(serviceUrl);
          query.returnGeometry = false;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };
          query.where = layerFieldName + ' = ' + "'" + sqcodlog + "' AND de_n_face = '01'";

          queryTask.execute(query, showResults);
        } else {
          DocumentUtil.showMessage('warning', 'Não foi possível fazer realizar o cálculo!', true, null, 'realizarCalculoError');
        }
        function showResults(result) {
          if (result.features.length > 0) {
            selfCalculo.searchLote(31983, function(loteResult) {
              var valorMinimo = 0;
              var valorMedio = 0;
              var valorMaximo = 0;
              var valorTerreno;
              var centroid = loteResult.geometry.getCentroid();

              var plantaDeValor = result.features[0].attributes;
              var valorMinimo = plantaDeValor.nu_Lim_Inf;
              var valorMedio = plantaDeValor.nu_Val_Unit2;
              var valorMaximo = plantaDeValor.nu_Lim_Sup;
              var valorTerreno;

              var valorTerreno = calcularValorMetroQuadrado(centroid.y, centroid.x, areaTerreno, valoresTerreno.pavimento, testada, plantaDeValor.nu_Renda_V003);

              valorTerrenoMinimo = (areaTerreno * valorTerreno) * 0.85;
              valorTerrenoMedio = areaTerreno * valorTerreno;
              valorTerrenoMaximo = (areaTerreno * valorTerreno) * 1.15;

              if (valores.fracaoIdeal) {
                var fracaoIdeal = valores.fracaoIdeal;
                // valorTerrenoMinimo = valorTerrenoMinimo / fracaoIdeal;
                // valorTerrenoMedio = valorTerrenoMedio / fracaoIdeal;
                // valorTerrenoMaximo = valorTerrenoMaximo / fracaoIdeal;
              }
              if (valores.isPredial) {
                var valorEdificacao = selfCalculo.getValorDaEdificacao(valores.predial.tipologia, valores.predial.padrao, valores.predial.areaConstruida, valores.predial.idade, valores.predial.conservacao);
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

              selfCalculo.randomValues(valorTerreno, valorEdificacao, total);
            });
          } else {
            selfCalculo.valoresCalculados = {};
            DocumentUtil.showMessage('warning', 'Não foi possível fazer realizar o cálculo!', true, null, 'realizarCalculoError');
          }
        }
      },
      getValoresParaCalculo: function(data, callback) {
        let stmServiceUrl = selfCalculo.config.stmServiceUrl;
        let geocode = document.getElementById('geocode').value;
        let url = stmServiceUrl + geocode;
        let valoresTerreno = {};

        if (data) {
          let tipologia;
          let padrao;
          let areaConstruida;
          let idade = data.imovel_idade;
          let conservacao;
          let isPredial = false;

          for (let i = 0; i < data.bci_componentes.length; i++) {
            let bci_componentes = data.bci_componentes[i];

            if (bci_componentes.componente_tipo == 'Predial') {
              areaConstruida = bci_componentes.componente_area;
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
              }
              isPredial = true;
            } else if (bci_componentes.componente_tipo == 'Terreno') {
              valoresTerreno.area = bci_componentes.componente_area;
              valoresTerreno.pavimento = bci_componentes.componente_pavimentos;
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
              isPredial: isPredial
            };
            if (data.imovel_tipo_condominio === 'PCD') {
              dadosPredial.fracaoIdeal = data.imovel_fracao_ideal;
            }

            return {
              predial: dadosPredial,
              terreno: valoresTerreno,
              isPredial: isPredial
            };
          } else if (isPredial) {
            DocumentUtil.showMessage('warning', 'Não foi possível realizar o calculo! Faltando Valores!', true, null, 'realizarCalculoError');
            return null;
          } else {
            return {
              isPredial: isPredial,
              terreno: valoresTerreno
            };
          }
        }
      },
      getDataFromStm: function(callback) {
        let stmServiceUrl = selfCalculo.config.stmServiceUrl;
        let geocode = document.getElementById('geocode').value;
        let url = stmServiceUrl + geocode;

        $.getJSON(url, function(data) {
          data = data[0];
          callback(null, data);
        }).fail(function(err) {
          callback(err);
        });
      },

      searchGeocodeUnidade: function(featureSelected, stmData, callback) {
        let stmServiceUrl = selfCalculo.config.stmServiceUrl;
        let geocode = document.getElementById('geocode').value;
        let url = stmServiceUrl + geocode;
        let geocodeUnidade = geocode.substring(2, 16);

        let serviceUrl = selfCalculo.config.unidadeServiceUrl;
        let layerFieldName = 'geocode_id';
        let shapeFieldName = 'sl_cadastro.SDE.Lote.Shape';

        let query = new Query();
        let queryTask = new QueryTask(serviceUrl);

        query.returnGeometry = true;
        query.outFields = ['*'];
        query.outSpatialReference = {
          wkid: 3857
        };
        query.where = layerFieldName + ' LIKE ' + "'%" + geocodeUnidade + "%'";

        queryTask.execute(query, showResults);

        function showResults(result) {
          if (result.features[0]) {
            selfCalculo.getGeocodeBuffer(featureSelected, result.features[0]);
          } else {
            DocumentUtil.showMessage('warning', 'Não existe unidade para esse Lote!', true, null, 'semUnidadeError');
          }
        }
      },
      fillStmData: function(stmData) {
        if (stmData) {
          var data = selfCalculo.putLabel(stmData, selfCalculo.config.stmLabels);
        }

        let tableDiv = document.getElementById('unidadeTable');
        while (tableDiv.hasChildNodes()) {
          tableDiv.removeChild(tableDiv.firstChild);
        }
        if (data) {
          let tbody = document.createElement('tbody');
          tableDiv.appendChild(tbody);
          for (let variable in data) {
            if (data.hasOwnProperty(variable)) {
              if (variable != 'bci_componentes') {
                let tr = document.createElement('tr');
                let tdLabel = document.createElement('td');
                let tdValue = document.createElement('td');
                let label = document.createElement('label');
                tdLabel.appendChild(label);
                tdLabel.setAttribute('class', 'td-gray');
                tr.appendChild(tdLabel);
                tr.appendChild(tdValue);
                let t = document.createTextNode(data[variable].label);

                var ted;
                if (data[variable].value && data[variable].value.toLowerCase() !== 'null') {
                  ted = document.createTextNode(data[variable].value);
                } else {
                  ted = document.createTextNode('');
                }

                label.appendChild(t);
                tdValue.appendChild(ted);
                tbody.appendChild(tr);
              }
            }
          }
          let indexPredial;
          let indexTerritorial;
          let bciComponente = data['bci_componentes'].value;

          if (bciComponente) {
            for (var i = 0; i < bciComponente.length; i++) {
              if (bciComponente[i].componente_tipo === 'Terreno') {
                selfCalculo.fillBciData(bciComponente[i], tbody);
                break;
              }
            }

            for (var i = 0; i < bciComponente.length; i++) {
              if (bciComponente[i].componente_tipo === 'Predial') {
                selfCalculo.fillBciData(bciComponente[i], tbody);
              }
            }
          }
        }
      },
      fillBciData: function(data, parentDiv) {
        if (data) {
          let dados = selfCalculo.putLabel(data, selfCalculo.config.bciLabels);

          // var tbody = document.createElement('tbody')
          var tr = document.createElement('tr');
          var tdLabel = document.createElement('td');
          var tdValue = document.createElement('td');
          var label = document.createElement('label');
          tdLabel.appendChild(label);
          tdLabel.setAttribute('class', 'td-gray');
          tdValue.setAttribute('class', 'td-gray');
          tr.appendChild(tdLabel);
          tr.appendChild(tdValue);
          var t = document.createTextNode('Bci ' + dados.componente_tipo.value);
          var ted = document.createTextNode('');
          label.appendChild(t);
          tdValue.appendChild(ted);
          parentDiv.appendChild(tr);

          for (let variable in dados) {
            if (dados.hasOwnProperty(variable)) {
              if (variable !== 'componente_caracteristicas') {
                var tr = document.createElement('tr');
                var tdLabel = document.createElement('td');
                var tdValue = document.createElement('td');
                var label = document.createElement('label');
                tdLabel.appendChild(label);
                tdLabel.setAttribute('class', 'td-gray');
                tr.appendChild(tdLabel);
                tr.appendChild(tdValue);
                var t = document.createTextNode(dados[variable].label);
                var ted;
                if (dados[variable].value && dados[variable].value.toLowerCase() !== 'null') {
                  ted = document.createTextNode(dados[variable].value);
                } else {
                  ted = document.createTextNode('');
                }
                label.appendChild(t);
                tdValue.appendChild(ted);
                parentDiv.appendChild(tr);
              }
            }
          }

          if (dados.componente_caracteristicas) {
            let caracteristicaList = dados.componente_caracteristicas.value;
            let caracteristicaComponentes = [];

            for (let i = 0; i < caracteristicaList.length; i++) {
              let hasCaracteristica = false;
              for (let j = 0; j < caracteristicaComponentes.length; j++) {
                if (caracteristicaComponentes[j].nome === caracteristicaList[i].nome) {
                  hasCaracteristica = true;
                }
              }
              if (!hasCaracteristica) {
                caracteristicaComponentes.push(caracteristicaList[i]);
              }
            }

            for (let z = 0; z < caracteristicaComponentes.length; z++) {
              // var tbody = document.createElement('tbody')
              var tr = document.createElement('tr');
              var tdLabel = document.createElement('td');
              var tdValue = document.createElement('td');
              var label = document.createElement('label');
              tdLabel.appendChild(label);
              tdLabel.setAttribute('class', 'td-gray');
              tr.appendChild(tdLabel);
              tr.appendChild(tdValue);
              var t;
              if (selfCalculo.config.caracteristicaComponentesLabels[caracteristicaComponentes[z].nome]) {
                t = document.createTextNode(selfCalculo.config.caracteristicaComponentesLabels[caracteristicaComponentes[z].nome]);
              } else {
                t = document.createTextNode(caracteristicaComponentes[z].nome);
              }
              var ted;
              if (caracteristicaComponentes[z].conteudo && caracteristicaComponentes[z].conteudo.toLowerCase() !== 'null') {
                ted = document.createTextNode(caracteristicaComponentes[z].conteudo);
              } else {
                ted = document.createTextNode('');
              }

              label.appendChild(t);
              tdValue.appendChild(ted);
              parentDiv.appendChild(tr);
            }
          }
        }
      },

      getGeocodeBuffer: function(featureSelected, unidadeSelected) {
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

          array.forEach(bufferedGeometries, function(circleGeometry) {
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
            selfCalculo.map.setExtent(circleGeometry.getExtent(), true);
            // TODO fazer destacar pesquisas dentro do círculo
            selfCalculo.drawPesquisa(circleGeometry, unidadeSelected);

            let query = new Query();
            query.geometry = circleGeometry.getExtent();
            query.outFields = ['sl_cadastro.SDE.Lote.GEOC_RENU', 'sl_cadastro.SDE.Lote.GEOCODE', 'sl_cadastro.SDE.Lote.OBJECTID'];
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
      drawSimilar: function(featureList, featureSelected, unidadeSelected) {
        let count = 0;
        let similarFeatures = [];

        selfCalculo.getTransmissoesWithUnidade(featureList, featureSelected, unidadeSelected, function(transmissoes) {
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
      drawPesquisa: function(circleGeometry, unidadeSelected) {
        let serviceUrl = selfCalculo.config.pesquisaServiceUrl;
        let layerFieldName = 'de_geocode_lote';
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
            DocumentUtil.showMessage('warning', 'Não foram encontradas Pesquisas de Mercado que tenham características semelhantes à inscrição informada.', true, null, 'semPesquisaSemelhanteError');
          }
          // selfCalculo.drawSimilar(inBuffer, featureSelected, unidadeSelected);
        }
      },
      goToLayer: function() {
        selfCalculo.map.setExtent(selfCalculo.circleGeometry.getExtent(), true);
      },
      putLabel: function(json, labels) {
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
      saveTerceiraAvaliacao: function() {
        let geocode = document.getElementById('geocode').value;
        let valorMinimo = selfCalculo.minimoTerceiraAvaliacao;
        let terceiraAvaliacaoValue = document.getElementById('terceiraAvaliacaoInput').value.replace(/\./g, '').replace(',', '.');
        if (Number(terceiraAvaliacaoValue) > Number(valorMinimo)) {
          let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');
          $.ajax({
            url: 'http://172.16.32.46:1010/terceiraavaliacao',
            type: 'post',
            data: {
              geocodigo: geocode,
              valor: terceiraAvaliacaoValue,
              valoresCalculados: selfCalculo.valoresCalculados
            },
            headers: {
              authorization: headerAuthorization // If your header name has spaces or any other char not appropriate
            },
            dataType: 'json',
            success: function(data) {
              DocumentUtil.showMessage('success', 'Terceira Avaliação Salva com Sucesso!', true, 3000, null);
              console.info(data);
            },
            error: function(xhr, ajaxOptions, thrownError) {
              if (xhr.responseJSON) {
                DocumentUtil.showMessage('warning', xhr.responseJSON.message, true, null, 'semAutorizacaoTerceiraAvaliacao');
              } else {
                DocumentUtil.showMessage('warning', 'Não foi possível se comunicar com o servidor!', true, null, 'semAutorizacaoTerceiraAvaliacao');
              }
            }
          });
        } else {
          DocumentUtil.showMessage('warning', 'Valor da 3ª Avaliação não pode ser menor que ' + numberParaReal(valorMinimo) + '. ', true, null, 'valorMenorQueMinimoTerceiraAvaliacao');
        }
      },
      getTransmissoes: function(featureList, featureSelected, unidadeSelected, callback) {
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
        queryTask.execute(query, function(result) {
          let transmissoes = result.features;
          callback(transmissoes);
        });
      },
      getTransmissoesWithUnidade: function(featureList, featureSelected, unidadeSelected, callback) {
        let unidadeServiceUrl = selfCalculo.config.unidadeServiceUrl;

        selfCalculo.getTransmissoes(featureList, featureSelected, unidadeSelected, function(transmissoes) {
          let query = new Query();
          let queryTask = new QueryTask(unidadeServiceUrl);
          query.returnGeometry = true;
          query.outFields = ['OBJECTID', 'de_geocode_stm ', 'TIPOLOGIA', 'TP_EDIFICACAO', 'CONSERVACAO'];
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
          query.where = whereQuery + " AND TIPOLOGIA = '" + unidadeSelected.attributes.TIPOLOGIA + "'" + " AND TP_EDIFICACAO = '" + unidadeSelected.attributes.TP_EDIFICACAO + "'" + " AND CONSERVACAO = '" + unidadeSelected.attributes.CONSERVACAO + "'";
          // query.where = whereQuery;

          queryTask.execute(query, function(result) {
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
      clearGraphics: function(keepGeocodeInput) {
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
      getDepreciacaoFisica: function(idade, conservacao) {
        let coef = selfCalculo.config.coeficienteDepreciacao;
        let round = Math.round(((idade / 80) * 100));
        if (round % 2 !== 0) {
          if (round === 1) {
            round = 2;
          } else {
            round = round - 1;
          }
        }
        let vidaReferencial = String(round);
        return coef[vidaReferencial][conservacao];
      },
      getCustoUnitarioBasico: function(tipologia, padraoConstrucao) {
        let valor = selfCalculo.config.cub[tipologia][padraoConstrucao];
        let r8n = 1194.74;
        return valor * r8n;
      },
      getValorDaEdificacao: function(tipologia, padraoConstrucao, areaConstruida, idade, estadoDeConservacao) {
        let custoUnitarioBasico = selfCalculo.getCustoUnitarioBasico(tipologia, padraoConstrucao);
        let depreciacaoFisica = selfCalculo.getDepreciacaoFisica(idade, estadoDeConservacao);
        let valorEdificacao = 0.20 * custoUnitarioBasico * areaConstruida + 0.80 * custoUnitarioBasico * depreciacaoFisica * areaConstruida;
        return valorEdificacao;
      }
    });
  });

function activeBuscarCalculo(event) {
  let geocode = document.getElementById('geocode').value;

  let searchImovelButton = document.getElementById('searchImovelButton');
  if (geocode) {
    searchImovelButton.disabled = false;
  } else {
    searchImovelButton.disabled = true;
  }
}

function activeTerceiraAvaliacao() {
  let geocodeSelect = selfCalculo.geocodeSelect;

  let searchImovelButton = document.getElementById('searchImovelButton');
  let terceiraAvaliacaoInput = document.getElementById('terceiraAvaliacaoInput');
  let terceiraAvaliacaoButton = document.getElementById('terceiraAvaliacaoButton');
  if (geocodeSelect) {
    terceiraAvaliacaoInput.disabled = false;
    terceiraAvaliacaoButton.disabled = false;
  } else {
    terceiraAvaliacaoInput.disabled = true;
    terceiraAvaliacaoInput.value = null;
    terceiraAvaliacaoButton.disabled = true;
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

function calcularValorMetroQuadrado(coodY, coodX, areaPadrao, qtdPavimentos, testadaMedia, rendaSetor) {
  let valor = 0;
  if (!qtdPavimentos) {
    qtdPavimentos = 1;
  }
  valor = Math.pow((-1244.7487 + (0.000000000019918227 * Math.pow(coodY, 2)) + (-0.0000000018324684 * Math.pow(coodX, 2)) + (0.000000001801289 * Math.pow(areaPadrao, 2)) + (2.4943315 * qtdPavimentos) + (0.0019993246 * Math.pow(testadaMedia, 2)) + (0.0000030366837 * rendaSetor)), 2);
  return valor;
}
