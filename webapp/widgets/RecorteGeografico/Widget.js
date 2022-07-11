let selfRecorte;
(function() {
  /* global define moment async dojo Chart RColor regression zingchart $:true */

  let recorteToolbar;
  define([
    'dojo/_base/declare',
    'jimu/BaseWidget',

    // 'dojo/query',
    'dojo/_base/xhr',
    'dojo/_base/array',
    'dojo/dom-class',
    'dojo/dom-style',
    'dojo/touch',
    'dojo/on',
    'dojo/keys',
    'dojo/_base/lang',
    'dojox/widget/Toaster',
    'esri/toolbars/draw',
    'esri/dijit/ColorPicker',
    'esri/map',
    'esri/layers/FeatureLayer',
    'esri/symbols/SimpleMarkerSymbol',
    'esri/tasks/query',
    'esri/tasks/QueryTask',
    'esri/symbols/SimpleLineSymbol',
    'esri/symbols/SimpleFillSymbol',
    'esri/SpatialReference',
    'esri/geometry/Circle',
    'esri/geometry/Point',
    'esri/geometry/Polygon',
    'esri/symbols/Font',
    'esri/symbols/TextSymbol',
    'esri/geometry/geometryEngine',
    'esri/units',
    'esri/Color',
    'esri/graphic',
    'esri/config',
    'esri/tasks/BufferParameters',
    'esri/tasks/GeometryService',
    'util/layerFactory.js',
    'util/map-to-canvas.js',
    'util/DocumentUtil.js',
    'widgets/RecorteGeografico/util/DocCreator.js',
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
    Draw,
    ColorPicker,
    map,
    FeatureLayer,
    SimpleMarkerSymbol,
    Query,
    QueryTask,
    SimpleLineSymbol,
    SimpleFillSymbol,
    SpatialReference,
    Circle,
    Point,
    Polygon,
    Font,
    TextSymbol,
    geometryEngine,
    Units,
    Color,
    Graphic,
    esriConfig,
    BufferParameters,
    GeometryService,
    LayerFactory,
    mapToCanvas,
    DocumentUtil,
    DocCreator,
    template) {
    // To create a widget, you need to derive from BaseWidget.
    // TODO: ATUALMENTE O CÓDIGO SÓ FUNCIONA NO CHROME FAZER!!
    // var selfRecorte;
    try {
      return declare([BaseWidget], {
      // Custom widget code goes here
        templateString: template,
        baseClass: 'jimu-widget-RecorteGeografico',
        postCreate: function() {
          selfRecorte = this;
          selfRecorte.createToolbar();
        },
        onClose: function(){
          selfRecorte.map.infoWindow.popupWindow = true;
          selfRecorte.map.infoWindow.set("highlight", true);
        },
        onOpen: function(){
          selfRecorte.map.infoWindow.popupWindow = false;
          selfRecorte.map.infoWindow.set("highlight", false);
          console.info("self recorte", selfRecorte.map);
        },
        startup: function() {
        // activeBuscarRecorte();
          let that = this;
          // var curr = new Date; // get current date
          // var first = curr.getDate() - curr.getDay(); // First day is the day of the month - the day of the week
          // var last = first + 6;
          document.getElementById('filtroInputDeRecorte').value = moment().startOf('year').format('DD-MM-YYYY');
          document.getElementById('filtroInputAteRecorte').value = moment().endOf('week').format('DD-MM-YYYY');
          $('.form_date').datetimepicker({
            language: 'pt-BR',
            weekStart: 1,
            format: 'dd-mm-yyyy',
            todayBtn: 1,
            autoclose: 1,
            todayHighlight: 1,
            startView: 2,
            minView: 2,
            forceParse: 0
          });
          $('.carousel').carousel({
            interval: false
          });
          $(document).ready(function() {
            $('#maximizarGrafico').click(function() {
                $('#lightbox, #lightbox-panel').fadeIn(300);
                var node = document.createElement("div");
                var content = document.getElementById("lightbox-panel");
                node.appendChild(content);
                document.getElementById("map").appendChild(node);
            });
            $('a#close-panel').click(function() {
              $('#lightbox, #lightbox-panel').fadeOut(300);
            });
          });
          $(document).ready(function() {
            $('#maximizarTable').click(function() {
                $('#lightbox, #lightbox-table').fadeIn(300);
                var node = document.createElement("div");
                var content = document.getElementById("lightbox-table");
                node.appendChild(content);
                document.getElementById("map").appendChild(node);
            });
            $('a#close-table').click(function() {
              $('#lightbox, #lightbox-table').fadeOut(300);
            });
          });
          $(document).ready(function () {
              $('#polygonButton').click(function () {
                  desactiveOptionsRecorte();
              });
              $('#circleButton').click(function () {
                  desactiveOptionsRecorte();
              });
              $('#setorButton').click(function () {
                  desactiveOptionsGeometry();
                  $('#searchByClickButton').tooltip('show');
              });
              $('#bairroButton').click(function () {
                  desactiveOptionsGeometry();
                  $('#searchByClickButton').tooltip('show');
              });
              $('#quadraButton').click(function () {
                  desactiveOptionsGeometry();
                  $('#searchByClickButton').tooltip('show');
              });
              $('#loteButton').click(function () {
                  desactiveOptionsGeometry();
                  $('#searchByClickButton').tooltip('show');
              });
              $('#unidadeButton').click(function () {
                  desactiveOptionsGeometry();
              });
              /*$('#searchByClickButton').click(function () {
                  $('#searchByClickButton').tooltip('disabled');
              });*/
          });
          $(document).ready(function () {
              $('#limparRecorte').click(function () {
                  $('#btnGroupPesquisa').css("pointer-events", "auto");
                  $('#dropdownMenu1').css("pointer-events", "auto");
                  //$('#dropdownMenu1').css("background-color", "#ba0001");
                  //$('#dropdownMenu3').css("background-color", "white");
                  //$('#searchByClickButton').css("background-color", "white");
                  //$('#searchGeometryInput').css("background-color", "white");
                  //$('#searchGeometryButton').css("background-color", "white");
                  $("#divTransmissoes").css("display", "none");
              });
          });
          $(document).ready(function() {
            $('[data-toggle="tooltip"]').tooltip();
            /*$('#ulRecorteOptions').hover(
              function(e) {
                $('#searchByClickButton').tooltip('toggle');
                // caso queira exibir o tooltip sempre remover o disable abaixo
                $('#searchByClickButton').tooltip('disable');
              }
            );*/
          });
          $('.carousel-sync').on('slide.bs.carousel', function (ev) {
              var dir = ev.direction == 'right' ? 'prev' : 'next';
              $('.carousel-sync').not('.sliding').addClass('sliding').carousel(dir);
          });
          $('.carousel-sync').on('slid.bs.carousel', function (ev) {
              $('.carousel-sync').removeClass('sliding');
          });
          document.getElementById('toshowMax').onmouseover = function() { showMax(); };
          document.getElementById('toshowMax').onmouseout = function() { hideMax(); };
          function showMax() {
            let btnMax = document.getElementById('maximizarGrafico');
            btnMax.style.display = 'block';
          }
          function hideMax() {
            let btnMax = document.getElementById('maximizarGrafico');
            btnMax.style.display = 'none';
          }
          document.getElementById('divTablesRecorte').onmouseover = function() { showMaxTable(); };
          document.getElementById('divTablesRecorte').onmouseout = function() { hideMaxTable(); };
          function showMaxTable() {
            let btnMax = document.getElementById('maximizarTable');
            btnMax.style.visibility = 'visible';
          }
          function hideMaxTable() {
            let btnMax = document.getElementById('maximizarTable');
            btnMax.style.visibility = 'hidden';
          }
          let wage = document.getElementById('searchGeometryInput');
          wage.addEventListener('keydown', function(e) {
            if (e.keyCode === 13) {
              that.searchGeometry();
            }
          });

        },
        createToolbar: function() {
          recorteToolbar = new Draw(selfRecorte.map);

          recorteToolbar.on('draw-end', selfRecorte.addToMap);
        },
        endPointSelection: function() {
          DocumentUtil.showMessage('info', '', false, null, 'recorteToolMessage');
          recorteToolbar.deactivate();
          if (selfRecorte.endDrawEvent) {
            selfRecorte.initDrawEvent.remove();
            selfRecorte.endDrawEvent.remove();
          }
          if (selfRecorte.pointList && selfRecorte.pointList.length > 0) {
            selfRecorte.searchByPointList(selfRecorte.pointList, function(err, featureList) {
              if (err) {
                return err;
              }
              selfRecorte.pointList = null;
              return selfRecorte.generateBuffer(featureList);
            });
          }
        },
        clearPointSelection: function() {
          selfRecorte.map.graphics.clear();
          selfRecorte.pointList = null;
          // TODO fazer lógica de apagar o ultimo gráfico criado, e não todos.
        },
        clickTr: function(tr) {
          $('#recorte_datatable_transmissao tr').removeClass('highlighted');
          $('#recorte_datatable_pesquisa tr').removeClass('highlighted');
          $('#recorte_datatable_pesquisa_lightbox tr').removeClass('highlighted');
          $('#recorte_datatable_transmissao_lightbox tr').removeClass('highlighted');
          $(tr).addClass('highlighted');
        },
        activateRecortePointTool: function() {
          let that = this;
          that.clearRecorte();
          let tool = 'POINT';
          let buttons = [
            {
              label: 'Finalizar',
              attributes: {
                class: 'btn btn-danger',
                style: 'margin-top: -26px; margin-left: 65px;',
                // 'data-dojo-attach-event': 'click:alertaGeralTest',
                onclick: 'selfRecorte.endPointSelection()'
              }},
            {
              label: 'Limpar',
              attributes: {
                class: 'btn btn-danger',
                style: 'margin-top: -26px; margin-left: 5px;',
                onClick: 'selfRecorte.clearPointSelection()'
              }
            }];
          DocumentUtil.showMessageWithButton(buttons, 'info', 'Clique no mapa para adicionar um ponto', true, null, 'recorteToolMessage');
          recorteToolbar.activate(Draw[tool]);
          selfRecorte.map.infoWindow.popupWindow = false;
          selfRecorte.map.infoWindow.highlight = false;
        // map.hideZoomSlider();
        },
        activateRecorteCircleTool: function() {
          let tool = 'CIRCLE';
          DocumentUtil.showMessage('info', 'Clique e arraste para adicionar um círculo no mapa', true, null, 'recorteToolMessage');
          selfRecorte.initDrawEvent = selfRecorte.map.on('mouse-down', function(evt) {
            selfRecorte.initDrawPoint = evt.mapPoint;
          });

          selfRecorte.endDrawEvent = selfRecorte.map.on('mouse-drag', function(evt) {
            // selfRecorte.initDrawPoint = evt.mapPoint;
            let raio = geometryEngine.distance(selfRecorte.initDrawPoint, evt.mapPoint, 'meters').toFixed(2);
            // let area = (Math.PI *raio*raio).toFixed(2);
            DocumentUtil.showMessage('info', 'Clique e arraste para adicionar um círculo no mapa \n\n Distância: ' + raio + ' m', true, null, 'recorteToolMessage', true);
            // console.info(geometryEngine.distance(selfRecorte.initDrawPoint, evt.mapPoint, 'meters'));
          });
          recorteToolbar.activate(Draw[tool]);
          selfRecorte.map.infoWindow.popupWindow = false;
          selfRecorte.map.infoWindow.highlight = false;
        // map.hideZoomSlider();
        },
        activateRecortePolygonTool: function() {
          let tool = 'POLYGON';
          DocumentUtil.showMessage('info', 'Clique uma vez para desenhar, clique duas vezes para concluir', true, 6000, 'recorteToolMessage');
          recorteToolbar.activate(Draw[tool]);
          selfRecorte.map.infoWindow.popupWindow = false;
          selfRecorte.map.infoWindow.highlight = false;
        // map.hideZoomSlider();
        },
        addUnidadeToMap: function(transmissoes, dataDe, dataPara) {
          DocumentUtil.showSpinner(true);
          this.clearRecorte();
          let that = this;
          async.waterfall([
            clearGraphics,
            drawLote,
            searchPesquisas,
            generateReports
          ], function(err, transmissaoResponse, loteFeature) {
            DocumentUtil.showSpinner(false);
            if (err) {
              return DocumentUtil.showMessage('warning', err.message, true, null, 'addUnidadeToMapError');
            }

            // let qtdPesquisaLabel = document.getElementById('qtd_pesquisa_label');
            // let qtdPesquisaPredialLabel = document.getElementById('qtd_pesquisa_predial_label');
            // let qtdPesquisaTerritorialLabel = document.getElementById('qtd_pesquisa_territorial_label');
            // let qtdPesquisaTotalLabel = document.getElementById('qtd_pesquisa_total_label');
            //
            // let valorPesquisaPredialLabel = document.getElementById('valor_pesquisa_predial_label');
            // let valorPesquisaTerritorialLabel = document.getElementById('valor_pesquisa_territorial_label');
            // let valorPesquisaTotalLabel = document.getElementById('valor_pesquisa_total_label');

            let qtdTransmissaoLabel = document.getElementById('qtd_transmissao_label');
            let qtdTransmissaoPredialLabel = document.getElementById('qtd_transmissao_predial_label');
            let qtdTransmissaoTerritorialLabel = document.getElementById('qtd_transmissao_territorial_label');
            let qtdTransmissaoTotalLabel = document.getElementById('qtd_transmissao_total_label');

            let valorTransmissaoPredialLabel = document.getElementById('valor_transmissao_predial_label');
            let valorTransmissaoTerritorialLabel = document.getElementById('valor_transmissao_territorial_label');
            let valorTransmissaoTotalLabel = document.getElementById('valor_transmissao_total_label');

            let transmissaoReportData = that.generateTransmissaoReportData(transmissaoResponse, dataDe, dataPara);
            console.info("transmissaoReportData", transmissaoReportData);
            let pesquisaReportData = that.generatePesquisaReportData([]);
            qtdTransmissaoLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.total;
            // qtdPesquisaLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.total;

            qtdTransmissaoPredialLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.predial > 0 ? transmissaoReportData.tipoImovel.quantidade.predial : null;
            qtdTransmissaoTerritorialLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.territorial > 0 ? transmissaoReportData.tipoImovel.quantidade.territorial : null;
            qtdTransmissaoTotalLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.total;

            valorTransmissaoPredialLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.predial);
            valorTransmissaoTerritorialLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.territorial);
            valorTransmissaoTotalLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.total);

            // qtdPesquisaPredialLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.predial;
            // qtdPesquisaTerritorialLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.territorial;
            // qtdPesquisaTotalLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.total;

            // valorPesquisaPredialLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.predial);
            // valorPesquisaTerritorialLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.territorial);
            // valorPesquisaTotalLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.total);
            that.generateUnidadeReport(transmissoes, loteFeature, transmissaoReportData, pesquisaReportData, dataDe, dataPara);
            // that.generateReport(transmissaoReportData, pesquisaReportData);
            that.generateDatatable(transmissoes, {features: []});
            // that.generateTransmissaoDatatable(transmissoes);
            that.generateGraphsToPDF(transmissaoReportData, pesquisaReportData, transmissoes, loteFeature, dataDe, dataPara);
          });
          function clearGraphics(callback) {
            selfRecorte.map.graphics.clear();
            callback(null, transmissoes);
          }
          function drawLote(transmissoes, callback) {
            //VERIFICAR TRANSMISSOES AQUI, QUAIS OS CAMPOS E COMO ELA ESTÁ CHEGANDO
            //ERRO QUE ESTÁ RETORNANDO TUDO, E NÃO SÓ AS 5 QUE ESTÁ COM RELAÇÃO COM O MAPA
            try {
              if (!transmissoes[0] || !transmissoes[0].de_GEOCODE_LOTE) {
                return callback(new Error('Não foi encontrada resultado no periodo pesquisado!'));
              }

              that.searchLote(document.getElementById('searchGeometryInput').value , function(result) {
                console.log(result);
                let features = result.features;
                for (let i = 0; i < features.length; i++) {
                  let symbol;
                  switch (features[i].geometry.type) {
                    case 'point':
                    case 'multipoint':
                      symbol = new SimpleMarkerSymbol();
                      break;
                    case 'polyline':
                      symbol = new SimpleLineSymbol();
                      break;
                    default:
                      symbol = new SimpleFillSymbol();
                      break;
                  }
                  let graphic = new Graphic(features[i].geometry, symbol);
                  selfRecorte.map.graphics.add(graphic);
                  that.map.setExtent(features[i].geometry.getExtent(), true);
                }
                callback(null, transmissoes, result.features[0]);
              });
            } catch (err) {
              DocumentUtil.showMessage('warning', err.message, true, null, 'drawLoteError');
              return callback(err);
            }
          }
          function searchPesquisas(transmissoes, loteFeature, callback) {
          // arg1 now equals 'three'
            callback(null, transmissoes, loteFeature);
          }
          function generateReports(transmissoes, loteFeature, callback) {
          // arg1 now equals 'three'
            callback(null, transmissoes, loteFeature);
          }
        },
        addToMap: function(evt) {
          let referenceEvt = null;
          let featureList;
          let recorteToolMessage = document.getElementById('recorteToolMessage');

          selfRecorte.map.infoWindow.popupWindow = false;
          selfRecorte.map.infoWindow.highlight = false;

          if (Array.isArray(evt)) {
            referenceEvt = evt[0];
          } else {
            referenceEvt = evt;
          }
          if (referenceEvt.geometry.type !== 'point') {
            selfRecorte.map.graphics.clear();
    
            recorteToolbar.deactivate();
            if (selfRecorte.endDrawEvent) {
              selfRecorte.initDrawEvent.remove();
              selfRecorte.endDrawEvent.remove();
            }

            // map.showZoomSlider();

            if (Array.isArray(evt)) {
              featureList = evt;
            } else {
              featureList = [evt];
            }

            return selfRecorte.generateBuffer(featureList);
          }
          if (!selfRecorte.pointList) {
            selfRecorte.pointList = [];
          }
          if (recorteToolMessage && recorteToolMessage.style.opacity !== '0') {
        
            selfRecorte.pointList.push(evt.geometry);
            selfRecorte.searchByPointList(selfRecorte.pointList, function(err, features) {
        
              let symbol = new SimpleFillSymbol();
              let graphic = new Graphic(features[features.length - 1].geometry, symbol);
              selfRecorte.map.graphics.add(graphic);
            });
          } else {
            recorteToolbar.deactivate();
            if (selfRecorte.endDrawEvent) {
              selfRecorte.initDrawEvent.remove();
              selfRecorte.endDrawEvent.remove();
            }
          }
        },
        searchByPointList: function(pointList, callback) {
      
          let option = document.getElementById('dropdownMenu3').innerText;
          let serviceUrl = null;
          if (option.indexOf('Setor') !== -1) {
            serviceUrl = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/11';
          } else if (option.indexOf('Bairro') !== -1) {
            serviceUrl = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/12';
          }

          if (option.indexOf('Quadra') !== -1) {
            let features = [];
            this.searchServiceByPointList('https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/22', pointList, function(result) {
              for (let i = 0; i < result.length; i++) {
                features.push(result[i]);
              }
              selfRecorte.searchServiceByPointList('https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/21', pointList, function(result) {
                for (let i = 0; i < result.length; i++) {
                  features.push(result[i]);
                }
                callback(null, features);
              });
            });
          }
          if (option.indexOf('Lote') !== -1) {
            let features = [];
            this.searchServiceByPointList('https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14', pointList, function(result) {
              for (let i = 0; i < result.length; i++) {
                features.push(result[i]);
              }
              selfRecorte.searchServiceByPointList('https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/15', pointList, function(result) {
                for (let i = 0; i < result.length; i++) {
                  features.push(result[i]);
                }
                callback(null, features);
              });
            });
          }

          if (serviceUrl) {
            selfRecorte.searchServiceByPointList(serviceUrl, pointList, function(result) {
              let features = [];
              for (let i = 0; i < result.length; i++) {
                features.push(result[i]);
              }
              callback(null, features);
            });
          }
        },
        searchServiceByPointList: function(serviceUrl, evt, callback) {
  
          let count = 0;
          let features = [];
          let bufferGeometries = [];
          async.whilst(
            function() {
              return count < evt.length;
            },
            function(callback) {
            // setup the buffer parameters
              let bufferGeometry = evt[count];
              bufferGeometries.push(bufferGeometry);

              let featureLayer = new FeatureLayer(serviceUrl);

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

              selfRecorte.bufferGeometry = bufferGeometry;
              let centroidGeometry;

              if (evt[count].type === 'point') {
                centroidGeometry = bufferGeometry;
              } else {
                centroidGeometry = bufferGeometry.getExtent();
              }

              // selfRecorte.map.setExtent(bufferGeometry.getExtent(), true);
              // TODO fazer destacar pesquisas dentro do círculo
              // selfRecorte.drawPesquisa(circleGeometry, unidadeSelected);

              let query = new Query();
              query.geometry = centroidGeometry;
              query.outFields = ['*'];
              query.spatialRelationship = Query.SPATIAL_REL_WITHIN;
              // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
              featureLayer.queryFeatures(query, selectInDraw);
              function selectInDraw(response) {
                for (let i = 0; i < response.features.length; i++) {
                  features.push(response.features[i]);
                }

                count++;

                callback(null, response, features, bufferGeometries);
              }
            },
            function(err, response, features, bufferGeometries) {
              if (err) {
                DocumentUtil.showMessage('error', err.message, true, null, null);
              }

              callback(features);
            }
          );
        },
        generateBuffer: function(evt) {
          let that = this;
          async.waterfall([
            function(callback) {
      
              that.clearRecorte();
              DocumentUtil.showSpinner(true);
              if (!evt || evt.length === 0) {
                return callback(new Error('Não foram encontrados nenhum elemento para o local escolhido!'));
              }
              let filtroInputDeRecorte = document.getElementById('filtroInputDeRecorte').value;
              let filtroInputAteRecorte = document.getElementById('filtroInputAteRecorte').value;
              if (filtroInputDeRecorte) {
                filtroInputDeRecorte = moment(filtroInputDeRecorte, 'DD-MM-YYYY').format('MM-DD-YYYY');
              }

              if (filtroInputAteRecorte) {
                filtroInputAteRecorte = moment(filtroInputAteRecorte, 'DD-MM-YYYY').format('MM-DD-YYYY');
              }
              callback(null, filtroInputDeRecorte, filtroInputAteRecorte);
            },
            function(dataDe, dataPara, callback) {
           
              for (let i = 0; i < evt.length; i++) {
                let symbol;
                switch (evt[i].geometry.type) {
                  case 'point':
                  case 'multipoint':
                    symbol = new SimpleMarkerSymbol();
                    break;
                  case 'polyline':
                    symbol = new SimpleLineSymbol();
                    break;
                  default:
                    symbol = new SimpleFillSymbol();
                    break;
                }
                let graphic = new Graphic(evt[i].geometry, symbol);
                selfRecorte.map.graphics.add(graphic);
              }

              callback(null, dataDe, dataPara);
            },
            function(dataDe, dataPara, callback) {

              selfRecorte.getPesquisasInDraw(evt, dataDe, dataPara, function(response) {
                callback(null, dataDe, dataPara, response);
              });
            },
            function(dataDe, dataPara, responsePesquisa, callback) {

              selfRecorte.getTransmissoesInDraw(evt, dataDe, dataPara, function(transmissaoResponse, lotesResponse) {
                selfRecorte.drawLotes(lotesResponse);
                callback(null, dataDe, dataPara, responsePesquisa, transmissaoResponse);
              });
            }
          ], function(err, dataDe, dataPara, responsePesquisa, transmissaoResponse) {
            console.log(transmissaoResponse);
            DocumentUtil.showSpinner(false);
            that.setExtentRecorte();
            if (err) {
              DocumentUtil.showMessage('warning', err, true, null, 'geometriaEventoErro');
            }

            let qtdPesquisaLabel = document.getElementById('qtd_pesquisa_label');
            let qtdPesquisaPredialLabel = document.getElementById('qtd_pesquisa_predial_label');
            let qtdPesquisaTerritorialLabel = document.getElementById('qtd_pesquisa_territorial_label');
            let qtdPesquisaTotalLabel = document.getElementById('qtd_pesquisa_total_label');

            let valorPesquisaPredialLabel = document.getElementById('valor_pesquisa_predial_label');
            let valorPesquisaTerritorialLabel = document.getElementById('valor_pesquisa_territorial_label');
            let valorPesquisaTotalLabel = document.getElementById('valor_pesquisa_total_label');

            let qtdTransmissaoLabel = document.getElementById('qtd_transmissao_label');
            let qtdTransmissaoPredialLabel = document.getElementById('qtd_transmissao_predial_label');
            let qtdTransmissaoTerritorialLabel = document.getElementById('qtd_transmissao_territorial_label');
            let qtdTransmissaoTotalLabel = document.getElementById('qtd_transmissao_total_label');

            let valorTransmissaoPredialLabel = document.getElementById('valor_transmissao_predial_label');
            let valorTransmissaoTerritorialLabel = document.getElementById('valor_transmissao_territorial_label');
            let valorTransmissaoTotalLabel = document.getElementById('valor_transmissao_total_label');

            let transmissaoReportData = that.generateTransmissaoReportData(transmissaoResponse, dataDe, dataPara);
            console.info("transmissaoReportData",transmissaoReportData);
            let pesquisaReportData = that.generatePesquisaReportData(responsePesquisa.features);
            qtdTransmissaoLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.total;
            qtdPesquisaLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.total;

            qtdTransmissaoPredialLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.predial;
            qtdTransmissaoTerritorialLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.territorial;
            qtdTransmissaoTotalLabel.innerHTML = transmissaoReportData.tipoImovel.quantidade.total;

            valorTransmissaoPredialLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.predial);
            valorTransmissaoTerritorialLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.territorial);
            valorTransmissaoTotalLabel.innerHTML = 'R$ ' + numberParaReal(transmissaoReportData.tipoImovel.valor.total);

            qtdPesquisaPredialLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.predial;
            qtdPesquisaTerritorialLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.territorial;
            qtdPesquisaTotalLabel.innerHTML = pesquisaReportData.tipoImovel.quantidade.total;

            valorPesquisaPredialLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.predial);
            valorPesquisaTerritorialLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.territorial);
            valorPesquisaTotalLabel.innerHTML = 'R$ ' + numberParaReal(pesquisaReportData.tipoImovel.valor.total);

            that.generateReport(transmissaoReportData, pesquisaReportData);
            that.generateDatatable(transmissaoResponse, responsePesquisa);
            that.generateGraphsToPDF(transmissaoReportData, pesquisaReportData);
          // result now equals 'done'
          });
        },
        getPesquisasInDraw: function(evt, dataInicio, dataFim, callback) {
   
          let serviceUrl = 'https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/MapServer/0';

          let count = 0;
          let features = [];
          let bufferGeometries = [];
          async.whilst(
            function() {
              return count < evt.length;
            },
            function(callback) {
            // setup the buffer parameters
              let bufferGeometry = evt[count].geometry;
              bufferGeometries.push(bufferGeometry);

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

              featureLayer.setSelectionSymbol(featureSymbol);
       
              selfRecorte.bufferGeometry = bufferGeometry;
              let centroidGeometry;

              if (evt[count].geometry.type === 'point') {
                centroidGeometry = bufferGeometry;
      
              } else {
                centroidGeometry = bufferGeometry.getExtent();
           
              }

              // selfRecorte.map.setExtent(bufferGeometry.getExtent(), true);
              // TODO fazer destacar pesquisas dentro do círculo
              // selfRecorte.drawPesquisa(circleGeometry, unidadeSelected);

              let query = new Query();
              query.geometry = centroidGeometry;
              query.outFields = ['*'];
              if (dataInicio && dataFim) {
                query.where = 'dt_data_cadastro' + ' BETWEEN ' + '\'' + dataInicio + '\'' + ' AND ' + '\'' + dataFim + '\'';
              }

              // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
      
              console.info(featureLayer);
              console.info(query);
              featureLayer.queryFeatures(query, selectInDraw);
   

              function selectInDraw(response) {
                console.info(response);
                for (let i = 0; i < response.features.length; i++) {
                  features.push(response.features[i]);
                }

                count++;

                callback(null, response, features, bufferGeometries);
              }
            },
            function(err, response, features, bufferGeometries) {
              if (err) {
                DocumentUtil.showMessage('error', err.message, true, null, null);
              }
              let inDraw = [];

              // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
              for (let i = 0; i < bufferGeometries.length; i++) {
                let bufferGeometry = bufferGeometries[i];
                for (let j = 0; j < features.length; j++) {
                  let feature = features[j];
                  if (bufferGeometry.contains(feature.geometry)) {
                    inDraw.push(feature);
                  }
                // inDraw.push(feature.attributes[featureLayer.objectIdField]);
                }
              }

              response.features = inDraw;
              if (inDraw.length > 0) {
                selfRecorte.drawPesquisas(response);
              } else {
              // showSpinnerFiltroCadastro(false);
 
              }

              // selfRecorte.drawSimilar(inDraw, featureSelected, unidadeSelected);
              let query = new Query();
              query.objectIds = inDraw;
              callback(response);
            }
          );
        },
        searchUnidade: function(unidade, callback) {
          let whereTransmissoes = {
            column: 'de_inscricao',
            operator: '=',
            value: "'" + unidade + "'"
          };

          let whereUnidade = [
          {
            column: 'DE_TIPO_IMOVEL',
            operator: '=',
            value: "Territorial"
          },
          {
            column: 'DE_TIPO_IMOVEL',
            operator: '=',
            value: "Predial"
          }];

          let filtroInputDeRecorte = document.getElementById('filtroInputDeRecorte').value;
          let filtroInputAteRecorte = document.getElementById('filtroInputAteRecorte').value;
          if (filtroInputDeRecorte) {
            filtroInputDeRecorte = moment(filtroInputDeRecorte, 'DD-MM-YYYY').format('MM-DD-YYYY');
          }

          if (filtroInputAteRecorte) {
            filtroInputAteRecorte = moment(filtroInputAteRecorte, 'DD-MM-YYYY').format('MM-DD-YYYY');
          }

          this.searchTransmissao(filtroInputDeRecorte, filtroInputAteRecorte, [whereTransmissoes], whereUnidade, function(result) {

              callback(result, filtroInputDeRecorte, filtroInputAteRecorte);
          });
        },
        searchTransmissao: function(dataInicio, dataFim, whereTransmissoes, whereUnidades, callback) {
          let transmissaoColumns = ["dt_solicitacao",
                                    "nu_idtransmissao",
                                    "de_naturezatransmissao"];
          let unidadeColumns = ["DE_GEOCODE_LOTE",
                                "DE_GEOCODE_STM",
                                "DE_TIPO_IMOVEL",
                                "DE_TIPOLOGIA",
                                "DE_PADRAO_CONSTRUCAO",
                                "DE_IDADE",
                                "NU_AREA_CONSTRUIDA",
                                "DE_CONSERVACAO",
                                "DE_PAVIMENTOS"];
          let whereTransmissao = [];
          let whereUnidade = [
          {
            column: 'DE_TIPO_IMOVEL',
            operator: '<>',
            value: ""
          }];

          if (dataInicio && dataFim) {
            whereTransmissao.push({
              column: 'dt_solicitacao',
              operator: 'BETWEEN',
              value: '\'' + dataInicio + '\'' + 'AND' + '\'' + dataFim + '\''
            });
          }
          for (let i = 0; i < whereTransmissoes.length; i++) {
            whereTransmissao.push({
              column: whereTransmissoes[i].column,
              operator: whereTransmissoes[i].operator,
              value: whereTransmissoes[i].value
            });
          }

          let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');

          console.log(whereTransmissao);
          console.log(whereUnidades);
          let data = {
            'transmissaoColumns': transmissaoColumns,
            'unidadeColumns': unidadeColumns,
            'whereTransmissao': whereTransmissao,
            'whereUnidade': whereUnidade
          };
             var settings = {
                "async": true,
                "crossDomain": true,
                "url": "https://sigribamar.com.br/geoitbi_login/transmissaounidade",
                "method": "POST",
                "headers": {
                    "Content-Type": "application/json",
                    "Cache-Control": "no-cache",
                },
                "processData": false,
                "data": JSON.stringify(data)
            }
            
            $.ajax(settings).then(function(resultTrans, textStatus, jqXHR) {
              // When AJAX call is successfuly
              console.info("Requisição bem sucedida!");
              console.log(resultTrans);
              callback(resultTrans);
            }, function(jqXHR, textStatus, errorThrown) {
              // When AJAX call has failed

            });
          //document.getElementById("divTransmissoes").style.display = "block";
        },
        searchGeometry: function() {
          let that = this;
          let option = document.getElementById('dropdownMenu3').innerText;
          DocumentUtil.showSpinner(true);

          let searchValue = document.getElementById('searchGeometryInput').value;
          if (option.indexOf('Setor') !== -1) {
            this.searchSetor(searchValue, function(result) {
              that.addToMap(result.features);
            });
          } else if (option.indexOf('Bairro') !== -1) {
            this.searchBairro(searchValue, function(result) {
              that.addToMap(result.features);
            });
          } else if (option.indexOf('Quadra') !== -1) {
            this.searchQuadra(searchValue, function(result) {
              that.addToMap(result.features);
            });
          } else if (option.indexOf('Lote') !== -1) {
            this.searchLote(searchValue, function(result) {
              that.addToMap(result.features);
            });
          } else if (option.indexOf('Unidade') !== -1) {
            this.searchUnidade(searchValue, function(transmissoes, dataDe, dataAte) {
              that.addUnidadeToMap(transmissoes, dataDe, dataAte);

                that.searchLote(resultString, function(result) {
                  that.addToMap(result.features);
                });
            });
          }
        },
        searchSetor: function(setores, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/11';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };

          query.where = 'Setores IN(' + setores + ')';

          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            callback(result);
          }
        },
        searchBairro: function(bairroString, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/12';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          let bairros = bairroString.split(',');
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };

          for (let i = 0; i < bairros.length; i++) {
            if (!query.where) {
              query.where = 'BAIRRO LIKE \'%' + bairros[i] + '%\'';
            } else {
              query.where += 'OR BAIRRO LIKE \'%' + bairros[i] + '%\'';
            }
          }

          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            callback(result);
          }
        },
        searchQuadra: function(quadras, callback) {
          let that = this;
          let newResult = null;

          that.searchQuadraNaoRecadastrada(quadras, function(result) {
            if (result) {
              newResult = result;
            }
            that.searchQuadraRecadastrada(quadras, function(result) {
              if (!newResult) {
                newResult = result;
              } else {
                for (let i = 0; i < result.features.length; i++) {
                  newResult.features.push(result.features[i]);
                }
              }

              return callback(newResult);
            });
          });
        },
        searchLote: function(lotes, callback) {
          let that = this;
          let newResult = null;

          that.searchLoteNaoRecadastrada(lotes, function(result) {
            if (result) {
              newResult = result;
            }
            that.searchLoteRecadastrada(lotes, function(result) {
              if (!newResult) {
                newResult = result;
              } else {
                for (let i = 0; i < result.features.length; i++) {
                  newResult.features.push(result.features[i]);
                }
              }

              return callback(newResult);
            });
          });
        },
        searchQuadraNaoRecadastrada: function(quadras, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/22';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          query.returnGeometry = true;
          query.outFields = ['OBJECTID', 'SETOR_NOV', 'ID_QDR_NOV', 'ID_QDR_ANT', 'Shape', 'Shape.STArea()', 'Shape.STLength()'];
          query.outSpatialReference = {
            wkid: 3857
          };

          query.where = 'ID_QDR_NOV IN(' + quadras + ')';

          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            callback(result);
          }
        },
        searchQuadraRecadastrada: function(quadras, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/21';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };

          query.where = 'ID_QDR_NOV IN(' + quadras + ')';

          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            callback(result);
          }
        },
        searchLoteNaoRecadastrada: function(lotes, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/15';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };

          query.where = 'sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE IN(' + lotes + ')';

          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            callback(result);
          }
        },
        searchLoteRecadastrada: function(lotes, callback) {
          let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14';
          let query = new Query();
          let queryTask = new QueryTask(serviceUrlFiltro);
          query.returnGeometry = true;
          query.outFields = ['*'];
          query.outSpatialReference = {
            wkid: 3857
          };

          //A QUERY ESTÁ DANDO PROBLEMA SE ENVIAR APENAS UM LOTE
          //O BACKEND TAMBÉM ESTÁ COM PROBLEMA POR ESTAR RETORNANDO VÁRIOS
          query.where = 'sjr_cadastro.SDE.Lote.stg_geocode IN('+ "'" + lotes + "'" + ')';

          console.log(query.where);
          if (query.where) {
            queryTask.execute(query, showResults);
          }

          function showResults(result) {
            console.log(result);
            callback(result);
          }
        },
        getTransmissoesInDraw: function(evt, dataInicio, dataFim, callback) {
          //AQUI PODE ESTAR A RAIZ DOS PROBLEMAS
          selfRecorte.getLotesInDraw(evt, function(lotesResponse) {
            let features = lotesResponse.features;
            let geocodeValue = '(';

            for (let i = 0; i < features.length; i++) {
              if (i > 0) {
                geocodeValue += ', ';
              }
              if (features[i].attributes['sjr_cadastro.SDE.Lote.stg_geocode']) {
                geocodeValue += '\'' + features[i].attributes['sjr_cadastro.SDE.Lote.stg_geocode'] + '\'';
              }
              if (features[i].attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE']) {
                geocodeValue += '\'' + features[i].attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE'] + '\'';
              }
            }
            geocodeValue += ')';
            let whereTransmissao = {
              column: 'de_inscricao',
              operator: 'IN',
              value: geocodeValue
            };
            let whereTransmissoes = [];
            whereTransmissoes.push(whereTransmissao);
            // dataInicio, dataFim, whereTransmissao,whereUnidade, callback
            selfRecorte.searchTransmissao(dataInicio, dataFim, whereTransmissoes, null, function(transmissaoResponse) {
            // reativar quando input quando terminar a consulta
              let input = document.getElementById('searchGeometryInput');
              let button = document.getElementById('searchGeometryButton');
              input.disabled = false;
              button.disabled = false;
              if (features && features.length > 0) {
                let lotesComTransmissoesSelecionadas = [];
                for (let i = 0; i < features.length; i++) {
                  let lote = features[i];
                  for (let j = 0; j < transmissaoResponse.length; j++) {
                    let transmissao = transmissaoResponse[j];
                    if (lote.attributes['sjr_cadastro.SDE.Lote.stg_geocode'] === transmissao.de_inscricao || lote.attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE'] === transmissao.de_inscricao) {
                      if (!lote.qtdTransmissao) {
                        lote.qtdTransmissao = 0;
                      }
                      lote.qtdTransmissao++;
                    }
                  }
                  for (let j = 0; j < transmissaoResponse.length; j++) {
                    let transmissao = transmissaoResponse[j];
                    let hasLote = false;
                    for (let k = 0; k < lotesComTransmissoesSelecionadas.length; k++) {
                      if (lotesComTransmissoesSelecionadas[k].attributes['sjr_cadastro.SDE.Lote.stg_geocode'] === transmissao.de_inscricao || lotesComTransmissoesSelecionadas[k].attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE'] === transmissao.de_inscricao) {
                        hasLote = true;
                      }
                    }
                    if (!hasLote) {
                      if (lote.attributes['sjr_cadastro.SDE.Lote.stg_geocode'] === transmissao.de_inscricao || lote.attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE'] === transmissao.de_inscricao) {
                        lotesComTransmissoesSelecionadas.push(lote);
                      }
                    }
                  }
                }

                lotesResponse.features = lotesComTransmissoesSelecionadas;
              // selfRecorte.drawLotes(lotesResponse);
              } else {
                DocumentUtil.showMessage('warning', 'Não foi possível selecionar nenhum elemento na área pesquisada!', true, null, 'generateBufferError');
              // showSpinnerFiltroCadastro(false);
              }

              callback(transmissaoResponse, lotesResponse);
            });
          });
        },
        getLotesInDraw: function(evt, callback) {
          let that = this;
          this.getLotesContempladosInDraw(evt, function(result) {
            //that.getLotesNaoContempladosInDraw(evt, function(resultNao) {
              //for (let i = 0; i < resultNao.features.length; i++) {
                //result.features.push(resultNao.features[i]);
              //}
              callback(result);
            //});
          });
        },
        getLotesContempladosInDraw: function(evt, callback) {
          let serviceUrl = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14';

          let count = 0;
          let features = [];
          let bufferGeometries = [];
          async.whilst(
            function() {
              return count < evt.length;
            },
            function(callback) {
            // setup the buffer parameters
              let bufferGeometry = evt[count].geometry;
              bufferGeometries.push(bufferGeometry);

              let featureLayer = new FeatureLayer(serviceUrl, {
                outFields: ['sjr_cadastro.SDE.Lote.OBJECTID']
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

              selfRecorte.bufferGeometry = bufferGeometry;
              let centroidGeometry;

              if (evt[count].geometry.type === 'point') {
                centroidGeometry = bufferGeometry;
              } else {
                centroidGeometry = bufferGeometry.getExtent();
              }

              // selfRecorte.map.setExtent(bufferGeometry.getExtent(), true);
              // TODO fazer destacar pesquisas dentro do círculo
              // selfRecorte.drawPesquisa(circleGeometry, unidadeSelected);

              let query = new Query();
              query.geometry = centroidGeometry;
              query.outFields = ['*'];
              query.where = 'sjr_cadastro.SDE.Lote.de_tem_transmissao' + ' = ' + '\'' + 'Sim' + '\'';

              // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
              featureLayer.queryFeatures(query, selectInDraw);
     
              function selectInDraw(response) {
    
                for (let i = 0; i < response.features.length; i++) {
                  features.push(response.features[i]);
                }

                count++;

                callback(null, response, features, bufferGeometries);
              }
            },
            function(err, response, features, bufferGeometries) {
              if (err) {
                DocumentUtil.showMessage('error', err.message, true, null, null);
              }
         
              let inDraw = [];
              // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
              for (let i = 0; i < bufferGeometries.length; i++) {
                let bufferGeometry = bufferGeometries[i];
                for (let j = 0; j < features.length; j++) {
                  let feature = features[j];
                  if (bufferGeometry.contains(feature.geometry.getCentroid())) {
                    if (feature.attributes['sjr_cadastro.SDE.Lote.de_tem_transmissao'] && feature.attributes['sjr_cadastro.SDE.Lote.de_tem_transmissao'] === 'Sim') {
                      inDraw.push(feature);
                    }
                  }
                // inDraw.push(feature.attributes[featureLayer.objectIdField]);
                }
              }

              response.features = inDraw;

              // selfRecorte.drawSimilar(inDraw, featureSelected, unidadeSelected);
              let query = new Query();
              query.objectIds = inDraw;
       
              callback(response);
            }
          );
        },
        getLotesNaoContempladosInDraw: function(evt, callback) {
          let serviceUrl = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/15';

          let count = 0;
          let features = [];
          let bufferGeometries = [];
          async.whilst(
            function() {
              return count < evt.length;
            },
            function(callback) {
            // setup the buffer parameters
              let bufferGeometry = evt[count].geometry;
              bufferGeometries.push(bufferGeometry);

              let featureLayer = new FeatureLayer(serviceUrl, {
                outFields: ['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.OBJECTID']
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

              selfRecorte.bufferGeometry = bufferGeometry;
              let centroidGeometry;

              if (evt[count].geometry.type === 'point') {
                centroidGeometry = bufferGeometry;
              } else {
                centroidGeometry = bufferGeometry.getExtent();
              }

              // selfRecorte.map.setExtent(bufferGeometry.getExtent(), true);
              // TODO fazer destacar pesquisas dentro do círculo
              // selfRecorte.drawPesquisa(circleGeometry, unidadeSelected);
              console.info("centroidGeometry getLotesNaoContempladosInDraw", centroidGeometry);
              let query = new Query();
              query.geometry = centroidGeometry;
              query.outFields = ['*'];
              // query.where = 'sjr_cadastro.SDE.Lote.de_tem_transmissao' + ' = ' + '\'' + 'Sim' + '\'';
              console.info("query getLotesNaoContempladosInDraw", query);
              console.info("featureLayer getLotesNaoContempladosInDraw", featureLayer);
              // use a fast bounding box query. will only go to the server if bounding box is outside of the visible map
              featureLayer.queryFeatures(query, selectInDraw);

              function selectInDraw(response) {
                console.info("getLotesNaoContempladosInDraw1")
                for (let i = 0; i < response.features.length; i++) {
                  features.push(response.features[i]);
                }

                count++;

                callback(null, response, features, bufferGeometries);
              }
            },
            function(err, response, features, bufferGeometries) {
              if (err) {
                DocumentUtil.showMessage('error', err.message, true, null, null);
              }
              let inDraw = [];
              // filter out features that are not actually in buffer, since we got all points in the buffer's bounding box
              for (let i = 0; i < bufferGeometries.length; i++) {
                let bufferGeometry = bufferGeometries[i];
                for (let j = 0; j < features.length; j++) {
                  let feature = features[j];
                  if (bufferGeometry.contains(feature.geometry.getCentroid())) {
                    inDraw.push(feature);
                  }
                // inDraw.push(feature.attributes[featureLayer.objectIdField]);
                }
              }

              response.features = inDraw;

              // selfRecorte.drawSimilar(inDraw, featureSelected, unidadeSelected);
              let query = new Query();
              console.info("getLotesNaoContempladosInDraw2")
              query.objectIds = inDraw;
              callback(response);
            }
          );
        },

        drawPesquisas: function(result) {
        // selfRecorte.map.graphics.clear();

          let graphics = [];
          if (result.features.length > 0) {
            for (let i = 0; i < result.features.length; i++) {
              let symbol = new SimpleMarkerSymbol(
                SimpleMarkerSymbol.STYLE_CIRCLE,
                12,
                new SimpleLineSymbol(
                  SimpleLineSymbol.STYLE_NULL,
                  new Color([0, 255, 0, 0.9]),
                  1
                ),
                new Color([0, 255, 0, 0.6])
              );
              let graphic = new Graphic(result.features[i].geometry, symbol);
              graphic.attributes = result.features[i].attributes;
              graphic.setSymbol(symbol);
              graphics.push(graphic);
            }
            for (let i = 0; i < graphics.length; i++) {
              selfRecorte.map.graphics.add(graphics[i]);
            }
            dojo.connect(selfRecorte.map.graphics, 'onClick', identifyFeatures);
          }

          function identifyFeatures(evt) {

          }
        // selfRecorte.map.graphics.add(graphic);

        // map.showZoomSlider();
        },

        drawLotes: function(result) {
        // selfRecorte.map.graphics.clear();

          let graphics = [];
          if (result.features.length > 0) {
            for (let i = 0; i < result.features.length; i++) {
              let symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0]), 3), new Color([255, 255, 0, 0.6]));

              let graphic = new Graphic(result.features[i].geometry, symbol);
              graphic.attributes = result.features[i].attributes;
              graphic.setSymbol(symbol);
              graphics.push(graphic);
            }

            for (let i = 0; i < graphics.length; i++) {
              selfRecorte.map.graphics.add(graphics[i]);
            }
            dojo.connect(selfRecorte.map.graphics, 'onClick', identifyFeatures);
          }

          function identifyFeatures(evt) {

          }

        // selfRecorte.map.graphics.add(graphic);

        // map.showZoomSlider();
        },
        setOptionSetor: function() {
          this.setOption('Setor');
          this.activeGeometryFields(true);
        },
        setOptionBairro: function() {
          this.setOption('Bairro');
          this.activeGeometryFields(true);
        },
        setOptionQuadra: function() {
          this.setOption('Quadra');
          this.activeGeometryFields(true);
        },
        setOptionLote: function() {
          this.setOption('Lote');
          this.activeGeometryFields(true);
        },
        setOptionUnidade: function() {
          this.setOption('Unidade');
          this.activeGeometryFields(false);
        },
        activeGeometryFields: function(hasClickSearch) {
          let searchGeometryInput = document.getElementById('searchGeometryInput');
          let searchByClickButton = document.getElementById('searchByClickButton');
          let searchGeometryButton = document.getElementById('searchGeometryButton');
          searchGeometryButton.disabled = false;
          searchGeometryInput.disabled = false;
          searchByClickButton.disabled = !hasClickSearch;
        },
        setOption: function(option) {
          let button = document.getElementById('dropdownMenu3');
          button.innerHTML = option + ' <span class="caret"></span>';
        },
        showMessage: function(type, text, willShow, timeOut, id) {
        // snackbar
        // Get the snackbar DIV
          let messageDiv = document.getElementById('messagesRecorteDiv');

          if (willShow) {
            let boxDiv;
            if (id) {
              boxDiv = document.getElementById(id);
            }
            if (!boxDiv) {
              boxDiv = document.createElement('div');
              messageDiv.appendChild(boxDiv);
            } else {
              while (boxDiv.hasChildNodes()) {
                boxDiv.removeChild(boxDiv.firstChild);
              }
              boxDiv.style.opacity = '0';
              boxDiv.style.display = 'none';
              setTimeout(function() {
                boxDiv.style.opacity = '1';
                setTimeout(function() {
                  boxDiv.style.display = 'block';
                }, 600);
              }, 600);
            }

            // x.innerHTML = text;
            if (type === 'success') {
              boxDiv.setAttribute('class', 'message-alert success');
            } else if (type === 'info') {
              boxDiv.setAttribute('class', 'message-alert info');
            } else if (type === 'warning') {
              boxDiv.setAttribute('class', 'message-alert warning');
            }

            if (id) {
              boxDiv.setAttribute('id', id);
            }

            let spanMessage = document.createElement('span');
            spanMessage.setAttribute('class', 'closebtn');
            spanMessage.innerHTML = '&times;';
            boxDiv.appendChild(spanMessage);
            boxDiv.appendChild(document.createTextNode(text));

            if (timeOut) {
              setTimeout(function() {
                boxDiv.style.opacity = '0';
                setTimeout(function() {
                  boxDiv.style.display = 'none';
                }, 600);

                boxDiv.style.display = 'none';
              }, timeOut);
            }
          } else {
            if (id) {
              let boxDiv = document.getElementById(id);
              boxDiv.style.opacity = '0';
              setTimeout(function() {
                boxDiv.style.display = 'none';
              }, 600);
            }
          }

          let close = document.getElementsByClassName('closebtn');
          let i;

          for (i = 0; i < close.length; i++) {
            close[i].onclick = function() {
              let div = this.parentElement;
              div.style.opacity = '0';
              setTimeout(function() {
                div.style.display = 'none';
              }, 600);
            };
          }
        // snackbar-end
        },
        generateTransmissaoReportData: function(transmissoes, dataDe, dataPara) {
          let dateMask = 'MM/YY';

          let diffDate = moment(dataPara).diff(moment(dataDe), 'months');
          let tipoImovel = {
            quantidade: {
              predial: 0,
              territorial: 0,
              total: 0
            },
            valor: {
              predial: 0,
              territorial: 0,
              total: 0
            }

          };
          let tipoImovelPorTempo = {};
          let tipologia = {
            quantidade: {
              nenhuma: 0,
              total: 0
            },
            valor: {
              nenhuma: 0,
              total: 0
            }
          };
          if (diffDate < 1) {
            dateMask = 'DD/MM/YY';
          } else if (diffDate > 12) {
            dateMask = 'YYYY';
          }
          if (transmissoes) {
          	console.info("transmissoes", transmissoes);
            for (let i = 0; i < transmissoes.length; i++) {
              if (transmissoes[i].de_TIPO_IMOVEL === 'PREDIAL') {
                tipoImovel.quantidade.predial++;
                tipoImovel.valor.predial += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              } else {
                tipoImovel.quantidade.territorial++;
                tipoImovel.valor.territorial += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              }
              tipoImovel.quantidade.total++;
              tipoImovel.valor.total += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
            }
            let dateList = [];
            for (let i = 0; i < transmissoes.length; i++) {
              dateList.push(moment(transmissoes[i].dt_vencimento).format(dateMask));
            }
            dateList.sort();

            for (let i = 0; i < dateList.length; i++) {
              if (!tipoImovelPorTempo[dateList[i]]) {
                tipoImovelPorTempo[dateList[i]] = {
                  quantidade: {
                    // predial: 0,
                    // territorial: 0,
                    total: 0
                  },
                  valor: {
                    // predial: 0,
                    // territorial: 0,
                    total: 0
                  }
                };
                if (tipoImovel.quantidade.predial > 0) {
                  tipoImovelPorTempo[dateList[i]].quantidade.predial = 0;
                  tipoImovelPorTempo[dateList[i]].valor.predial = 0;
                }
                if (tipoImovel.quantidade.territorial > 0) {
                  tipoImovelPorTempo[dateList[i]].quantidade.territorial = 0;
                  tipoImovelPorTempo[dateList[i]].valor.territorial = 0;
                }
              }
            }
            for (let i = 0; i < transmissoes.length; i++) {
              if (transmissoes[i].de_TIPO_IMOVEL === 'PREDIAL' && tipoImovel.quantidade.predial > 0) {
                tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].quantidade.predial++;
                tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].valor.predial += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              } else if (tipoImovel.quantidade.territorial > 0) {
                tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].quantidade.territorial++;
                tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].valor.territorial += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              }
              tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].quantidade.total++;
              tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].valor.total += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
            }

            for (let i = 0; i < transmissoes.length; i++) {
              if (transmissoes[i].de_TIPOLOGIA) {
                if (!tipologia.quantidade[transmissoes[i].de_TIPOLOGIA]) {
                  tipologia.quantidade[transmissoes[i].de_TIPOLOGIA] = 0;
                  tipologia.valor[transmissoes[i].de_TIPOLOGIA] = 0;
                }
                tipologia.quantidade[transmissoes[i].de_TIPOLOGIA]++;
                tipologia.valor[transmissoes[i].de_TIPOLOGIA] += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              } else {
                tipologia.quantidade.nenhuma++;
                tipologia.valor.nenhuma += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
              }
              tipologia.quantidade.total++;
              tipologia.valor.total += Number(transmissoes[i].nu_vvt.replace('.', '').replace(',','.'));
            }
          }

          let report = {
            tipologia: tipologia,
            tipoImovel: tipoImovel,
            tipoImovelPorTempo: tipoImovelPorTempo
          };

          return report;
        },
        generatePesquisaReportData: function(pesquisas) {
          let tipoImovel = {
            quantidade: {
              total: 0,
              territorial: 0,
              predial: 0
            },
            valor: {
              total: 0,
              territorial: 0,
              predial: 0
            }

          };
          let tipologia = {
            quantidade: {
              nenhuma: 0,
              total: 0
            },
            valor: {
              nenhuma: 0,
              total: 0
            }
          };
          let report = {
            tipologia: tipologia,
            tipoImovel: tipoImovel
          };

          for (let i = 0; i < pesquisas.length; i++) {
            if (pesquisas[i].attributes.de_tipo_do_imovel) {
              if (!tipoImovel.quantidade[pesquisas[i].attributes.de_tipo_do_imovel.toLowerCase()]) {
                tipoImovel.quantidade[pesquisas[i].attributes.de_tipo_do_imovel.toLowerCase()] = 0;
                tipoImovel.valor[pesquisas[i].attributes.de_tipo_do_imovel.toLowerCase()] = 0;
              }
              tipoImovel.quantidade[pesquisas[i].attributes.de_tipo_do_imovel.toLowerCase()]++;
              tipoImovel.valor[pesquisas[i].attributes.de_tipo_do_imovel.toLowerCase()] += Number(pesquisas[i].attributes.nu_valor_mercado);
            } else {
              tipoImovel.quantidade.nenhuma++;
              tipoImovel.valor.nenhuma += Number(pesquisas[i].attributes.nu_valor_mercado);
            }
            tipoImovel.quantidade.total++;
            tipoImovel.valor.total += Number(pesquisas[i].attributes.nu_valor_mercado);
          }

          for (let i = 0; i < pesquisas.length; i++) {
            if (pesquisas[i].attributes.de_tipologia && pesquisas[i].attributes.de_tipologia !== ' ') {
              if (!tipologia.quantidade[pesquisas[i].attributes.de_tipologia.toLowerCase()]) {
                tipologia.quantidade[pesquisas[i].attributes.de_tipologia.toLowerCase()] = 0;
                tipologia.valor[pesquisas[i].attributes.de_tipologia.toLowerCase()] = 0;
              }
              tipologia.quantidade[pesquisas[i].attributes.de_tipologia.toLowerCase()]++;
              tipologia.valor[pesquisas[i].attributes.de_tipologia.toLowerCase()] += Number(pesquisas[i].attributes.nu_valor_mercado);
            } else {
              tipologia.quantidade.nenhuma++;
              tipologia.valor.nenhuma += Number(pesquisas[i].attributes.nu_valor_mercado);
            }
            tipologia.quantidade.total++;
            tipologia.valor.total += Number(pesquisas[i].attributes.nu_valor_mercado);
          }

          return report;
        },
        generateUnidadeReport: function(transmissoes, loteFeature, transmissaoData, pesquisaData, dataDe, dataPara) {
          let that = this;
          this.generateAreaPorValorDoMetroData(transmissoes, loteFeature, dataDe, dataPara, function(dataSelect, transmissoesProximasData, pesquisaProximasData) {
            that.createLineChart('line', 'carousel_inner', 'lightbox-panel_inner', that.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'quantidade'), 'Transmissão: Quantidade por Periodo');
            that.createLineChart('line', 'carousel_inner', 'lightbox-panel_inner', that.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'valor'), 'Transmissão: Valor por Periodo', true);
            that.createAreaPorValorDoMetroChart('carousel_inner', 'lightbox-panel_inner', dataSelect, transmissoesProximasData, pesquisaProximasData, 'Valor por Metro Quadrado', true);
          });

          let divTablesRecorte = document.getElementById('divTablesRecorte');
          let divCarousel = document.getElementById('myCarousel');
          divTablesRecorte.style.display = 'block';
          divCarousel.style.display = 'block';
        },
        generateReport: function(transmissaoData, pesquisaData) {
          this.createChart('bar', 'carousel_inner', 'lightbox-panel_inner', [this.objectToArray(transmissaoData.tipoImovel.quantidade, 'Transmissões'), this.objectToArray(pesquisaData.tipoImovel.quantidade, 'Pesquisas')], 'Tipo do Imóvel');
          this.createChart('pie', 'carousel_inner', 'lightbox-panel_inner', [this.objectToArray(transmissaoData.tipologia.quantidade)], 'Transmissão: Tipologia (Pizza)');
          this.createTreeMapChart('carousel_inner', 'lightbox-panel_inner', this.objectToArray(transmissaoData.tipologia.quantidade), 'Transmissão: Tipologia');
          this.createTreeMapChart('carousel_inner', 'lightbox-panel_inner', this.objectToArray(pesquisaData.tipologia.quantidade), 'Pesquisa: Tipologia');
          this.createLineChart('line', 'carousel_inner', 'lightbox-panel_inner', this.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'quantidade'), 'Transmissão: Tipo do Imóvel por Mês');
          this.createChart('pie', 'carousel_inner', 'lightbox-panel_inner', [this.objectToArray(pesquisaData.tipologia.quantidade)], 'Pesquisa: Tipologia');
        },
        generateGraphsToPDF: function(transmissaoData, pesquisaData, transmissoes, loteFeature, dataDe, dataPara) {
          let button = document.getElementById('dropdownMenu3');
          console.info(button.innerText);
          if (button.innerText === 'Unidade ') {
            let that = this;
            this.generateAreaPorValorDoMetroData(transmissoes, loteFeature, dataDe, dataPara, function(dataSelect, transmissoesProximasData, pesquisaProximasData) {
              that.createLineChart('line', 'chartsToPDF', null, that.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'quantidade'), 'Transmissão: Quantidade por Periodo');
              that.createLineChart('line', 'chartsToPDF', null, that.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'valor'), 'Transmissão: Valor por Periodo', true);
              that.createAreaPorValorDoMetroChart('chartsToPDF', null, dataSelect, transmissoesProximasData, pesquisaProximasData, 'Valor por Metro Quadrado', true);
              let chartsDiv = document.getElementById('chartsToPDF');
              setTimeout(function() { chartsDiv.style.display = 'none';}, 2000);
            });
          } else {
            this.createChart('bar', 'chartsToPDF', null, [this.objectToArray(transmissaoData.tipoImovel.quantidade, 'Transmissões'), this.objectToArray(pesquisaData.tipoImovel.quantidade, 'Pesquisas')], 'Tipo do Imóvel');
            this.createChart('pie', 'chartsToPDF', null, [this.objectToArray(transmissaoData.tipologia.quantidade)], 'Transmissão: Tipologia (Pizza)');
            this.createLineChart('line', 'chartsToPDF', null, this.objectWithTimeToArray(transmissaoData.tipoImovelPorTempo, 'quantidade'), 'Transmissão: Tipo do Imóvel por Mês');
            this.createChart('pie', 'chartsToPDF', null, [this.objectToArray(pesquisaData.tipologia.quantidade)], 'Pesquisa: Tipologia');
            let chartsDiv = document.getElementById('chartsToPDF');
            setTimeout(function() { chartsDiv.style.display = 'none';}, 1000);
          }
        },
        generateDatatable: function(transmissaoData, pesquisaData) {
          this.generateTransmissaoDatatable(transmissaoData);
          this.generatePesquisaDatatable(pesquisaData);
          document.getElementById("divTransmissoes").style.display = "block";
        },
        generateTransmissaoDatatable: function(transmissaoData) {
          let titles = {
            options: {
              class: 'th-gray'
            },
            data: ['ID', 'Geocódigo do Lote', 'Proprietário', 'Tipologia', 'Área Construída (m²)', 'Data da Solicitação', 'Valor Negociado (R$)']
          };
          let rows = {
            options: {
              class: 'td-gray-recorte',
              ondblclick: 'selfRecorte.selectFeaturesTransmissao(this)'
            },
            data: []
          };

          this.tableTransmissaoToPDF = {
            titles,
            rows
          };

          if (transmissaoData) {
            for (let i = 0; i < transmissaoData.length; i++) {
              rows.data.push([transmissaoData[i].nu_idtransmissao, transmissaoData[i].de_GEOCODE_LOTE, transmissaoData[i].de_PROP_NOME, transmissaoData[i].de_TIPOLOGIA, transmissaoData[i].nu_AREA_CONSTRUIDA, moment(transmissaoData[i].dt_vencimento).format('DD/MM/YYYY'), numberParaReal(transmissaoData[i].nu_vvt.replace('.', '').replace(',','.'))]);
            }
          }

          DocumentUtil.createTable('recorte_datatable_transmissao', titles, rows);
          DocumentUtil.createTable('recorte_datatable_transmissao_lightbox', titles, rows);
        },
        generatePesquisaDatatable: function(pesquisaData) {
          let titles = {
            options: {
              class: 'th-gray'
            },
            data: ['ID', 'Geocódigo', 'Cadastrador', 'Tipologia', 'Área Útil', 'Área do Terreno (m²)', 'Data da Pesquisa', 'Valor de Mercado (R$)']
          };
          let rows = {
            options: {
              class: 'td-gray-recorte',
              ondblclick: 'selfRecorte.selectFeaturesPesquisa(this)'
            },
            data: []
          };
          this.tablePesquisaToPDF = {
            titles,
            rows
          };
          for (let i = 0; i < pesquisaData.features.length; i++) {
            let feature = pesquisaData.features[i];
            rows.data.push([feature.attributes.OBJECTID, feature.attributes.nu_frente_lote, feature.attributes.de_cadastrador, feature.attributes.de_tipologia, feature.attributes.nu_area_construida, feature.attributes.nu_area_terreno, moment(feature.attributes.dt_data_cadastro).format('DD/MM/YYYY'), numberParaReal(feature.attributes.nu_valor_mercado)]);
          }
          DocumentUtil.createTable('recorte_datatable_pesquisa', titles, rows);
          DocumentUtil.createTable('recorte_datatable_pesquisa_lightbox', titles, rows);
        },
        selectFeaturesTransmissao: function(td) {
          let table = document.getElementById('recorte_datatable_transmissao');
          let geocodigo = table.rows[td.parentNode.rowIndex].cells[1].innerText;
          // selecionar a celula que apresenta o geocódigo do lote
          for (let i = 0; i < selfRecorte.map.graphics.graphics.length; i++) {
            if (selfRecorte.map.graphics.graphics[i].geometry.type === 'polygon') {
              if (selfRecorte.map.graphics.graphics[i].attributes !== undefined) {
                  if (selfRecorte.map.graphics.graphics[i].attributes['sjr_cadastro.SDE.Lote.GEOC_RENU'] === geocodigo) {
                      let feature = selfRecorte.map.graphics.graphics[i];
                      let selectSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255, 0.6]), 3), new Color([0, 255, 255, 0.6]));
                      feature.setSymbol(selectSymbol);
                      selfRecorte.map.setExtent(feature.geometry.getExtent(), true);
                  } else {
                      let feature = selfRecorte.map.graphics.graphics[i];
                      let selectSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([255, 255, 0, 0.6]), 3), new Color([255, 255, 0, 0.6]));
                      feature.setSymbol(selectSymbol);
                  }
              }
            }
          }
        },
        selectFeaturesPesquisa: function(td) {
          let table = document.getElementById('recorte_datatable_pesquisa');
          let geocodigo = table.rows[td.parentNode.rowIndex].cells[1].innerText;
          // selecionar a celula que apresenta o geocódigo do lote
          for (let i = 0; i < selfRecorte.map.graphics.graphics.length; i++) {
            if (selfRecorte.map.graphics.graphics[i].geometry.type === 'point') {
              if (selfRecorte.map.graphics.graphics[i].attributes !== undefined) {
                  if (selfRecorte.map.graphics.graphics[i].attributes.Geocode_Correto === geocodigo) {
                      let feature = selfRecorte.map.graphics.graphics[i];
                      let featureSymbol = new SimpleMarkerSymbol(
                          SimpleMarkerSymbol.STYLE_CIRCLE,
                          12,
                          new SimpleLineSymbol(
                              SimpleLineSymbol.STYLE_NULL,
                              new Color([0, 255, 255, 1]),
                              1
                          ),
                          new Color([0, 255, 255, 1])
                      );
                      feature.setSymbol(featureSymbol);
                      selfRecorte.map.centerAndZoom(feature.geometry, 18);
                  } else {
                      let feature = selfRecorte.map.graphics.graphics[i];
                      let selectSymbol = new SimpleMarkerSymbol(
                          SimpleMarkerSymbol.STYLE_CIRCLE,
                          12,
                          new SimpleLineSymbol(
                              SimpleLineSymbol.STYLE_NULL,
                              new Color([0, 255, 0, 0.6]),
                              3
                          ),
                          new Color([0, 255, 0, 0.6])
                      );
                      feature.setSymbol(selectSymbol);
                  }
              }
            }
          }
        },
        createChart: function(type, parentCarrouselId, parentLightCarrouselId, objectList, title) {
          let canvasCtx = this.createCanvas(parentCarrouselId, 200, 200);
          let canvasLightCtx;
          if (parentLightCarrouselId) {
            canvasLightCtx = this.createCanvas(parentLightCarrouselId, 500, 380);
          }
          let rcolor = new RColor();

          let data = {
            labels: objectList[0].labels,
            datasets: []
          };

          let colorLists = [];
          let colors = [];
          for (let j = 0; j < objectList[0].data.length; j++) {
            colors.push(rcolor.get(true));
          }

          if (title === 'Transmissão: Tipologia (Pizza)') {
            selfRecorte.tipologiaTransmissaoColors = colors;
          }

          for (let i = 0; i < objectList.length; i++) {
            let colorList = [];
            for (let j = 0; j < colors.length; j++) {
              if (objectList.length > 1) {
                colorList.push(colors[i]);
              } else {
                colorList.push(colors[j]);
              }
            }
            colorLists.push(colorList);
          }

          for (let i = 0; i < objectList.length; i++) {
            let object = objectList[i];

            let dataset = {
              label: object.title,
              data: object.data,
              backgroundColor: colorLists[i],
              borderWidth: 1
            };
            data.datasets.push(dataset);
          }

          let chartData = {
            type: type,
            data: data,
            options: {
              title: {
                display: true,
                text: title,
                padding: 5
              },
              legend: {
                labels: {
                  boxWidth: 12,
                  fontSize: 11
                }
              }
            }
          };

          if (type === 'bar') {
            chartData.options.scales = {
              xAxes: [{
                stacked: true
              }],
              yAxes: [{
                stacked: true
              }]
            };
          }
          let chart = new Chart(canvasCtx, chartData);

          if (parentLightCarrouselId) {
            chart = new Chart(canvasLightCtx, chartData);
          }
          return chart;
        },
        createTreeMapChart: function(parentCarrouselId, parentLightCarrouselId, objectList, title) {
          let rcolor = new RColor();
          let divId = this.createDiv(title, parentCarrouselId, 200, 200);
          let lightDivId = this.createDiv(title, parentLightCarrouselId, 500, 380);
          let datas = [];
          let colors = [];
          if (title === 'Transmissão: Tipologia' && selfRecorte.tipologiaTransmissaoColors) {
            colors = selfRecorte.tipologiaTransmissaoColors;
            for (let i = 0; i < objectList.data.length; i++) {
              let data = {
                text: objectList.labels[i],
                value: objectList.data[i]
              };
              datas.push(data);
            }
          } else {
            for (let i = 0; i < objectList.data.length; i++) {
              let data = {
                text: objectList.labels[i],
                value: objectList.data[i]
              };
              colors.push(rcolor.get(true));
              datas.push(data);
            }
          }
          let myConfig = {
            'graphset': [
              {
                type: 'treemap',
                'gui': {
                  'context-menu': {
                    empty: true
                  }
                },

                options: {
                  aspectType: 'palette',
                  'alpha-aspect': false,
                  palette: colors,
                  'max-children': [objectList.data.length]
                },
                series: datas
              }]
          };

          let chart = zingchart.render({
            id: divId,
            data: myConfig,
            height: 285,
            width: 309,
            hideprogresslogo: true,
            output: 'canvas'
          });

          chart = zingchart.render({
            id: lightDivId,
            data: myConfig,
            height: 412,
            width: 581,
            hideprogresslogo: true,
            output: 'canvas'
          });

          return chart;
        },
        createLineChart: function(type, parentCarrouselId, parentLightCarrouselId, object, title, isMoney) {
   
          let canvasCtx = this.createCanvas(parentCarrouselId, 200, 200);
          let canvasLightCtx;
          if (parentLightCarrouselId) {
            canvasLightCtx = this.createCanvas(parentLightCarrouselId, 500, 380);
          }
          let rcolor = new RColor();

          let data = {
            labels: object.labels,
            datasets: []
          };

          for (let i = 0; i < object.datasets.length; i++) {
            let dataset = object.datasets[i];

            dataset.backgroundColor = rcolor.get(true);
            dataset.borderColor = dataset.backgroundColor;
            dataset.fill = false;
          }

          data.datasets = object.datasets;

          let chartData = {
            type: type,
            data: data,
            options: {
              elements: {
                line: {
                  tension: 0
                }
              },
              title: {
                display: true,
                text: title,
                padding: 5
              },
              legend: {
                labels: {
                  boxWidth: 12,
                  fontSize: 11
                }
              }
            }
          };

          if (isMoney) {
            chartData.options.scales = {

              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    return value.toLocaleString('pt-BR', {style: 'currency', currency: 'BRL'});
                  }
                }
              }]
            };
            chartData.options.tooltips = {
              mode: 'single',
              callbacks: {
                label: function(tooltipItems, data) {
                  return 'R$ ' + numberParaReal(tooltipItems.yLabel);
                }
              }
            };
          }

          let chart = new Chart(canvasCtx, chartData);
          if (parentLightCarrouselId) {
            chart = new Chart(canvasLightCtx, chartData);
          }
          return chart;
        },
        generateAreaPorValorDoMetroData: function(transmissoes, loteFeature, dataDe, dataPara, callback) {
          let that = this;
          let transmissaoData = [];
          let transmissaoSimilarData = [];
          let pesquisaSimilarData = [];
          let latestDate = getLatestDate(transmissoes);
          let latestTransmissao = [];
          console.info('latestDate', latestDate);

          for (let i = 0; i < transmissoes.length; i++) {
            if (moment(transmissoes[i].dt_vencimento).format('DD-MM-YYYY') === latestDate) {
              latestTransmissao.push(transmissoes[i]);
              break;
            }
          }
          console.info('latestTransmissao', latestTransmissao);

          for (let i = 0; i < latestTransmissao.length; i++) {
            let area;
            let valorPorMetro;
            let valor = Number(latestTransmissao[i].nu_vvt.replace('.', '').replace(',','.'));
            if (transmissoes[i].AREA_CONSTR) {
              area = Number(latestTransmissao[i].AREA_CONSTR.replace(',', '.'));
              valorPorMetro = valor / area;
            } else {
              area = 0;
              valorPorMetro = 0;
            }
            transmissaoData.push({label: latestTransmissao[i].de_geocode, value: [valorPorMetro.toFixed(2), area.toFixed(2)]});
          }

          function getLatestDate(data) {
            // convert to timestamp and sort
            let sortedMs = data.map(function(item) {
              return new Date(item.dt_vencimento).getTime();
            }).sort();
            // take latest
            let latestMs = sortedMs[sortedMs.length - 1];
            // convert to js date object
            return moment(latestMs).format('DD-MM-YYYY');
          }

          // Or, with named functions:
          async.waterfall([
            generateBuffer,
            searchTransmissaoSimiliar,
            searchPesquisaSimiliar
          /**
           * function - description
           *
           * @param  {type} err    description
           * @param  {type} result description
           * @return {type}        description
           */

          ], function(err) {
            if (err) {
              DocumentUtil.showMessage('error', err.message, true, null, null);
            }
            callback(transmissaoData, transmissaoSimilarData, pesquisaSimilarData);
          });
          function generateBuffer(callback) {
            if (loteFeature) {
              let serviceUrl = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14';
              let gsv = new GeometryService('https://sigribamar.com.br/server/rest/services/Utilities/Geometry/GeometryServer');
              // setup the buffer parameters
              let params = new BufferParameters();
              params.distances = [0.5];
              params.geometries = [loteFeature.geometry.getCentroid()];
              params.outSpatialReference = that.map.spatialReference;
              params.unit = GeometryService.UNIT_KILOMETER;
              params.outFields = ['sjr_cadastro.SDE.Lote.OBJECTID'];
              gsv.buffer(params, showBuffer);

              function showBuffer(bufferedGeometries) {
                let featureLayer = new FeatureLayer(serviceUrl, {
                  outFields: ['sjr_cadastro.SDE.Lote.OBJECTID']
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
                  that.circleGeometry = circleGeometry;
                  return callback(null, circleGeometry);
                });
              }
            } else {
              DocumentUtil.showMessage('warning', 'Não existe geometria para o resultado pesquisado!', true, null, 'recorteToolMessage');
              return callback(null, null);
            }
          }
          function searchTransmissaoSimiliar(circleGeometry, callback) {
            // arg1 now equals 'one' and arg2 now equals 'two'
            if (circleGeometry) {
              that.getTransmissoesInDraw([{geometry: circleGeometry}], dataDe, dataPara, function(transmissaoResponse) {
                let transmissoesSimilar = [];
                for (let i = 0; i < transmissaoResponse.length; i++) {
                  if (transmissaoResponse[i].PREDIAL === 'Predial' && transmissaoResponse[i].TIPOLOGIA === transmissoes[0].TIPOLOGIA && transmissaoResponse[i].de_geocode !== transmissoes[0].de_geocode) {
                    transmissoesSimilar.push(transmissaoResponse[i]);
                  }
                }
                for (let i = 0; i < transmissoesSimilar.length; i++) {
                  let area;
                  let valorPorMetro;
                  let valor = Number(transmissoesSimilar[i].nu_vvt.replace('.', '').replace(',','.'));
                  if (transmissoesSimilar[i].AREA_CONSTR) {
                    area = Number(transmissoesSimilar[i].AREA_CONSTR.replace(',', '.'));
                    valorPorMetro = valor / area;
                  } else {
                    valorPorMetro = 0;
                    area = 0;
                  }
                  transmissaoSimilarData.push({label: transmissoesSimilar[i].de_geocode, value: [valorPorMetro.toFixed(2), area.toFixed(2)]});
                }
                callback(null, transmissaoSimilarData, circleGeometry);
              });
            } else {
              callback(null, null, null);
            }
          }
          function searchPesquisaSimiliar(transmissaoSimilarData, circleGeometry, callback) {
            if (circleGeometry) {
              that.getPesquisasInDraw([{geometry: circleGeometry}], dataDe, dataPara, function(pesquisaResponse) {
                let pesquisaSimilar = [];
                let pesquisaFeatures = pesquisaResponse.features;
                for (let i = 0; i < pesquisaFeatures.length; i++) {
                  // if (transmissaoResponse[i].PREDIAL === 'Predial' && transmissaoResponse[i].TIPOLOGIA === transmissoes[0].TIPOLOGIA && transmissaoResponse[i].de_geocode !== transmissoes[0].de_geocode) {
                  pesquisaSimilar.push(pesquisaFeatures[i]);
                  // }
                }
                for (let i = 0; i < pesquisaSimilar.length; i++) {
                  let area;
                  let valorPorMetro;
                  let valor = Number(pesquisaSimilar[i].attributes.nu_valor_mercado);
                  if (pesquisaSimilar[i].attributes.nu_Area_Util) {
                    area = Number(pesquisaSimilar[i].attributes.nu_Area_Util);
                    valorPorMetro = valor / area;
                  } else {
                    valorPorMetro = 0;
                    area = 0;
                  }
                  pesquisaSimilarData.push({label: pesquisaSimilar[i].attributes.Geocode_Correto, value: [valorPorMetro.toFixed(2), area.toFixed(2)]});
                }
                callback(null);
              });
            } else {
              callback(null);
            }
          }
        },
        createAreaPorValorDoMetroChart: function(parentCarrouselId, parentLightCarrouselId, dataSelect, dataTransmissao, dataPesquisa, title, isMoney) {
          const INDEX_X = 1;
          const INDEX_Y = 0;
          let canvasCtx = this.createCanvas(parentCarrouselId, 200, 200);
          let canvasLightCtx;
          let canvasLight;
          let transmissaoOnlyData = [];
          let pesquisaOnlyData = [];
          if (parentLightCarrouselId) {
            canvasLightCtx = this.createCanvas(parentLightCarrouselId, 500, 380);
            canvasLight = canvasLightCtx.canvas;
          }
          let canvasCarrousel = canvasCtx.canvas;
          let rcolor = new RColor();

          let selectChartJsData = [];
          let pesquisaChartJsData = [];
          let regressaoPesquisaData = [];
          let transmissaoChartJsData = [];
          let regressaoTransmissaoData = [];
          let colors = [];

          for (let i = 0; i < dataTransmissao.length; i++) {
            if (dataTransmissao[i].value[INDEX_X] >= 0 && dataTransmissao[i].value[INDEX_Y] >= 0) {
              transmissaoOnlyData.push([Number(dataTransmissao[i].value[INDEX_X]), Number(dataTransmissao[i].value[INDEX_Y])]);
            }
          }

          for (let i = 0; i < dataPesquisa.length; i++) {
            if (dataPesquisa[i].value[INDEX_X] >= 0 && dataPesquisa[i].value[INDEX_Y] >= 0) {
              pesquisaOnlyData.push([Number(dataPesquisa[i].value[INDEX_X]), Number(dataPesquisa[i].value[INDEX_Y])]);
            }
          }

          let regressaoTransmissaoSimilar = regression.linear(transmissaoOnlyData);
          let regressaoPesquisaSimilar = regression.linear(pesquisaOnlyData);
          let resultTransmissao = regressaoTransmissaoSimilar.points;
          let resultPequisa = regressaoPesquisaSimilar.points;

          for (let i = 0; i < 5; i++) {
            colors.push(rcolor.get(true));
          }

          for (let i = 0; i < dataPesquisa.length; i++) {
            pesquisaChartJsData.push({x: dataPesquisa[i].value[INDEX_X], y: dataPesquisa[i].value[INDEX_Y]});
            if (resultTransmissao[i]) {
              regressaoPesquisaData.push({x: resultPequisa[i][0], y: resultPequisa[i][1]});
            }
          }

          for (let i = 0; i < dataTransmissao.length; i++) {
            transmissaoChartJsData.push({x: dataTransmissao[i].value[INDEX_X], y: dataTransmissao[i].value[INDEX_Y]});
            if (resultTransmissao[i]) {
              regressaoTransmissaoData.push({x: resultTransmissao[i][0], y: resultTransmissao[i][1]});
            }
          }

          for (let i = 0; i < dataSelect.length; i++) {
            selectChartJsData.push({x: dataSelect[i].value[INDEX_X], y: dataSelect[i].value[INDEX_Y]});
          }

          let data = {
            datasets: [{
              label: 'Dados Selecionado',
              showLine: false,
              borderColor: '#000000',
              pointBorderWidth: 2,
              pointRadius: 5,
              backgroundColor: '#ffffff',
              data: selectChartJsData
            }, {
              label: 'Pesquisas Próximas',
              showLine: false,
              borderColor: colors[1],
              backgroundColor: colors[1],
              data: pesquisaChartJsData
            }, {
              label: 'Regressão Pesquisa',
              showLine: true,
              fill: false,
              borderColor: colors[2],
              backgroundColor: colors[2],
              data: regressaoPesquisaData
            }, {
              label: 'Transmissões Próximas',
              showLine: false,
              borderColor: colors[3],
              backgroundColor: colors[3],
              data: transmissaoChartJsData
            }, {
              label: 'Regressão Transmissão',
              showLine: true,
              fill: false,
              borderColor: colors[4],
              backgroundColor: colors[4],
              data: regressaoTransmissaoData
            }]
          };

          // tooltips = {
          //   mode: 'single',
          //   callbacks: {
          //     label: function(tooltipItems, data) {
          //       return 'R$ ' + numberParaReal(tooltipItems.yLabel);
          //     }
          //   }
          // };

          let chartData = {
            data: data,
            options: {
              elements: {
                line: {
                  tension: 0
                }
              },
              tooltips: {
                mode: 'single',
                callbacks: {
                // Use the footer callback to display the sum of the items showing in the tooltip
                  label: function(tooltipItem, data) {
                    let tooltipList = [];

                    tooltipItem.yLabel = ' R$' + numberParaReal(tooltipItem.yLabel) + '/m²';
                    tooltipItem.xLabel = numberParaReal(tooltipItem.xLabel) + 'm²';
                    switch (tooltipItem.datasetIndex) {
                      case 0:

                        tooltipList.push(dataSelect[tooltipItem.index].label + ': ' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel);
                        break;

                      case 1:

                        tooltipList.push(dataPesquisa[tooltipItem.index].label + ': ' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel);
                        break;
                      case 2:

                        tooltipList.push('R² : ' + regressaoPesquisaSimilar.r2);
                        break;
                      case 3:

                        tooltipList.push(dataTransmissao[tooltipItem.index].label + ': ' + tooltipItem.xLabel + ', ' + tooltipItem.yLabel);
                        break;
                      case 4:

                        tooltipList.push('R² : ' + regressaoTransmissaoSimilar.r2);
                        break;

                      default:
                        tooltipList.push(tooltipItem.xLabel + ', ' + tooltipItem.yLabel);
                    }

                    return tooltipList;
                  }
                },
                footerFontStyle: 'normal'
              },
              title: {
                display: true,
                text: title,
                padding: 5
              },
              legend: {
                labels: {
                  boxWidth: 12,
                  fontSize: 11
                }
              },
              pan: {
                // Boolean to enable panning
                enabled: true,

                // Panning directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow panning in the y direction
                mode: 'xy'
              },

              // Container for zoom options
              zoom: {
                // Boolean to enable zooming
                enabled: true,

                // Enable drag-to-zoom behavior
                drag: true,

                // Zooming directions. Remove the appropriate direction to disable
                // Eg. 'y' would only allow zooming in the y direction
                mode: 'xy'
              }
            }

          };

          if (isMoney) {
            chartData.options.scales = {
              xAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    return value + 'm²';
                  }
                }
              }],
              yAxes: [{
                ticks: {
                  beginAtZero: true,
                  callback: function(value, index, values) {
                    return ' R$' + numberParaReal(value) + '/m²';
                  }
                }
              }]
            };
          }
          if (parentCarrouselId === 'carousel_inner') {
            selfRecorte.chartCarrouselAreaPorValorDoMetroChart = Chart.Scatter(canvasCtx, chartData);
            console.info('GRAFICO UNIDADE',selfRecorte.chartCarrouselAreaPorValorDoMetroChart)
            selfRecorte.chartCarrouselAreaPorValorDoMetroChart.legend.onClick = function(){
              alert('onclick legend');
            };
          } 
          
          canvasCarrousel.onclick = function(evt) {
            if (evt.shiftKey) {
              selfRecorte.chartCarrouselAreaPorValorDoMetroChart.resetZoom();
            }
          };
          if (parentLightCarrouselId) {
            selfRecorte.chartLightCarrouselAreaPorValorDoMetroChart = Chart.Scatter(canvasLightCtx, chartData);
            canvasLight.onclick = function(evt) {
              if (evt.shiftKey) {
                selfRecorte.chartLightCarrouselAreaPorValorDoMetroChart.resetZoom();
              }
            };
          }
          return selfRecorte.chartCarrouselAreaPorValorDoMetroChart;
        },
        setExtentRecorte: function() {
          let geometryList = [];
          let features = selfRecorte.map.graphics.graphics;
          for (let i = 0; i < features.length; i++) {
            geometryList.push(features[i].geometry);
          }
          let unionGeometry = geometryEngine.union(geometryList);
          //
          if (unionGeometry) {
            let extent = unionGeometry.getExtent();
            this.map.setExtent(extent, true);
            let zoom = this.map.getZoom();
            if (zoom >= 20) {
              this.map.setZoom(16);
            }
          }
        },
        createCanvas: function(parentId, width, height) {
          let parentCarrousel = document.getElementById(parentId);
          let div = document.createElement('div');
          let arrowleft = document.getElementById('arrowleft');
          let arrowright = document.getElementById('arrowright');
          let trash = document.getElementById('limparRecorte');
          let exportRec = document.getElementById('exportarRecorte');
          let divTablesRecorte = document.getElementById('divTablesRecorte');
          let number = parentCarrousel.childNodes.length + 1;
          let canvasId = parentId + '_canvas_' + number;
          let carouselIndicators;
          let liIndicator;
          let qtdTransmissaoLabel = document.getElementById('qtd_transmissao_label');
          let qtdPesquisaLabel = document.getElementById('qtd_pesquisa_label');

          // <li data-target="#myCarousel" data-slide-to="0" class="active"></li>
          if (parentId === 'carousel_inner') {
            carouselIndicators = document.getElementById('carousel-indicators');
            liIndicator = document.createElement('li');
            liIndicator.setAttribute('data-target', '#myCarousel');
            liIndicator.setAttribute('data-slide-to', '0');
          }
          let canvas = document.createElement('canvas');
          if (parentCarrousel.childNodes.length === 0) {
            div.setAttribute('class', 'item active');
            if (liIndicator) {
              liIndicator.setAttribute('class', 'active');
            }
          } else {
            div.setAttribute('class', 'item');
          }

          canvas.setAttribute('id', canvasId);
          canvas.width = width;
          canvas.height = height;

          arrowleft.style.display = 'block';
          arrowright.style.display = 'block';
          divTablesRecorte.style.display = 'block';
          trash.disabled = false;
          if (qtdPesquisaLabel.innerText === '0' && qtdTransmissaoLabel.innerText === '0') {
            exportRec.disabled = true;
          } else {
            exportRec.disabled = false;
          }

          div.appendChild(canvas);
          parentCarrousel.appendChild(div);
          if (liIndicator) {
            carouselIndicators.appendChild(liIndicator);
          }
          let ctx = canvas.getContext('2d');

          return ctx;
        },
        createDiv: function(title, parentId, width, height) {
          let parentCarrousel = document.getElementById(parentId);
          let div = document.createElement('div');

          let arrowleft = document.getElementById('arrowleft');
          let arrowright = document.getElementById('arrowright');
          let trash = document.getElementById('limparRecorte');
          let exportRec = document.getElementById('exportarRecorte');
          let divTablesRecorte = document.getElementById('divTablesRecorte');
          let divCarousel = document.getElementById('myCarousel');
          let number = parentCarrousel.childNodes.length + 1;
          let chartDivId = parentId + '_chartdiv_' + number;
          let chartDiv = document.createElement('div');
          let titleDiv = document.createElement('div');
          let carouselIndicators;
          let liIndicator;
          let qtdTransmissaoLabel = document.getElementById('qtd_transmissao_label');
          let qtdPesquisaLabel = document.getElementById('qtd_pesquisa_label');

          if (parentId === 'carousel_inner') {
            carouselIndicators = document.getElementById('carousel-indicators');
            liIndicator = document.createElement('li');
            liIndicator.setAttribute('data-target', '#myCarousel');
            liIndicator.setAttribute('data-slide-to', '0');
          }
          if (parentCarrousel.childNodes.length === 0) {
            div.setAttribute('class', 'item active');
          } else {
            div.setAttribute('class', 'item');
          }

          titleDiv.innerHTML = title;
          titleDiv.setAttribute('style', "margin-bottom: 15px;font-family: 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif; font-weight: bold;color: #666;");

          chartDiv.setAttribute('id', chartDivId);
          chartDiv.width = width;
          chartDiv.height = height;
          chartDiv.setAttribute('style', 'margin-left: 3px;');

          arrowleft.style.display = 'block';
          arrowright.style.display = 'block';
          divTablesRecorte.style.display = 'block';
          divCarousel.style.display = 'block';
          trash.disabled = false;
          // TODO disabled true qdo for tudo 0
          if (qtdPesquisaLabel.innerText === '0' && qtdTransmissaoLabel.innerText === '0') {
            exportRec.disabled = true;
          } else {
            exportRec.disabled = false;
          }

          chartDiv.appendChild(titleDiv);
          div.appendChild(chartDiv);
          parentCarrousel.appendChild(div);
          if (liIndicator) {
            carouselIndicators.appendChild(liIndicator);
          }

          return chartDivId;
        },
        clearRecorte: function() {
          let parentCarousel = document.getElementById('carousel_inner');
          let lightboxParentCarousel = document.getElementById('lightbox-panel_inner');
          let button = document.getElementById('maximizarGrafico');
          let arrowleft = document.getElementById('arrowleft');
          let arrowright = document.getElementById('arrowright');
          let trash = document.getElementById('limparRecorte');
          let exportRec = document.getElementById('exportarRecorte');
          let inputSearch = document.getElementById('searchGeometryInput');
          let buttonSearch = document.getElementById('searchGeometryButton');
          let carouselIndicators = document.getElementById('carousel-indicators');
          let recorteDatatableTransmissao = document.getElementById('recorte_datatable_transmissao');
          let recorteDatatablePesquisa = document.getElementById('recorte_datatable_pesquisa');
          let recorteDatatableTransmissaoLight = document.getElementById('recorte_datatable_transmissao_lightbox');
          let recorteDatatablePesquisaLight = document.getElementById('recorte_datatable_pesquisa_lightbox');
          let divTablesRecorte = document.getElementById('divTablesRecorte');
          let divCarousel = document.getElementById('myCarousel');
          let chartsDiv = document.getElementById('chartsToPDF');

          let qtdPesquisaLabel = document.getElementById('qtd_pesquisa_label');
          let qtdPesquisaPredialLabel = document.getElementById('qtd_pesquisa_predial_label');
          let qtdPesquisaTerritorialLabel = document.getElementById('qtd_pesquisa_territorial_label');
          let qtdPesquisaTotalLabel = document.getElementById('qtd_pesquisa_total_label');

          let valorPesquisaPredialLabel = document.getElementById('valor_pesquisa_predial_label');
          let valorPesquisaTerritorialLabel = document.getElementById('valor_pesquisa_territorial_label');
          let valorPesquisaTotalLabel = document.getElementById('valor_pesquisa_total_label');

          let qtdTransmissaoLabel = document.getElementById('qtd_transmissao_label');
          let qtdTransmissaoPredialLabel = document.getElementById('qtd_transmissao_predial_label');
          let qtdTransmissaoTerritorialLabel = document.getElementById('qtd_transmissao_territorial_label');
          let qtdTransmissaoTotalLabel = document.getElementById('qtd_transmissao_total_label');

          let valorTransmissaoPredialLabel = document.getElementById('valor_transmissao_predial_label');
          let valorTransmissaoTerritorialLabel = document.getElementById('valor_transmissao_territorial_label');
          let valorTransmissaoTotalLabel = document.getElementById('valor_transmissao_total_label');

          qtdPesquisaLabel.innerText = '0';
          qtdPesquisaPredialLabel.innerText = '0';
          qtdPesquisaTerritorialLabel.innerText = '0';
          qtdPesquisaTotalLabel.innerText = '0';

          valorPesquisaPredialLabel.innerText = 'R$ 0,00';
          valorPesquisaTerritorialLabel.innerText = 'R$ 0,00';
          valorPesquisaTotalLabel.innerText = 'R$ 0,00';

          qtdTransmissaoLabel.innerText = '0';
          qtdTransmissaoPredialLabel.innerText = '0';
          qtdTransmissaoTerritorialLabel.innerText = '0';
          qtdTransmissaoTotalLabel.innerText = '0';

          valorTransmissaoPredialLabel.innerText = 'R$ 0,00';
          valorTransmissaoTerritorialLabel.innerText = 'R$ 0,00';
          valorTransmissaoTotalLabel.innerText = 'R$ 0,00';

          selfRecorte.map.graphics.clear();

          button.style.display = 'none';
          arrowleft.style.display = 'none';
          arrowright.style.display = 'none';
          divTablesRecorte.style.display = 'none';
          divCarousel.style.display = 'none';
          chartsDiv.style.display = '';
          //trash.disabled = true;
          trash.disabled = false;
          exportRec.disabled = true;
          inputSearch.disabled = true;
          buttonSearch.disabled = true;

          while (parentCarousel.hasChildNodes()) {
            parentCarousel.removeChild(parentCarousel.firstChild);
          }
          while (carouselIndicators.hasChildNodes()) {
            carouselIndicators.removeChild(carouselIndicators.firstChild);
          }
          while (lightboxParentCarousel.hasChildNodes()) {
            lightboxParentCarousel.removeChild(lightboxParentCarousel.firstChild);
          }
          while (recorteDatatableTransmissao.hasChildNodes()) {
            recorteDatatableTransmissao.removeChild(recorteDatatableTransmissao.firstChild);
          }
          while (recorteDatatablePesquisa.hasChildNodes()) {
            recorteDatatablePesquisa.removeChild(recorteDatatablePesquisa.firstChild);
          }
          while (chartsDiv.hasChildNodes()) {
            chartsDiv.removeChild(chartsDiv.firstChild);
          }
          while (recorteDatatableTransmissaoLight.hasChildNodes()) {
            recorteDatatableTransmissaoLight.removeChild(recorteDatatableTransmissaoLight.firstChild);
          }
          while (recorteDatatablePesquisaLight.hasChildNodes()) {
            recorteDatatablePesquisaLight.removeChild(recorteDatatablePesquisaLight.firstChild);
          }
        },

        exportRecorte: function() {
          let that = this;
          that.setExtentRecorte();
          DocumentUtil.showSpinner(true);
          DocumentUtil.showMessage('info', 'Exportando...', true, 10000, 'recorteToolMessage');

          let qtdPesquisaPredialLabel = document.getElementById('qtd_pesquisa_predial_label');
          let qtdPesquisaTerritorialLabel = document.getElementById('qtd_pesquisa_territorial_label');
          let qtdPesquisaTotalLabel = document.getElementById('qtd_pesquisa_total_label');

          let valorPesquisaPredialLabel = document.getElementById('valor_pesquisa_predial_label');
          let valorPesquisaTerritorialLabel = document.getElementById('valor_pesquisa_territorial_label');
          let valorPesquisaTotalLabel = document.getElementById('valor_pesquisa_total_label');

          let qtdTransmissaoPredialLabel = document.getElementById('qtd_transmissao_predial_label');
          let qtdTransmissaoTerritorialLabel = document.getElementById('qtd_transmissao_territorial_label');
          let qtdTransmissaoTotalLabel = document.getElementById('qtd_transmissao_total_label');

          let valorTransmissaoPredialLabel = document.getElementById('valor_transmissao_predial_label');
          let valorTransmissaoTerritorialLabel = document.getElementById('valor_transmissao_territorial_label');
          let valorTransmissaoTotalLabel = document.getElementById('valor_transmissao_total_label');

          let dataDeRecorte = document.getElementById('filtroInputDeRecorte');
          let dataAteRecorte = document.getElementById('filtroInputAteRecorte');

          setTimeout(function() {
          // GENERATE OVERVIEW
            let svg = document.querySelector('#map_gc');
            let svgXml = (new XMLSerializer()).serializeToString(svg);
            let blob = new Blob([svgXml], {
              type: 'image/svg+xml;charset=utf-8'
            });
            let url = window.URL.createObjectURL(blob);
            let imgTemp = new Image();
            imgTemp.onload = function() {
              let canvasTemp = document.querySelector('#canvasOver');
              canvasTemp.width = svg.width.animVal.value;
              canvasTemp.height = svg.height.animVal.value;
              let ctxTemp = canvasTemp.getContext('2d');
              ctxTemp.drawImage(imgTemp, 0, 0, svg.width.animVal.value, svg.height.animVal.value);
              window.URL.revokeObjectURL(url);
              canvasTemp.toDataURL('image/png');
            };
            imgTemp.src = url;

            let canvasOverview = document.createElement('canvas');
            mapToCanvas(selfRecorte.map, canvasOverview).then(function() {
              let urlOverview;
              try {
                urlOverview = canvasOverview.toDataURL();
                let data = {
                  urlOverview: urlOverview,
                  dataDeRecorte: dataDeRecorte,
                  dataAteRecorte: dataAteRecorte,
                  qtdTransmissaoTerritorialLabel: qtdTransmissaoTerritorialLabel,
                  valorTransmissaoTerritorialLabel: valorTransmissaoTerritorialLabel,
                  qtdTransmissaoPredialLabel: qtdTransmissaoPredialLabel,
                  valorTransmissaoPredialLabel: valorTransmissaoPredialLabel,
                  qtdTransmissaoTotalLabel: qtdTransmissaoTotalLabel,
                  valorTransmissaoTotalLabel: valorTransmissaoTotalLabel,
                  qtdPesquisaTerritorialLabel: qtdPesquisaTerritorialLabel,
                  valorPesquisaTerritorialLabel: valorPesquisaTerritorialLabel,
                  qtdPesquisaPredialLabel: qtdPesquisaPredialLabel,
                  valorPesquisaPredialLabel: valorPesquisaPredialLabel,
                  qtdPesquisaTotalLabel: qtdPesquisaTotalLabel,
                  valorPesquisaTotalLabel: valorPesquisaTotalLabel,
                  tablePesquisaToPDFRows: that.tablePesquisaToPDF.rows.data,
                  tableTransmissaoToPDFRows: that.tableTransmissaoToPDF.rows.data,
                  tablePesquisaToPDFTitles: that.tablePesquisaToPDF.titles.data,
                  tableTransmissaoToPDFTitles: that.tableTransmissaoToPDF.titles.data
                };

                console.info("data of pdf----------",data)
                DocCreator.create(data);
                DocumentUtil.showSpinner(false);
              } catch (e) {
                DocumentUtil.showSpinner(false);
              // TODO colocar msg de erro
              // alert(e.message);
              }
            });
          }, 10000);
        },
        exportRecorteCSV: function(e) {
          e.preventDefault();
          // getting data from our table
          // transmissao
          let dataType = 'data:application/vnd.ms-excel';
          let tableDiv = document.getElementById('recorte_datatable_transmissao');
          let tableHtml = tableDiv.outerHTML.replace(/ /g, '%20');

          let a = document.createElement('a');
          a.href = dataType + ', ' + tableHtml;
          a.download = 'recorte_transmissao_GEOITBI_results' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
          a.click();

          // pesquisa
          let dataTypePesq = 'data:application/vnd.ms-excel';
          let tableDivPesq = document.getElementById('recorte_datatable_pesquisa');
          let tableHtmlPesq = tableDivPesq.outerHTML.replace(/ /g, '%20');

          let aPesq = document.createElement('a');
          aPesq.href = dataTypePesq + ', ' + tableHtmlPesq;
          aPesq.download = 'recorte_pesquisa_GEOITBI_results' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
          aPesq.click();
        },
        objectToArray: function(object, title) {
          let labels = [];
          let values = [];
          for (let variable in object) {
            if (object.hasOwnProperty(variable) && variable !== 'total') {
              labels.push(variable);
              values.push(object[variable]);
            }
          }
          return {
            labels: labels,
            data: values,
            title: title
          };
        },
        objectWithTimeToArray: function(objectLabel, column, title) {
     
          // tipoImovelPorTempo[moment(transmissoes[i].dt_vencimento).format(dateMask)].quantidade.predial
          let labels = [];
          let datasets = [];
          for (let variable in objectLabel) {
            if (objectLabel.hasOwnProperty(variable)) {
              labels.push(variable);
              let object = objectLabel[variable][column];
              for (let variable2 in object) {
                if (object.hasOwnProperty(variable2) && variable2 !== 'total') {
                  let hasDataset = false;
                  for (let i = 0; i < datasets.length; i++) {
                    if (datasets[i].label === variable2) {
                      hasDataset = true;
                    }
                  }
                  if (!hasDataset) {
                    let dataset = {
                      label: variable2,
                      data: []
                    };
                    datasets.push(dataset);
                  }
                  for (let i = 0; i < datasets.length; i++) {
                    if (datasets[i].label === variable2) {
                      let dataset = datasets[i];
                      dataset.data.push(object[variable2]);
                    }
                  }
                }
              }
            }
          }
          let result = {
            labels: labels,
            datasets: datasets,
            title: title
          };

          return result;
        }

      });
    } catch (err) {
      DocumentUtil.showMessage('warning', err.message, true, null, 'drawLoteError');
      return err;
    }
  });

  function numberParaReal(numero) {
    if (!numero) {
      numero = 0.00;
    }
    numero = Number(numero).toFixed(2).split('.');
    numero[0] = numero[0].split(/(?=(?:...)*$)/).join('.');
    return numero.join(',');
  }

  function desactiveOptionsRecorte() {
      $('#btnGroupPesquisa').css("pointer-events", "none");
      $('#dropdownMenu1').css("pointer-events", "none");
      //$('#dropdownMenu1').css("background-color", "gray");
      //$('#dropdownMenu3').css("background-color", "gray");
      //$('#searchByClickButton').css("background-color", "gray");
      //$('#searchGeometryInput').css("background-color", "gray");
      //$('#searchGeometryButton').css("background-color", "gray");
  }

  function desactiveOptionsGeometry(){
      $('#dropdownMenu1').css("pointer-events", "none");
        //$('#dropdownMenu1').css("background-color", "gray");
  }

  // function activeBuscarRecorte(event) {
  //   let input = document.getElementById('searchGeometryInput').value;

  //   let button = document.getElementById('searchGeometryButton');
  //   if (input) {
  //     button.disabled = false;
  //   } else {
  //     button.disabled = true;
  //   }
  // }
})();
