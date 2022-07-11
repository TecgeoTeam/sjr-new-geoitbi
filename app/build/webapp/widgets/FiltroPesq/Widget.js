/* global define moment dojo updateEditHtml $:true */
let selfPesquisa;
let bufferToolbar;
let toolbar;
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
  'esri/geometry/Polygon',
  'esri/geometry/Circle',
  'esri/geometry/Point',
  'esri/geometry/geometryEngine',
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
  Polygon,
  Circle,
  Point,
  geometryEngine,
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

  // var selfPesquisa;
  return declare([BaseWidget], {
    // Custom widget code goes here
    templateString: template,
    baseClass: 'jimu-widget-FiltroPesq',
    postCreate: function() {
      selfPesquisa = this;
      // window.esriMap = this.map;
      selfPesquisa.parametrosPesquisa = [];

      selfPesquisa.createToolbar();
      selfPesquisa.createBufferToolbar();
      let mainDiv = document.getElementById('main-page');
      let dialogDiv = document.createElement('dialog');
      dialogDiv.id = 'myWidgetDialogCadastrar';
      mainDiv.appendChild(dialogDiv);
      dialogDiv.setAttribute('class', 'jimu-widget-tecgeo');
      $('#myWidgetDialogCadastrar').load('widgets/FiltroPesq/dialogCadastrar.html');
      // editar
      let mainDivEditar = document.getElementById('main-page');
      let dialogDivEditar = document.createElement('dialog');
      dialogDivEditar.id = 'myWidgetDialogEditar';
      mainDivEditar.appendChild(dialogDivEditar);
      dialogDivEditar.setAttribute('class', 'jimu-widget-tecgeo');
      $('#myWidgetDialogEditar').load('widgets/FiltroPesq/dialogEditar.html');
    },
    startup: function() {
      document.getElementById('filtroInputDe').value = moment().startOf('week').format('DD-MM-YYYY');
      document.getElementById('filtroInputAte').value = moment().endOf('week').format('DD-MM-YYYY');
      document.getElementById('filtroPesquisaInputDe').value = moment().startOf('week').format('DD-MM-YYYY');
      document.getElementById('filtroPesquisaInputAte').value = moment().endOf('week').format('DD-MM-YYYY');
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
      document.getElementById('defaultOpen').click();

      $(document).ready(function() {
        $('#filtroInputDe').mask('00-00-0000');
        $('#filtroInputAte').mask('00-00-0000');
        $('#filtroPesquisaInputDe').mask('00-00-0000');
        $('#filtroPesquisaInputAte').mask('00-00-0000');
        $('#dataDeCadastro').mask('00-00-0000');
      });
    },
    buttonActionCadastrar: function() {
      let element = document.getElementById('myWidgetDialogCadastrar');
      if (element.hasAttribute('open')) {
        element.removeAttribute('open');
      } else {
        element.setAttribute('open', 'false');
      }
    },
    buttonActionEditar: buttonActionEditar,
    limparFiltroCadastro: function() {
      for (let i = selfPesquisa.map.graphics.graphics.length - 1; i >= 0; i--) {
        let geometry = selfPesquisa.map.graphics.graphics[i].geometry;
        if (geometry.type === 'point') {
          selfPesquisa.map.graphics.remove(selfPesquisa.map.graphics.graphics[i]);
        }
      }
      let tableFiltroCadastrar = document.getElementById('table-filtro-cadastro');
      while (tableFiltroCadastrar.hasChildNodes()) {
        tableFiltroCadastrar.removeChild(tableFiltroCadastrar.firstChild);
      }
    },
    filtroCadastro: function() {
      let filtroInputDe = document.getElementById('filtroInputDe').value;
      let filtroInputAte = document.getElementById('filtroInputAte').value;
      DocumentUtil.showSpinner(true);

      //let usuarioDados = JSON.parse(localStorage["ngStorage-dados"]);
      let usuarioDados = localStorage.getItem('email')
      //console.log(usuarioDados.usuario.username);
      let parametro = [{
        name: 'de_username',
        value: usuarioDados,
        operador: 'Igual',
        label: 'Usuário'
      }];

      selfPesquisa.searchPesquisa(filtroInputDe, filtroInputAte, parametro, function(result) {
        console.log("RESULT FILTRO CADASTRO", result)
        selfPesquisa.fillFiltroTable(result);
      });
    },

    fillFiltroTable: function(result) {
      for (let i = selfPesquisa.map.graphics.graphics.length - 1; i >= 0; i--) {
        let geometry = selfPesquisa.map.graphics.graphics[i].geometry;
        if (geometry.type === 'point') {
          selfPesquisa.map.graphics.remove(selfPesquisa.map.graphics.graphics[i]);
        }
      }

      selfPesquisa.edicaoCadastro = {
        features: result.features,
        fields: result.fields
      };
      let graphics = [];
      if (result.features.length > 0) {
        for (let i = 0; i < result.features.length; i++) {
          let symbol = new SimpleMarkerSymbol(
            SimpleMarkerSymbol.STYLE_CIRCLE,
            12,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_NULL,
              new Color([0, 255, 255, 0.9]),
              1
            ),
            new Color([0, 255, 255, 0.6])
          );
          let graphic = new Graphic(result.features[i].geometry, symbol);
          graphic.attributes = result.features[i].attributes;
          graphic.setSymbol(symbol);
          graphics.push(graphic);
        }
        for (let i = 0; i < graphics.length; i++) {
          selfPesquisa.map.graphics.add(graphics[i]);
        }
        dojo.connect(selfPesquisa.map.graphics, 'onClick', identifyFeatures);

        let tableFiltroCadastrar = document.getElementById('table-filtro-cadastro');
        selfPesquisa.fillPesquisaTable(tableFiltroCadastrar, result, true);

        let qtCadastros = result.features.length;

        document.getElementById('labelQtCadastros').innerHTML = qtCadastros + ' ocorrência(s)';
      } else {
        DocumentUtil.showMessage('info', 'Não foram encontrados resultados!', true, null, 'filtroPesquisaError');
        DocumentUtil.showSpinner(false);
      }
      function identifyFeatures(evt) {
        let g = evt.graphic;
        let indexSelect;
        for (let i = 0; i < selfPesquisa.edicaoCadastro.features.length; i++) {
          if (selfPesquisa.edicaoCadastro.features[i].attributes.OBJECTID === g.attributes.OBJECTID) {
            indexSelect = i;
            break;
          }
        }
        selectEditFeature(indexSelect, 'trEdit-' + indexSelect);
      }
    },
    filtroCadastroByMapClick: function() {
        let tool = 'POINT';
        console.log(bufferToolbar);
        for (let i = bufferToolbar.map.graphics.graphics.length - 1; i >= 0; i--) {
            let geometry = bufferToolbar.map.graphics.graphics[i].geometry;
                bufferToolbar.map.graphics.remove(bufferToolbar.map.graphics.graphics[i]);
        }

        bufferToolbar.map.infoWindow.popupWindow = false;
        bufferToolbar.map.infoWindow.set("highlight", false);

      DocumentUtil.showMessage('info', 'Clique no mapa para gerar um buffer', true, null, 'pointBufferMessage');
      bufferToolbar.activate(Draw[tool]);
    },
    filtroPesquisa: function() {
      DocumentUtil.showSpinner(true);
      let filtroInputDe = document.getElementById('filtroPesquisaInputDe').value;
      let filtroInputAte = document.getElementById('filtroPesquisaInputAte').value;

      selfPesquisa.searchPesquisa(filtroInputDe, filtroInputAte, selfPesquisa.parametrosPesquisa, function(result) {
        for (let i = selfPesquisa.map.graphics.graphics.length - 1; i >= 0; i--) {
          let geometry = selfPesquisa.map.graphics.graphics[i].geometry;
          if (geometry.type === 'point') {
            selfPesquisa.map.graphics.remove(selfPesquisa.map.graphics.graphics[i]);
          }
        }

        if (result.features.length > 0) {
          selfPesquisa.mostragemPesquisa = {
            features: result.features,
            fields: result.fields
          };
          let graphics = [];
          for (let i = 0; i < result.features.length; i++) {
            let symbol = new SimpleMarkerSymbol(
              SimpleMarkerSymbol.STYLE_CIRCLE,
              12,
              new SimpleLineSymbol(
                SimpleLineSymbol.STYLE_SOLID,
                new Color([6, 85, 153, 0.9]),
                1
              ),
              new Color([0, 255, 255, 0.6])
            );
            let graphic = new Graphic(result.features[i].geometry, symbol);
            graphic.setSymbol(symbol);
            graphics.push(graphic);
          }
          for (let i = 0; i < graphics.length; i++) {
            selfPesquisa.map.graphics.add(graphics[i]);
          }

          let tableFiltroCadastrar = document.getElementById('table-filtro-pesquisa');
          selfPesquisa.fillPesquisaTable(tableFiltroCadastrar, result);

          let qtPesquisas = result.features.length;

          showZoomPratodosPesquisa(true);
          showbtnExportPesquisas(true);
          btnlimparFiltroPesquisa(true);
          document.getElementById('labelQtPesquisas').innerHTML = qtPesquisas + ' ocorrência(s)';
        } else {
          DocumentUtil.showMessage('info', 'Não foram encontrados resultados!', true, null, 'filtroPesquisaError');
          DocumentUtil.showSpinner(false);
        }
      });
    },
    zoomParaTodosPesq: function(result) {
      let geometryList = [];
      let features = selfPesquisa.mostragemPesquisa.features;
      for (let i = 0; i < features.length; i++) {
        geometryList.push([features[i].geometry.x, features[i].geometry.y]);
      }
      let polygon = new Polygon(geometryList);
      polygon.setSpatialReference(new SpatialReference({
        wkid: 3857
      }));
      let extentRing = polygon.getExtent();

      selfPesquisa.map.setExtent(extentRing, true);
    },
    fillPesquisaTable: function(tableFiltroCadastrar, result, isEditable) {
      while (tableFiltroCadastrar.hasChildNodes()) {
        tableFiltroCadastrar.removeChild(tableFiltroCadastrar.firstChild);
      }

      let tablearea = tableFiltroCadastrar;
      let table = document.createElement('tbody');

      let trTh = document.createElement('tr');
      trTh.setAttribute('class', 'th-nowrap');
      // cabeçalho da tabela

      let theadtable = document.createElement('thead');
      tablearea.appendChild(theadtable);

      let th1 = document.createElement('th');
      th1.setAttribute('class', 'th-condicao');
      let th2 = document.createElement('th');
      th2.setAttribute('class', 'th-condicao');
      let th3 = document.createElement('th');
      th3.setAttribute('class', 'th-condicao');
      let th4 = document.createElement('th');
      th4.setAttribute('class', 'th-condicao');
      let th5 = document.createElement('th');
      th5.setAttribute('class', 'th-condicao');
      let th6 = document.createElement('th');
      th6.setAttribute('class', 'th-condicao');
      let th7 = document.createElement('th');
      th7.setAttribute('class', 'th-condicao');
      let th8 = document.createElement('th');
      th8.setAttribute('class', 'th-condicao');
      let th9 = document.createElement('th');
      th9.setAttribute('class', 'th-condicao');
      let th10 = document.createElement('th');
      th10.setAttribute('class', 'th-condicao');
      let th11 = document.createElement('th');
      th11.setAttribute('class', 'th-condicao');
      let th12 = document.createElement('th');
      th12.setAttribute('class', 'th-condicao');
      let th13 = document.createElement('th');
      th13.setAttribute('class', 'th-condicao');
      let th14 = document.createElement('th');
      th14.setAttribute('class', 'th-condicao');
      let th15 = document.createElement('th');
      th15.setAttribute('class', 'th-condicao');
      let th16 = document.createElement('th');
      th16.setAttribute('class', 'th-condicao');
      let th17 = document.createElement('th');
      th17.setAttribute('class', 'th-condicao');

      trTh.appendChild(th1);
      trTh.appendChild(th2);
      trTh.appendChild(th3);
      trTh.appendChild(th4);
      trTh.appendChild(th5);
      trTh.appendChild(th6);
      trTh.appendChild(th7);
      trTh.appendChild(th8);
      trTh.appendChild(th9);
      trTh.appendChild(th10);
      trTh.appendChild(th11);
      trTh.appendChild(th12);
      trTh.appendChild(th13);
      trTh.appendChild(th14);
      trTh.appendChild(th15);
      trTh.appendChild(th16);
      trTh.appendChild(th17);

      trTh.cells[0].appendChild(document.createTextNode('Tipo'));
      trTh.cells[1].appendChild(document.createTextNode('Tipologia'));
      trTh.cells[2].appendChild(document.createTextNode('Padrão'));
      trTh.cells[3].appendChild(document.createTextNode('Idade'));
      trTh.cells[4].appendChild(document.createTextNode('Área Útil'));
      trTh.cells[5].appendChild(document.createTextNode('Conservação'));
      trTh.cells[6].appendChild(document.createTextNode('Quartos'));
      trTh.cells[7].appendChild(document.createTextNode('Fonte da Pesquisa'));
      trTh.cells[8].appendChild(document.createTextNode('Banheiros'));
      trTh.cells[9].appendChild(document.createTextNode('Garagem'));
      trTh.cells[10].appendChild(document.createTextNode('Pavimento'));
      trTh.cells[11].appendChild(document.createTextNode('Tipo do Pavimento'));
      trTh.cells[12].appendChild(document.createTextNode('Valor de Mercado'));
      trTh.cells[13].appendChild(document.createTextNode('Tipo do Lote'));
      trTh.cells[14].appendChild(document.createTextNode('Área do Terreno Site'));
      trTh.cells[15].appendChild(document.createTextNode('Área do Terreno Cadastro'));
      trTh.cells[16].appendChild(document.createTextNode('Observação'));

      theadtable.appendChild(trTh);
      // fim do cabeçalho
      for (let i = 0; i < result.features.length; i++) {
        // conteudo da tabela
        let trConteudo = document.createElement('tr');
        trConteudo.setAttribute('style', 'cursor: pointer');
        if (isEditable) {
          trConteudo.setAttribute('id', 'trEdit-' + i);
          trConteudo.setAttribute('onclick', 'selectEditFeature(' + i + ",'trEdit-" + i + "')");
          trConteudo.setAttribute('ondblclick', 'buttonActionEditar()');
        } else {
          trConteudo.setAttribute('id', 'trPesquisa-' + i);
          trConteudo.setAttribute('onclick', 'selectFeaturePesquisa(' + i + ",'trPesquisa-" + i + "')");
        }

        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));

        trConteudo.cells[0].appendChild(document.createTextNode(result.features[i].attributes['de_tipo_do_imovel']));
        trConteudo.cells[1].appendChild(document.createTextNode(result.features[i].attributes['de_tipologia']));
        trConteudo.cells[2].appendChild(document.createTextNode(result.features[i].attributes['de_padrao']));
        trConteudo.cells[3].appendChild(document.createTextNode(result.features[i].attributes['nu_idade']));
        trConteudo.cells[4].appendChild(document.createTextNode(result.features[i].attributes['nu_area_construida']));
        trConteudo.cells[5].appendChild(document.createTextNode(result.features[i].attributes['de_conservacao']));
        trConteudo.cells[6].appendChild(document.createTextNode(result.features[i].attributes['nu_quartos']));
        trConteudo.cells[7].appendChild(document.createTextNode(result.features[i].attributes['de_fonte_pesquisa']));
        trConteudo.cells[8].appendChild(document.createTextNode(result.features[i].attributes['nu_banheiros']));
        trConteudo.cells[9].appendChild(document.createTextNode(result.features[i].attributes['nu_garagens']));
        trConteudo.cells[10].appendChild(document.createTextNode(result.features[i].attributes['nu_qtd_pavimetos']));
        trConteudo.cells[11].appendChild(document.createTextNode(result.features[i].attributes['de_tipo_do_imovel']));
        trConteudo.cells[12].appendChild(document.createTextNode(result.features[i].attributes['nu_valor_mercado']));
        trConteudo.cells[13].appendChild(document.createTextNode(result.features[i].attributes['de_tipologia']));
        trConteudo.cells[14].appendChild(document.createTextNode(result.features[i].attributes['nu_area_terreno']));
        trConteudo.cells[15].appendChild(document.createTextNode(result.features[i].attributes['nu_area_terreno']));
        trConteudo.cells[16].appendChild(document.createTextNode(result.features[i].attributes['de_imobiliaria']));

        table.appendChild(trConteudo);
      }

      tablearea.appendChild(table);
      // fim do conteudo da tabela
      if (!isEditable) {
        $.extend(true, $.fn.dataTable.defaults, {
          'searching': false,
          'ordering': true,
          'lengthMenu': false,
          'info': false,
          'paging': false,
          'scrollY': '115px',
          'scrollX': true,
          'scrollCollapse': true
        });

        $(document).ready(function() {
          $('#table-filtro-pesquisa').DataTable();
        });
      }

      DocumentUtil.showSpinner(false);
    },
    limparFiltroPesquisa: function() {
      for (let i = selfPesquisa.map.graphics.graphics.length - 1; i >= 0; i--) {
        let geometry = selfPesquisa.map.graphics.graphics[i].geometry;
        if (geometry.type === 'point') {
          selfPesquisa.map.graphics.remove(selfPesquisa.map.graphics.graphics[i]);
        }
      }
      let tableFiltroPesquisa = document.getElementById('table-filtro-pesquisa');
      document.getElementById('labelQtPesquisas').innerHTML = '';

      while (tableFiltroPesquisa.hasChildNodes()) {
        tableFiltroPesquisa.removeChild(tableFiltroPesquisa.firstChild);
      }
    },
    createToolbar: function() {
      toolbar = new Draw(selfPesquisa.map);
      toolbar.on('draw-end', selfPesquisa.addToMap);
    },
    createBufferToolbar: function() {
      bufferToolbar = new Draw(selfPesquisa.map);
      bufferToolbar.on('draw-end', selfPesquisa.generateBuffer);
    },
    exportarPesquisas: function() {
      $(document).ready(function() {
        $('#btnExportPesquisas').click(function(e) {
          e.preventDefault();

          // getting data from our table
          let dataType = 'data:application/vnd.ms-excel';
          let tableDiv = document.getElementById('table_wrapper_pesquisas');
          let tableHtml = escape(tableDiv.outerHTML);

          let a = document.createElement('a');
          a.href = dataType + ', ' + tableHtml;
          a.download = 'pesquisas_GEOITBI_results' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';

          a.click();
        });
      });
    },
    addToMap: function(evt) {
      let symbol;
      toolbar.deactivate();
      // map.showZoomSlider();
      window.filtroPesq = {
        novaPesquisa: evt,
        map: selfPesquisa.map
      };

      switch (evt.geometry.type) {
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
      let graphic = new Graphic(evt.geometry, symbol);
      selfPesquisa.map.graphics.add(graphic);
      DocumentUtil.showMessage('info', 'Clique no mapa para adicionar um ponto', false, null, 'pointCadastroMessage');
      selfPesquisa.buttonActionCadastrar();
    },
    generateBuffer: function(evt) {
      let serviceUrl = 'http://www.senocwb.com/senoportal/rest/services/SJR_ITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0';
      let gsv = new GeometryService(selfPesquisa.config.geometryServerServiceUrl);
      // setup the buffer parameters
      let params = new BufferParameters();
      let featureSelected = evt.geometry;
      params.distances = [10.0];
      params.geometries = [evt.geometry];
      params.outSpatialReference = selfPesquisa.map.spatialReference;
      params.unit = GeometryService.UNIT_METER;
      params.outFields = ['OBJECTID'];
      gsv.buffer(params, showBuffer);

      function showBuffer(bufferedGeometries) {
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

        array.forEach(bufferedGeometries, function(circleGeometry) {
          selfPesquisa.circleGeometry = circleGeometry;
          let circleSymb = new SimpleFillSymbol(
            SimpleFillSymbol.STYLE_NULL,
            new SimpleLineSymbol(
              SimpleLineSymbol.STYLE_SHORTDASHDOTDOT,
              new Color([105, 105, 105]),
              2
            ), new Color([255, 255, 0, 0.25])
          );
          let graphic = new Graphic(circleGeometry, circleSymb);
          selfPesquisa.map.setExtent(circleGeometry.getExtent(), true);
          // TODO fazer destacar pesquisas dentro do círculo
          // selfPesquisa.drawPesquisa(circleGeometry, unidadeSelected);

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
            for (let i = 0; i < features.length; i++) {
              feature = features[i];
              if (circleGeometry.contains(feature.geometry) && (featureSelected.x !== feature.geometry.x && featureSelected.y !== feature.geometry.y)) {
                inBuffer.push(feature);
              }
              // inBuffer.push(feature.attributes[featureLayer.objectIdField]);
            }

            response.features = inBuffer;
            if (inBuffer.length > 0) {
              selfPesquisa.fillFiltroTable(response);
              selectEditFeature(0, 'trEdit-' + 0);
              if (window.filtroPesq.editFeaturePesquisa) {
                buttonActionEditar();
              }
            } else {
              DocumentUtil.showMessage('warning', 'Não foi possível selecionar nenhuma pesquisa na área clicada!', true, null, 'generateBufferError');
              DocumentUtil.showSpinner(false);
            }

            // selfPesquisa.drawSimilar(inBuffer, featureSelected, unidadeSelected);
            let query = new Query();
            query.objectIds = inBuffer;
          }
          selfPesquisa.map.graphics.add(graphic);
        });
      }
      bufferToolbar.deactivate();
      // map.showZoomSlider();

      DocumentUtil.showMessage('info', 'Clique no mapa para adicionar um ponto', false, null, 'pointBufferMessage');
    },
    activateTool: function() {
      let tool = 'POINT';

      DocumentUtil.showMessage('info', 'Clique no mapa para adicionar um ponto', true, null, 'pointCadastroMessage');
      toolbar.activate(Draw[tool]);
      // map.hideZoomSlider();
    },
    addParametroPesquisa: function() {
      let tipoImovel;
      let tipologia;
      let padrao;
      let idade;
      let areaUtil;
      let conservacao;
      let quarto;
      let fontePesquisa;
      let banheiro;
      let garagem;
      let pavimento;
      let tipoPavimento;
      let valorMercado;
      let tipoLote;
      let areaTerreno;
      let observacao;

      let operador = 'Igual';
      if (document.getElementById('operadorPesquisaIgual').checked === true) {
        operador = 'Igual';
      } else if (document.getElementById('operadorPesquisaDiferente').checked === true) {
        operador = 'Diferente';
      } else if (document.getElementById('operadorPesquisaMenorque').checked === true) {
        operador = 'Menor que';
      } else if (document.getElementById('operadorPesquisaMaiorque').checked === true) {
        operador = 'Maior que';
      }

      let elem = document.getElementById('criterioInput');
      elem = elem.options[elem.selectedIndex];

      let baseObject = {
        label: elem.value,
        operador: operador
      };
      if (elem.value === 'Tipo do Ímovel') {
        var e = document.getElementById('tipoImovelInput');
        tipoImovel = e.options[e.selectedIndex].value;
        if (tipoImovel) {
          baseObject.value = tipoImovel;
          baseObject.name = 'de_tipo_do_imovel';
        }
      } else if (elem.value === 'Tipologia') {
        e = document.getElementById('tipologiaInput');
        tipologia = e.options[e.selectedIndex].value;
        if (tipologia) {
          baseObject.value = tipologia;
          baseObject.name = 'de_tipologia';
        }
      } else if (elem.value === 'Padrão') {
        e = document.getElementById('padraoInput');
        padrao = e.options[e.selectedIndex].value;
        if (padrao) {
          baseObject.value = padrao;
          baseObject.name = 'de_padrao';
        }
      } else if (elem.value === 'Idade') {
        e = document.getElementById('idadeInput');
        idade = e.value;
        if (idade) {
          baseObject.value = idade;
          baseObject.name = 'nu_idade';
        }
      } else if (elem.value === 'Área Útil') {
        e = document.getElementById('areaUtilInput');
        areaUtil = e.value;
        if (areaUtil) {
          baseObject.value = areaUtil;
          baseObject.name = 'nu_area_construida';
        }
      } else if (elem.value === 'Conservação') {
        e = document.getElementById('conservacaoInput');
        conservacao = e.options[e.selectedIndex].value;
        if (conservacao) {
          baseObject.value = conservacao;
          baseObject.name = 'de_conservacao';
        }
      } else if (elem.value === 'Quartos') {
        e = document.getElementById('quartoInput');
        quarto = e.value;
        if (quarto) {
          baseObject.value = quarto;
          baseObject.name = 'nu_quartos';
        }
      } else if (elem.value === 'Fonte da Pesquisa') {
        e = document.getElementById('fontePesquisaInput');
        fontePesquisa = e.options[e.selectedIndex].value;
        if (fontePesquisa) {
          baseObject.value = fontePesquisa;
          baseObject.name = 'de_fonte_pesquisa';
        }
      } else if (elem.value === 'Banheiros') {
        e = document.getElementById('banheiroInput');
        banheiro = e.value;
        if (banheiro) {
          baseObject.value = banheiro;
          baseObject.name = 'nu_banheiros';
        }
      } else if (elem.value === 'Garagem') {
        e = document.getElementById('garagemInput');
        garagem = e.value;
        if (garagem) {
          baseObject.value = garagem;
          baseObject.name = 'nu_garagens';
        }
      } else if (elem.value === 'Pavimento') {
        e = document.getElementById('pavimentoInput');
        pavimento = e.value;
        if (pavimento) {
          baseObject.value = pavimento;
          baseObject.name = 'nu_qtd_pavimetos';
        }
      } else if (elem.value === 'Tipo do Pavimento') {
        e = document.getElementById('tipoPavimentoInput');
        tipoPavimento = e.options[e.selectedIndex].value;
        if (tipoPavimento) {
          baseObject.value = tipoPavimento;
          baseObject.name = 'de_Tipo_Pavimento';
        }
      } else if (elem.value === 'Valor de Mercado') {
        e = document.getElementById('valorMercadoInput');
        valorMercado = e.value;
        if (valorMercado) {
          baseObject.value = valorMercado;
          baseObject.name = 'nu_valor_mercado';
        }
      } else if (elem.value === 'Tipo do Lote') {
        e = document.getElementById('tipoLoteInput');
        tipoLote = e.options[e.selectedIndex].value;
        if (tipoLote) {
          baseObject.value = tipoLote;
          baseObject.name = 'de_tipologia';
        }
      } else if (elem.value === 'Área do Terreno Cadastro') {
        e = document.getElementById('areaTerrenoCadastroInput');
        areaTerreno = e.value;
        baseObject.value = areaTerreno;
        baseObject.name = 'nu_area_terreno';
      } else if (elem.value === 'Área do Terreno Site') {
        e = document.getElementById('areaTerrenoInput');
        areaTerreno = e.value;

        baseObject.value = areaTerreno;
        baseObject.name = 'nu_area_terreno';
      } else if (elem.value === 'Observação') {
        e = document.getElementById('observacaoInput');
        observacao = e.value;
        if (observacao) {
          baseObject.value = observacao;
          baseObject.name = 'de_imobiliaria';
        }
      }

      selfPesquisa.parametrosPesquisa.push(baseObject);
      selfPesquisa.resetPesquisaParametroOperador();

      selfPesquisa.updatePesquisaParametroTable();
    },
    resetPesquisaParametroOperador: function() {
      document.getElementById('operadorPesquisaIgualLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm active btn-equals');
      document.getElementById('operadorPesquisaDiferenteLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals');
      document.getElementById('operadorPesquisaMenorqueLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals btn-equals-2nd');
      document.getElementById('operadorPesquisaMaiorqueLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals btn-equals-2nd');
      document.getElementById('operadorPesquisaIgual').checked = true;

      // document.getElementById("operadorPesquisaDiferente").checked = false;
      // document.getElementById("operadorPesquisaMenorque").checked = false;
      // document.getElementById("operadorPesquisaMaiorque").checked = false;
    },
    updatePesquisaParametroTable: function() {
      let tableDiv = document.getElementById('parametroPesquisaTable');

      // var thead = document.createElement('thead');
      // tableDiv.appendChild(thead);

      let tbody = tableDiv.getElementsByTagName('tbody')[0];
      // tableDiv.appendChild(tbody);
      while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
      }

      // var trTitles = document.createElement("tr");
      // thead.appendChild(trTitles);

      // var thCondicaoTitles = document.createElement("th");
      // thCondicaoTitles.setAttribute("class", "th-condicao");

      // var thOperadorTitles = document.createElement("th");
      // thOperadorTitles.setAttribute("class", "th-condicao");

      // var thValorTitles = document.createElement("th");
      // thValorTitles.setAttribute("class", "th-condicao");
      // var textCondicaoTitles = document.createTextNode('Coluna');

      // var textOperadorTitles = document.createTextNode('Operador');

      // var textValorTitles = document.createTextNode('Valor');

      // thCondicaoTitles.appendChild(textCondicaoTitles);
      // thOperadorTitles.appendChild(textOperadorTitles);
      // thValorTitles.appendChild(textValorTitles);
      // trTitles.appendChild(thCondicaoTitles);
      // trTitles.appendChild(thOperadorTitles);
      // trTitles.appendChild(thValorTitles);
      // <tr>
      //  <th class="th-condicao">Condição</th>
      //  <th class="th-condicao">Valor</th>
      //  <th></th>
      // </tr>

      if (selfPesquisa.parametrosPesquisa.length > 0) {
        showbtnAplicarPesquisas(true);
      } else {
        showbtnAplicarPesquisas(false);
      }
      for (let i = 0; i < selfPesquisa.parametrosPesquisa.length; i++) {
        let trRow = document.createElement('tr');
        tbody.appendChild(trRow);

        let tdLabel = document.createElement('td');
        trRow.appendChild(tdLabel);
        let textLabel = document.createTextNode(selfPesquisa.parametrosPesquisa[i].label);
        tdLabel.appendChild(textLabel);

        let tdOperador = document.createElement('td');
        trRow.appendChild(tdOperador);
        let textOperador = document.createTextNode(selfPesquisa.parametrosPesquisa[i].operador);
        tdOperador.appendChild(textOperador);

        let tdValue = document.createElement('td');
        tdValue.setAttribute('class', 'active');
        trRow.appendChild(tdValue);
        let textValue = document.createTextNode(selfPesquisa.parametrosPesquisa[i].value);
        tdValue.appendChild(textValue);

        let tdRemove = document.createElement('td');
        tdRemove.setAttribute('align', 'center');
        tdRemove.setAttribute('width', '10px');
        tdRemove.setAttribute('onclick', 'delParametroPesquisa("' + i + '")');
        trRow.appendChild(tdRemove);
        let spanRemove = document.createElement('span');
        spanRemove.setAttribute('class', 'glyphicon glyphicon-trash');
        tdRemove.appendChild(spanRemove);
        // var textValue = document.createTextNode(selfPesquisa.parametrosPesquisa[variable].value);
        // tdValue.appendChild(textValue);
      }

      $.extend(true, $.fn.dataTable.defaults, {
        'searching': false,
        'ordering': false,
        'lengthMenu': false,
        'info': false,
        'paging': false,
        'scrollY': '87px',
        'scrollX': false,
        'scrollCollapse': true
      });

      $(document).ready(function() {
        $('#parametroPesquisaTable').DataTable();
      });
    },
    searchPesquisa: function(dataInicio, dataFim, parametrosPesquisa, callback) {
      let serviceUrlFiltro = 'http://www.senocwb.com/senoportal/rest/services/SJR_ITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0';
      let query = new Query();
      let queryTask = new QueryTask(serviceUrlFiltro);
      query.returnGeometry = true;
      query.outFields = ['*'];
      query.outSpatialReference = {
        wkid: 3857
      };
      if (dataInicio) {
        dataInicio = moment(dataInicio, 'DD-MM-YYYY').format('MM-DD-YYYY');
      }

      if (dataFim) {
        dataFim = moment(dataFim, 'DD-MM-YYYY').format('MM-DD-YYYY');
      }
      query.where = '';
      if (dataInicio && dataFim) {
        query.where += 'dt_data_cadastro' + ' BETWEEN ' + "'" + dataInicio + "'" + 'AND' + "'" + dataFim + "'";
      }
      for (let i = 0; i < parametrosPesquisa.length; i++) {
        if (query.where) {
          query.where += ' AND ';
        }
        var operador;

        if (parametrosPesquisa[i].operador === 'Igual') {
          operador = '=';
        } else if (parametrosPesquisa[i].operador === 'Diferente') {
          operador = '<>';
        } else if (parametrosPesquisa[i].operador === 'Maior que') {
          operador = '>';
        } else if (parametrosPesquisa[i].operador === 'Menor que') {
          operador = '<';
        } else if (parametrosPesquisa[i].operador === 'Maior Igual') {
          operador = '<=';
        } else if (parametrosPesquisa[i].operador === 'Menor Igual') {
          operador = '>=';
        }
        query.where += parametrosPesquisa[i].name + ' ' + operador + " '" + parametrosPesquisa[i].value + "'";
      }

      if (query.where) {
        queryTask.execute(query, showResults);
      }
      function showResults(result) {
        callback(result);
      }
    },
    selectFeaturePesquisaSymbol: function (feature){
          let symbol = new SimpleMarkerSymbol(
                      SimpleMarkerSymbol.STYLE_CIRCLE,
                      12,
                      new SimpleLineSymbol(
                        SimpleLineSymbol.STYLE_SOLID,
                        new Color([6, 85, 153, 0.9]),
                        1
                      ),
                      new Color([255, 0, 0, 0.6])
                    );
                    let graphic = new Graphic(feature.geometry, symbol);
                    graphic.setSymbol(symbol);
                    selfPesquisa.map.graphics.add(graphic);
          return feature;
    }

  });
});

