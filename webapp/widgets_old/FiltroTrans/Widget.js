/* global define moment $:true */
let that;
let DocumentUtil;
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
  // var that;
  return declare([BaseWidget], {
    // Custom widget code goes here
    templateString: template,
    baseClass: 'jimu-widget-FiltroPesq',
    postCreate: function() {
      that = this;
      // window.esriMap = this.map;
      that.parametrosTransmissao = [];

      let mainDiv = document.getElementById('main-page');
      let dialogDiv = document.createElement('dialog');
      dialogDiv.id = 'myWidgetDialogCadastrar';
      mainDiv.appendChild(dialogDiv);
      dialogDiv.setAttribute('class', 'jimu-widget-tecgeo');
      // editar
      let mainDivEditar = document.getElementById('main-page');
      let dialogDivEditar = document.createElement('dialog');
      dialogDivEditar.id = 'myWidgetDialogEditar';
      mainDivEditar.appendChild(dialogDivEditar);
      dialogDivEditar.setAttribute('class', 'jimu-widget-tecgeo');
    },
    startup: function() {
      document.getElementById('filtroTransmissaoInputDe').value = moment().startOf('week').format('DD-MM-YYYY');
      document.getElementById('filtroTransmissaoInputAte').value = moment().endOf('week').format('DD-MM-YYYY');
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
      $(document).ready(function() {
        $('#filtroTransmissaoInputDe').mask('00-00-0000');
        $('#filtroTransmissaoInputAte').mask('00-00-0000');
      });
    },
    filtroTransmissao: function() {
      DocumentUtil.showSpinner(true);
      DocumentUtil.showMessage('info', 'Iniciando Pesquisa', true, 3000, null);
      let filtroInputDe = document.getElementById('filtroTransmissaoInputDe').value;
      let filtroInputAte = document.getElementById('filtroTransmissaoInputAte').value;
      if (filtroInputDe) {
        filtroInputDe = moment(filtroInputDe, 'DD-MM-YYYY').format('MM-DD-YYYY');
      }

      if (filtroInputAte) {
        filtroInputAte = moment(filtroInputAte, 'DD-MM-YYYY').format('MM-DD-YYYY');
      }

      that.searchTransmissao(filtroInputDe, filtroInputAte, that.parametrosTransmissao, function(result) {
        for (let i = that.map.graphics.graphics.length - 1; i >= 0; i--) {
          let geometry = that.map.graphics.graphics[i].geometry;
          if (geometry.type === 'polygon') {
            that.map.graphics.remove(that.map.graphics.graphics[i]);
          }
        }

        if (result.length > 0) {
          let geocodeLotes = [];
          for (let i = 0; i < result.length; i++) {
            geocodeLotes.push(result[i]['de_GEOCODE_LOTE']);
          }
          console.info(geocodeLotes);
          that.searchLoteTransmissao(geocodeLotes, function(resultLote) {
            let featuresLote = resultLote.features;
            let defaultSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255]), 3), new Color([0, 255, 255, 0.6]));
            let selectSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 0, 0, 0.6]), 3), new Color([0, 255, 255, 0.6]));
            that.defaultSymbol = defaultSymbol;
            that.selectSymbol = selectSymbol;
            for (let i = 0; i < featuresLote.length; i++) {
              // var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color([0, 255, 255]), 3), new Color([0, 255, 255, 0.6]));
              let graphic = new Graphic(featuresLote[i].geometry, defaultSymbol);
              graphic.setSymbol(defaultSymbol);
              that.map.graphics.add(graphic);
            }

            showZoomPratodosTransmissao(true);
            showbtnExportTransmissao(true);
          });

          let tableFiltroTransmissao = document.getElementById('table-filtro-Transmissao');
          that.fillTransmissaoTable(tableFiltroTransmissao, result);

          let qtTransmissao = result.length;

          document.getElementById('labelQtTransmissao').innerHTML = qtTransmissao + ' ocorrência(s)';
        } else {
          DocumentUtil.showSpinner(false);
          DocumentUtil.showMessage('info', 'Não foram encontrados resultados!', true, null, 'transmissaoResultado');
        }

        DocumentUtil.showMessage('info', 'Pesquisa Finalizada', true, 3000, null);
        DocumentUtil.showSpinner(false);
      });
    },
    zoomParaTodos: function() {
      let geometryList = [];
      for (let variable in that.featuresByGeocode) {
        if (that.featuresByGeocode.hasOwnProperty(variable)) {
          geometryList.push(that.featuresByGeocode[variable].geometry);
        }
      }

      let unionGeometry = geometryEngine.union(geometryList);
      if (unionGeometry) {
        let extent = unionGeometry.getExtent();
        that.map.setExtent(extent, true);
      }
    },
    fillTransmissaoTable: function(tableFiltroTransmissao, result) {
      while (tableFiltroTransmissao.hasChildNodes()) {
        tableFiltroTransmissao.removeChild(tableFiltroTransmissao.firstChild);
      }

      //TO DEMONSTRATION
      for (let i = result.length - 1; i >= 0; i--) {
        if (result[i].de_TIPO_IMOVEL === null){
          result[i].de_TIPO_IMOVEL = $("#tipoImovelTransmissaoInput").val();
        }
      }


      let tablearea = tableFiltroTransmissao;
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
      // let th8 = document.createElement('th');
      // th8.setAttribute('class', 'th-condicao');
      let th9 = document.createElement('th');
      th9.setAttribute('class', 'th-condicao');
      let th10 = document.createElement('th');
      th10.setAttribute('class', 'th-condicao');
      let th11 = document.createElement('th');
      th11.setAttribute('class', 'th-condicao');

      trTh.appendChild(th1);
      trTh.appendChild(th2);
      trTh.appendChild(th3);
      trTh.appendChild(th4);
      trTh.appendChild(th5);
      trTh.appendChild(th6);
      trTh.appendChild(th7);
      //trTh.appendChild(th8);
      trTh.appendChild(th9);
      trTh.appendChild(th10);
      trTh.appendChild(th11);

      trTh.cells[0].appendChild(document.createTextNode('Geocódigo STM'));
      trTh.cells[1].appendChild(document.createTextNode('ID da Transmissão'));
      trTh.cells[2].appendChild(document.createTextNode('Tipo do Imóvel'));
      trTh.cells[3].appendChild(document.createTextNode('Tipologia'));
      trTh.cells[4].appendChild(document.createTextNode('Padrão'));
      trTh.cells[5].appendChild(document.createTextNode('Idade'));
      trTh.cells[6].appendChild(document.createTextNode('Área Construída'));
      trTh.cells[7].appendChild(document.createTextNode('Conservação'));
      //trTh.cells[8].appendChild(document.createTextNode('Garagem'));
      trTh.cells[8].appendChild(document.createTextNode('Número de Pavimentos'));
      trTh.cells[9].appendChild(document.createTextNode('Data da Solicitação'));

      theadtable.appendChild(trTh);
      // fim do cabeçalho
      for (let i = 0; i < result.length; i++) {
        // conteudo da tabela
        let trConteudo = document.createElement('tr');
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        //trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));
        trConteudo.appendChild(document.createElement('td'));

        trConteudo.setAttribute('id', 'trTransmissao-' + i);
        trConteudo.setAttribute('onclick', "selectFeatureTrans('" + result[i]['de_GEOCODE_LOTE'] + "','trTransmissao-" + i + "')");

        trConteudo.cells[0].appendChild(document.createTextNode(result[i]['de_GEOCODE_LOTE']));
        trConteudo.cells[1].appendChild(document.createTextNode(result[i]['nu_idtransmissao']));
        trConteudo.cells[2].appendChild(document.createTextNode(result[i]['de_TIPO_IMOVEL']));
        trConteudo.cells[3].appendChild(document.createTextNode(result[i]['de_TIPOLOGIA']));
        trConteudo.cells[4].appendChild(document.createTextNode(result[i]['de_PADRAO_CONSTRUCAO']));
        trConteudo.cells[5].appendChild(document.createTextNode(result[i]['de_IDADE']));
        trConteudo.cells[6].appendChild(document.createTextNode(result[i]['nu_AREA_CONSTRUIDA']));
        trConteudo.cells[7].appendChild(document.createTextNode(result[i]['de_CONSERVACAO']));
        //trConteudo.cells[8].appendChild(document.createTextNode(result[i]['VAGAS_GARAG']));
        trConteudo.cells[8].appendChild(document.createTextNode(result[i]['de_PAVIMENTOS']));
        trConteudo.cells[9].appendChild(document.createTextNode(moment(result[i]['dt_solicitacao']).format('DD/MM/YYYY')));

        table.appendChild(trConteudo);
      }

      tablearea.appendChild(table);
      // fim do conteudo da tabela

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
        $('#table-filtro-Transmissao').DataTable();
      });
    },
    limparFiltroTransmissao: function() {
      for (let i = that.map.graphics.graphics.length - 1; i >= 0; i--) {
        let geometry = that.map.graphics.graphics[i].geometry;
        if (geometry.type === 'polygon') {
          that.map.graphics.remove(that.map.graphics.graphics[i]);
        }
      }
      let tableFiltroTransmissao = document.getElementById('table-filtro-Transmissao');
      document.getElementById('labelQtTransmissao').innerHTML = '';

      while (tableFiltroTransmissao.hasChildNodes()) {
        tableFiltroTransmissao.removeChild(tableFiltroTransmissao.firstChild);
      }
    },

    exportarTransmissao: function() {
      $(document).ready(function() {
        $('#btnExport').click(function(e) {
          e.preventDefault();

          // getting data from our table
          let dataType = 'data:application/vnd.ms-excel';
          let tableDiv = document.getElementById('table_wrapper');
          let tableHtml = escape(tableDiv.outerHTML);

          let a = document.createElement('a');
          a.href = dataType + ', ' + tableHtml;
          a.download = 'transmissao_GEOITBI_results' + Math.floor((Math.random() * 9999999) + 1000000) + '.xls';
          a.click();
        });
      });
    },
    addParametroTransmissao: function() {
      let geocodeStm;
      let idTransmissao;
      let tipoImovel;
      let tipologia;
      let padrao;
      let idade;
      let areaConstruida;
      let conservacao;
      //let garagem;
      let pavimento;

      let operador = 'Igual';
      if (document.getElementById('operadorTransmissaoIgual').checked === true) {
        operador = 'Igual';
      } else if (document.getElementById('operadorTransmissaoDiferente').checked === true) {
        operador = 'Diferente';
      } else if (document.getElementById('operadorTransmissaoMenorque').checked === true) {
        operador = 'Menor que';
      } else if (document.getElementById('operadorTransmissaoMaiorque').checked === true) {
        operador = 'Maior que';
      }

      let elem = document.getElementById('criterioInputTransmissao');
      elem = elem.options[elem.selectedIndex];

      let baseObject = {
        label: elem.value,
        operador: operador
      };

      if (elem.value === 'Geocódigo da Unidade - STM') {
        var e = document.getElementById('geocodigoSTMTransmissaoInput');
        geocodeStm = e.value;
      } else if (elem.value === 'ID da Transmissao') {
        e = document.getElementById('idTransmissaoInput');
        idTransmissao = e.value;
      } else if (elem.value === 'Tipo do Ímovel') {
        e = document.getElementById('tipoImovelTransmissaoInput');
        tipoImovel = e.options[e.selectedIndex].value;
      } else if (elem.value === 'Tipologia') {
        e = document.getElementById('tipologiaTransmissaoInput');
        tipologia = e.options[e.selectedIndex].value;
      } else if (elem.value === 'Padrão') {
        e = document.getElementById('padraoTransmissaoInput');
        padrao = e.options[e.selectedIndex].value;
      } else if (elem.value === 'Idade') {
        e = document.getElementById('idadeTransmissaoInput');
        idade = e.value;
      } else if (elem.value === 'Área Construída') {
        e = document.getElementById('areaUtilTransmissaoInput');
        areaConstruida = e.value;
      } else if (elem.value === 'Conservação') {
        e = document.getElementById('conservacaoTransmissaoInput');
        conservacao = e.options[e.selectedIndex].value;
      } 
      //else if (elem.value === 'Garagem') {
      //  e = document.getElementById('garagemTransmissaoInput');
      //  garagem = e.value;
      //} 
      else if (elem.value === 'Pavimento') {
        e = document.getElementById('pavimentoTransmissaoInput');
        pavimento = e.value;
      }

      if (geocodeStm) {
        baseObject.value = geocodeStm;
        baseObject.name = 'DE_GEOCODE_STM';
      }
      if (idTransmissao) {
        baseObject.value = idTransmissao;
        baseObject.name = 'nu_idtransmissao';
      }
      if (tipoImovel) {
        baseObject.value = tipoImovel;
        baseObject.name = 'de_TIPO_IMOVEL';
      }
      if (tipologia) {
        baseObject.value = tipologia;
        baseObject.name = 'de_TIPOLOGIA';
      }
      if (padrao) {
        baseObject.value = padrao;
        baseObject.name = 'de_PADRAO_CONSTRUCAO';
      }
      if (idade) {
        baseObject.value = idade;
        baseObject.name = 'de_IDADE';
      }

      if (areaConstruida) {
        baseObject.value = areaConstruida;
        baseObject.name = 'nu_AREA_CONSTRUIDA';
      }
      if (conservacao) {
        baseObject.value = conservacao;
        baseObject.name = 'de_CONSERVACAO';
      }
      // if (garagem) {
      //   baseObject.value = garagem;
      //   baseObject.name = 'VAGAS_GARAG';
      // }
      if (pavimento) {
        baseObject.value = pavimento;
        baseObject.name = 'de_PAVIMENTOS';
      }
      that.parametrosTransmissao.push(baseObject);

      that.resetTransmissaoParametroOperador();
      that.updateTransmissaoParametroTable();
    },
    resetTransmissaoParametroOperador: function() {
      document.getElementById('operadorTransmissaoIgualLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm active btn-equals');
      document.getElementById('operadorTransmissaoDiferenteLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals');
      document.getElementById('operadorTransmissaoMenorqueLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals btn-equals-2nd');
      document.getElementById('operadorTransmissaoMaiorqueLabel').setAttribute('class', 'btn btn-default btn-default-cond btn-sm btn-equals btn-equals-2nd');
      document.getElementById('operadorTransmissaoIgual').checked = true;

      // document.getElementById("operadorPesquisaDiferente").checked = false;
      // document.getElementById("operadorPesquisaMenorque").checked = false;
      // document.getElementById("operadorPesquisaMaiorque").checked = false;
    },
    updateTransmissaoParametroTable: function() {
      let tableDiv = document.getElementById('parametroTransmissaoTable');

      let tbody = tableDiv.getElementsByTagName('tbody')[0];
      // tableDiv.appendChild(tbody);

      while (tbody.hasChildNodes()) {
        tbody.removeChild(tbody.firstChild);
      }

      // var trTitles = document.createElement("tr");
      // tbody.appendChild(trTitles);

      // var thCondicaoTitles = document.createElement("th");
      // thCondicaoTitles.setAttribute("class", "th-condicao");
      // var thValorTitles = document.createElement("th");
      // thValorTitles.setAttribute("class", "th-condicao");
      // var thOperadorTitles = document.createElement("th");
      // thOperadorTitles.setAttribute("class", "th-condicao");
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
      if (that.parametrosTransmissao.length > 0) {
        showbtnAplicarTransmissao(true);
        showbtnlimparFiltroTransmissao(true);
      } else {
        showbtnAplicarTransmissao(false);
      }
      for (let i = 0; i < that.parametrosTransmissao.length; i++) {
        let trRow = document.createElement('tr');
        tbody.appendChild(trRow);

        let tdLabel = document.createElement('td');
        trRow.appendChild(tdLabel);
        let textLabel = document.createTextNode(that.parametrosTransmissao[i].label);
        tdLabel.appendChild(textLabel);

        let tdOperador = document.createElement('td');
        trRow.appendChild(tdOperador);
        let textOperador = document.createTextNode(that.parametrosTransmissao[i].operador);
        tdOperador.appendChild(textOperador);

        let tdValue = document.createElement('td');
        tdValue.setAttribute('class', 'active');
        trRow.appendChild(tdValue);
        let textValue = document.createTextNode(that.parametrosTransmissao[i].value);
        tdValue.appendChild(textValue);

        let tdRemove = document.createElement('td');
        tdRemove.setAttribute('align', 'center');
        tdRemove.setAttribute('width', '10px');
        tdRemove.setAttribute('onclick', 'delParametroTransmissao("' + i + '")');
        trRow.appendChild(tdRemove);
        let spanRemove = document.createElement('span');
        spanRemove.setAttribute('class', 'glyphicon glyphicon-trash');
        tdRemove.appendChild(spanRemove);
        // var textValue = document.createTextNode(that.parametrosTransmissao[variable].value);
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
        $('#parametroTransmissaoTable').DataTable();
      });
    },
    searchTransmissao: function(dataInicio, dataFim, parametrosTransmissao, callback) {
      let transmissaoColumns = ['dt_solicitacao', 'nu_idtransmissao', 'de_naturezatransmissao'];
      let unidadeColumns = ['DE_GEOCODE_LOTE', 'DE_GEOCODE_STM', 'DE_TIPO_IMOVEL', 'DE_TIPOLOGIA', 'de_PADRAO_CONSTRUCAO', 'DE_IDADE', 'NU_AREA_CONSTRUIDA', 'DE_CONSERVACAO', 'DE_PAVIMENTOS'];
      let whereTransmissao = [];
      let whereUnidade = [];
      if (dataInicio && dataFim) {
        whereTransmissao.push({
          column: 'dt_solicitacao',
          operator: 'BETWEEN',
          value: "'" + dataInicio + "'" + 'AND' + "'" + dataFim + "'"
        });
      }

      for (let i = 0; i < parametrosTransmissao.length; i++) {
        var operador;
        if (parametrosTransmissao[i].operador === 'Igual') {
          operador = '=';
        } else if (parametrosTransmissao[i].operador === 'Diferente') {
          operador = '<>';
        } else if (parametrosTransmissao[i].operador === 'Maior que') {
          operador = '>';
        } else if (parametrosTransmissao[i].operador === 'Menor que') {
          operador = '<';
        } else if (parametrosTransmissao[i].operador === 'Maior Igual') {
          operador = '<=';
        } else if (parametrosTransmissao[i].operador === 'Menor Igual') {
          operador = '>=';
        }
        if (parametrosTransmissao[i].name === 'nu_idtransmissao') {
          whereTransmissao.push({
            column: parametrosTransmissao[i].name,
            operator: operador,
            value: parametrosTransmissao[i].value
          });
        } else {
          whereUnidade.push({
            column: parametrosTransmissao[i].name,
            operator: operador,
            value: parametrosTransmissao[i].value
          });
        }
      }

      let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');

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
    },
    searchLoteTransmissao: function(geocodeLotes, callback) {
      that.searchPrioritarioLoteTransmissao(geocodeLotes, function(resultPrioritario) {
        let result = resultPrioritario;
        let geocodeObject = {};
        that.searchNaoPrioritarioLoteTransmissao(geocodeLotes, function(resultNaoPrioritario) {
          for (let i = 0; i < resultNaoPrioritario.features.length; i++) {
            result.features.push(resultNaoPrioritario.features[i]);
          }
          for (let j = 0; j < result.features.length; j++) {
            if (result.features[j].attributes['sjr_cadastro.SDE.Lote.INS_ANT']) {
              geocodeObject[result.features[j].attributes['sjr_cadastro.SDE.Lote.INS_ANT']] = result.features[j];
            } else if (result.features[j].attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE']) {
              geocodeObject[result.features[j].attributes['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE']] = result.features[j];
            }
          }
          console.info(geocodeObject);
          that.featuresByGeocode = geocodeObject;
          that.zoomParaTodos();
          callback(result);
        });
      });
    },
    searchPrioritarioLoteTransmissao: function(geocodeLotes, callback) {
      let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/14';
      let query = new Query();
      let queryTask = new QueryTask(serviceUrlFiltro);
      query.returnGeometry = true;
      query.outFields = ['sjr_cadastro.SDE.Lote.OBJECTID', 'sjr_cadastro.SDE.Lote.INS_ANT'];
      query.outSpatialReference = {
        wkid: 3857
      };
      query.where = 'sjr_cadastro.SDE.Lote.INS_ANT IN(';

      // query.where += "dt_solicitacao" + " BETWEEN " + "'" + dataInicio + "'" + "AND" + "'" + dataFim + "'";
      for (let i = 0; i < geocodeLotes.length; i++) {
        if (query.where && i !== 0) {
          query.where += ', ';
        }
        query.where += "'" + geocodeLotes[i] + "'";
      }
      query.where += ');';

      if (query.where) {
        queryTask.execute(query, showResults);
      }
      function showResults(result) {
        callback(result);
      }
    },
    searchNaoPrioritarioLoteTransmissao: function(geocodeLotes, callback) {
      let serviceUrlFiltro = 'https://sigribamar.com.br/server/rest/services/Webgis/SJR_infraestrutura_Geo/MapServer/15';
      let query = new Query();
      let queryTask = new QueryTask(serviceUrlFiltro);
      query.returnGeometry = true;
      query.outFields = ['sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.OBJECTID', 'sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE'];
      query.outSpatialReference = {
        wkid: 3857
      };
      query.where = 'sjr_cadastro.SDE.Lote_Nao_Prioritario_v04.GEOCODE IN(';

      // query.where += "dt_solicitacao" + " BETWEEN " + "'" + dataInicio + "'" + "AND" + "'" + dataFim + "'";
      for (let i = 0; i < geocodeLotes.length; i++) {
        if (query.where && i !== 0) {
          query.where += ', ';
        }
        query.where += "'" + geocodeLotes[i] + "'";
      }
      query.where += ');';

      if (query.where) {
        queryTask.execute(query, showResults);
      }
      function showResults(result) {
        callback(result);
      }
    }

  });
});

function showZoomPratodosTransmissao(willShow) {
  let zoomParaTodos = document.getElementById('zoomParaTodos');
  if (willShow) {
    zoomParaTodos.disabled = false;
  } else {
    zoomParaTodos.disabled = true;
  }
}

function showbtnExportTransmissao(willShow) {
  let btnExportTransmissao = document.getElementById('btnExport');
  if (willShow) {
    btnExportTransmissao.disabled = false;
  } else {
    btnExportTransmissao.disabled = true;
  }
}

function showbtnAplicarTransmissao(willShow) {
  let btnAplicarTransmissao = document.getElementById('btnAplicarTransmissao');
  if (willShow) {
    btnAplicarTransmissao.disabled = false;
  } else {
    btnAplicarTransmissao.disabled = true;
  }
}

function showbtnlimparFiltroTransmissao(willShow) {
  let btnlimparFiltroTransmissao = document.getElementById('btnlimparFiltroTransmissao');
  if (willShow) {
    btnlimparFiltroTransmissao.disabled = false;
  } else {
    btnlimparFiltroTransmissao.disabled = true;
  }
}

window.delParametroTransmissao = function(index) {
  // delete self.parametrosPesquisa[variable];
  if (index > -1) {
    that.parametrosTransmissao.splice(index, 1);
  }
  that.updateTransmissaoParametroTable();
};