function showZoomPratodosPesquisa(willShow) {
  let zoomParaTodosPesq = document.getElementById('zoomParaTodosPesq');
  if (willShow) {
    zoomParaTodosPesq.disabled = false;
  } else {
    zoomParaTodosPesq.disabled = true;
  }
}

function showbtnExportPesquisas(willShow) {
  let btnExportPesquisas = document.getElementById('btnExportPesquisas');
  if (willShow) {
    btnExportPesquisas.disabled = false;
  } else {
    btnExportPesquisas.disabled = true;
  }
}

function showbtnAplicarPesquisas(willShow) {
  let btnAplicarPesquisas = document.getElementById('btnAplicarPesquisas');
  if (willShow) {
    btnAplicarPesquisas.disabled = false;
  } else {
    btnAplicarPesquisas.disabled = true;
  }
}

function btnlimparFiltroPesquisa(willShow) {
  let btnlimparFiltroPesquisa = document.getElementById('btnlimparFiltroPesquisa');
  if (willShow) {
    btnlimparFiltroPesquisa.disabled = false;
  } else {
    btnlimparFiltroPesquisa.disabled = true;
  }
}

window.delParametroPesquisa = function(index) {
  // delete selfPesquisa.parametrosPesquisa[variable];
  if (index > -1) {
    selfPesquisa.parametrosPesquisa.splice(index, 1);
  }
  selfPesquisa.updatePesquisaParametroTable();
};