window.delAllParametroTransmissao = function() {
  that.parametrosTransmissao = [];
  that.updateTransmissaoParametroTable();
  showZoomPratodosTransmissao(false);
  showbtnExportTransmissao(false);
  for (let i = that.map.graphics.graphics.length - 1; i >= 0; i--) {
    let geometry = that.map.graphics.graphics[i].geometry;
    if (geometry.type === 'polygon') {
      that.map.graphics.remove(that.map.graphics.graphics[i]);
    }
  }
};

window.selectFeatureTrans = function(geocode, divId, features) {
  if (that.selectRowDiv) {
    that.selectRowDiv.removeAttribute('class');
  }
  let rowDiv = document.getElementById(divId);
  rowDiv.setAttribute('class', 'info');
  that.selectRowDiv = rowDiv;
  console.info(that.featuresByGeocode);
  let feature = that.featuresByGeocode[geocode];
  if (feature) {
    let graphic = null;

    for (let i = that.map.graphics.graphics.length - 1; i >= 0; i--) {
      let geometry = that.map.graphics.graphics[i].geometry;
      that.map.graphics.graphics[i].setSymbol(that.defaultSymbol);
      if (geometry.type === 'polygon') {
        if (geometry.getCentroid().x === feature.geometry.getCentroid().x && geometry.getCentroid().y === feature.geometry.getCentroid().y) {
          graphic = that.map.graphics.graphics[i];
        }
      }
    }
    if (graphic) {
      graphic.setSymbol(that.selectSymbol);
      that.map.graphics.remove(graphic);
      setTimeout(function() {
        that.map.graphics.add(graphic);
      }, 500);
    }

    that.map.setExtent(feature.geometry.getExtent(), true);
  } else {
    DocumentUtil.showMessage('info', 'Esta transmissão não possui representação no mapa!', true, null, 'semRepresentacaoMapa');
  }

  return feature;
};