window.delAllParametroPesquisa = function() {
  selfPesquisa.parametrosPesquisa = [];
  selfPesquisa.updatePesquisaParametroTable();
  showZoomPratodosPesquisa(false);
  showbtnExportPesquisas(false);
  btnlimparFiltroPesquisa(false);
};

// if (isEditable) {
//     trConteudo.setAttribute("onclick", "selectEditFeature(" + i + ")");
// } else {
//     trConteudo.setAttribute("onclick", "selectFeaturePesquisa(" + i + ")");
// }

function selectEditFeature(index, divId) {
  let feature = selectFeaturePesquisa(index, divId, selfPesquisa.edicaoCadastro.features);

  window.filtroPesq = {
    editFeaturePesquisa: feature,
    map: selfPesquisa.map
  };
  let editarButton = document.getElementById('editarButton');
  editarButton.disabled = false;
}

function buttonActionEditar() {
  updateEditHtml();
  let element = document.getElementById('myWidgetDialogEditar');
  if (element.hasAttribute('open')) {
    element.removeAttribute('open');
  } else {
    element.setAttribute('open', 'false');
  }
}

function selectFeaturePesquisa(index, divId, features) {
  if (!features) {
    features = selfPesquisa.mostragemPesquisa.features;
  }
  if (selfPesquisa.selectRowDiv) {
    selfPesquisa.selectRowDiv.removeAttribute('class');
  }
  let rowDiv = document.getElementById(divId);
  rowDiv.setAttribute('class', 'info');
  selfPesquisa.selectRowDiv = rowDiv;
  let feature = features[index];

  selfPesquisa.selectFeaturePesquisaSymbol(feature);

  selfPesquisa.map.centerAndZoom(feature.geometry, 15);
  return feature;
}

window.showDiv = function(elem) {
  if (elem.value === 'Tipo do Ímovel') {
    document.getElementById('tipoImovelDiv').style.display = 'block';
  } else {
    document.getElementById('tipoImovelDiv').style.display = 'none';
  }
  if (elem.value === 'Tipologia') {
    document.getElementById('tipologiaDiv').style.display = 'block';
  } else {
    document.getElementById('tipologiaDiv').style.display = 'none';
  }
  if (elem.value === 'Padrão') {
    document.getElementById('padraoDiv').style.display = 'block';
  } else {
    document.getElementById('padraoDiv').style.display = 'none';
  }
  if (elem.value === 'Idade') {
    document.getElementById('idadeDiv').style.display = 'block';
  } else {
    document.getElementById('idadeDiv').style.display = 'none';
  }
  if (elem.value === 'Área Útil') {
    document.getElementById('areaUtilDiv').style.display = 'block';
  } else {
    document.getElementById('areaUtilDiv').style.display = 'none';
  }
  if (elem.value === 'Conservação') {
    document.getElementById('conservacaoDiv').style.display = 'block';
  } else {
    document.getElementById('conservacaoDiv').style.display = 'none';
  }
  if (elem.value === 'Quartos') {
    document.getElementById('quartoDiv').style.display = 'block';
  } else {
    document.getElementById('quartoDiv').style.display = 'none';
  }
  if (elem.value === 'Fonte da Pesquisa') {
    document.getElementById('fontePesquisaDiv').style.display = 'block';
  } else {
    document.getElementById('fontePesquisaDiv').style.display = 'none';
  }
  if (elem.value === 'Banheiros') {
    document.getElementById('banheiroDiv').style.display = 'block';
  } else {
    document.getElementById('banheiroDiv').style.display = 'none';
  }
  if (elem.value === 'Garagem') {
    document.getElementById('garagemDiv').style.display = 'block';
  } else {
    document.getElementById('garagemDiv').style.display = 'none';
  }
  if (elem.value === 'Pavimento') {
    document.getElementById('pavimentoDiv').style.display = 'block';
  } else {
    document.getElementById('pavimentoDiv').style.display = 'none';
  }
  if (elem.value === 'Tipo do Pavimento') {
    document.getElementById('tipoPavimentoDiv').style.display = 'block';
  } else {
    document.getElementById('tipoPavimentoDiv').style.display = 'none';
  }
  if (elem.value === 'Valor de Mercado') {
    document.getElementById('valorMercadoDiv').style.display = 'block';
  } else {
    document.getElementById('valorMercadoDiv').style.display = 'none';
  }
  if (elem.value === 'Tipo do Lote') {
    document.getElementById('tipoLoteDiv').style.display = 'block';
  } else {
    document.getElementById('tipoLoteDiv').style.display = 'none';
  }
  if (elem.value === 'Área do Terreno Cadastro') {
    document.getElementById('areaTerrenoCadastroDiv').style.display = 'block';
  } else {
    document.getElementById('areaTerrenoCadastroDiv').style.display = 'none';
  }
  if (elem.value === 'Área do Terreno Site') {
    document.getElementById('areaTerrenoSiteDiv').style.display = 'block';
  } else {
    document.getElementById('areaTerrenoSiteoDiv').style.display = 'none';
  }
  if (elem.value === 'Observação') {
    document.getElementById('observacaoDiv').style.display = 'block';
  } else {
    document.getElementById('observacaoDiv').style.display = 'none';
  }
};