window.showTransmisaoDiv = function(elem) {
  // cl;

  if (elem.value === 'Geocódigo da Unidade - STM') {
    document.getElementById('geocodigoSTMTransmissao').style.display = 'block';
  } else {
    document.getElementById('geocodigoSTMTransmissao').style.display = 'none';
  }

  if (elem.value === 'ID da Transmissao') {
    document.getElementById('idTransmissao').style.display = 'block';
  } else {
    document.getElementById('idTransmissao').style.display = 'none';
  }

  if (elem.value === 'Tipo do Ímovel') {
    document.getElementById('tipoImovelDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('tipoImovelDivTransmissao').style.display = 'none';
  }

  if (elem.value === 'Tipologia') {
    document.getElementById('tipologiaDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('tipologiaDivTransmissao').style.display = 'none';
  }

  if (elem.value === 'Padrão') {
    document.getElementById('padraoDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('padraoDivTransmissao').style.display = 'none';
  }

  if (elem.value === 'Idade') {
    document.getElementById('idadeDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('idadeDivTransmissao').style.display = 'none';
  }

  if (elem.value === 'Área Construída') {
    document.getElementById('areaUtilDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('areaUtilDivTransmissao').style.display = 'none';
  }

  if (elem.value === 'Conservação') {
    document.getElementById('conservacaoDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('conservacaoDivTransmissao').style.display = 'none';
  }

  // if (elem.value === 'Garagem') {
  //   document.getElementById('garagemDivTransmissao').style.display = 'block';
  // } else {
  //   document.getElementById('garagemDivTransmissao').style.display = 'none';
  // }

  if (elem.value === 'Pavimento') {
    document.getElementById('pavimentoDivTransmissao').style.display = 'block';
  } else {
    document.getElementById('pavimentoDivTransmissao').style.display = 'none';
  }
};
