/* global define moment selfPesquisa $:true */
let uploadPhoto;

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

function fecharCadastrar() {
  // require([
  // 'dojo/_base/declare',
  // 'jimu/BaseWidget',
  // 'dojo/dom',
  // 'dojo/dom-construct'
  // ], function(declare, BaseWidget, dom, domConstruct) {
  // var esriMap = window.esriMap;

  let element = document.getElementById('myWidgetDialogCadastrar');
  if (element.hasAttribute('open')) {
    element.removeAttribute('open');
  } else {
    element.setAttribute('open', 'false');
  }
  let map = selfPesquisa.map;
  map.graphics.clear();
}

window.previewFile = function() {
  let file = document.getElementById('cadastroPesquisaPhoto').files[0];
  if (file.size > 2048000) {
    let e = document.getElementById('cadastroPesquisaPhoto');
    if (e) {
      e.value = null;
    }

    return false;
  } else {
    let reader = new FileReader();

    reader.addEventListener('load', function() {
      uploadPhoto = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
};

window.novoCadastro = function novoCadastro() {
  let novaPesquisaObject = createObject();
  let novaPesquisa = [{
    geometry: window.filtroPesq.novaPesquisa.geometry,
    attributes: novaPesquisaObject
  }];

  if (uploadPhoto) {
    savePhoto(uploadPhoto, function(photoUrl) {
      novaPesquisaObject.de_foto_link = photoUrl;
      savePesquisa(novaPesquisa);
    });
  } else {
    savePesquisa(novaPesquisa);
  }
};

function savePesquisa(novaPesquisa) {
  require([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'esri/layers/FeatureLayer',
    'dojo/dom',
    'dojo/dom-construct',
    'util/DocumentUtil.js'
  ], function(declare, BaseWidget, FeatureLayer, dom, domConstruct, DocumentUtil) {
    let featureLayer = new FeatureLayer('http://www.senocwb.com/senoportal/rest/services/SJR_ITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0');

    let map = window.filtroPesq.map;

    let layerPesquisa = map.getLayer('Mapas_Tematicos_das_Pesquisas_8171');

    // novaPesquisa = JSON.stringify(novaPesquisa)

    featureLayer.applyEdits(novaPesquisa, null, null,
      function(data) {
        layerPesquisa.refresh();
        limparFormularioDeCadastro();
        selfPesquisa.filtroCadastro();
        fecharCadastrar();
        DocumentUtil.showMessage('success', 'Pesquisa adicionada com sucesso!', true, 3000, null);
        map.graphics.clear();
      },
      function(jqXHR, textStatus, errorThrown) {
        limparFormularioDeCadastro();
        selfPesquisa.filtroCadastro();
        fecharCadastrar();
        DocumentUtil.showMessage('success', 'Pesquisa adicionada com sucesso!', true, 3000, null);
        layerPesquisa.refresh();
        map.graphics.clear();
      });
  });
}

function savePhoto(photoBase64, callback) {
  $.ajax({
    url: 'http://93.188.166.2:1010/pesquisa-foto',
    type: 'post',
    data: {
      foto: photoBase64
    },
    dataType: 'application/json'
  }).then(function(response) {
    //
  }, function(response) {
    if (response.status == 200) {
      console.log("|| Requisi��o pesquisa-foto bem sucedida ||");
      console.log(response.responseText);
      let responseTXTJSON = JSON.parse(response.responseText);
      callback(responseTXTJSON.photoUrl);
    }
  });
}
function limparFormularioDeCadastro() {
  let e = document.getElementById('dataDeCadastro');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('tipoImovel');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('tipologia');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('padrao');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('idade');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('areaUtil');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('conservacao');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('quarto');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('fontePesquisa');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('banheiro');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('garagem');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('pavimento');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('tipoPavimento');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('valorMercado');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('tipoLote');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('areaTerreno');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('observacao');
  if (e) {
    e.value = null;
  }

  e = document.getElementById('cadastroPesquisaPhoto');
  if (e) {
    e.value = null;
  }
}

window.hideByTipoImovel = function() {
  let tipoImovel = document.getElementById('tipoImovel').value;
  let toDisable = ['tipologia', 'padrao', 'idade', 'areaUtil', 'conservacao', 'quarto', 'banheiro', 'garagem', 'pavimento', 'tipoPavimento'];
  if (tipoImovel === 'Predial') {
    for (let i = 0; i < toDisable.length; i++) {
      document.getElementById(toDisable[i]).disabled = false;
    }
  } else {
    for (let i = 0; i < toDisable.length; i++) {
      document.getElementById(toDisable[i]).disabled = true;
    }
  }
};

function createObject() {
  let novaPesquisaObject = {};
  let dataDeCadastro;
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

  let e = document.getElementById('dataDeCadastro');
  dataDeCadastro = e.value;

  e = document.getElementById('fontePesquisa');
  fontePesquisa = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

  e = document.getElementById('tipoImovel');
  tipoImovel = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

  if (tipoImovel && tipoImovel === 'Predial') {
    e = document.getElementById('tipologia');
    tipologia = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

    e = document.getElementById('padrao');
    padrao = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

    e = document.getElementById('idade');
    idade = e.value;

    e = document.getElementById('areaUtil');
    areaUtil = e.value;

    e = document.getElementById('conservacao');
    conservacao = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

    e = document.getElementById('quarto');
    quarto = e.value;

    e = document.getElementById('banheiro');
    banheiro = e.value;

    e = document.getElementById('garagem');
    garagem = e.value;

    e = document.getElementById('pavimento');
    pavimento = e.value;

    e = document.getElementById('tipoPavimento');
    tipoPavimento = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;
  } else {
    tipologia = null;

    padrao = null;

    idade = null;

    areaUtil = null;

    conservacao = null;

    quarto = null;

    banheiro = null;

    garagem = null;

    pavimento = null;

    tipoPavimento = null;
  }

  e = document.getElementById('valorMercado');
  valorMercado = e.value;

  e = document.getElementById('tipoLote');
  tipoLote = e.options[e.selectedIndex] ? e.options[e.selectedIndex].value : null;

  e = document.getElementById('areaTerreno');
  areaTerreno = e.value;

  e = document.getElementById('observacao');
  observacao = e.value;

  if (dataDeCadastro) {
    novaPesquisaObject.dt_data_cadastro = moment(dataDeCadastro, 'DD-MM-YYYY').format('MM-DD-YYYY');
  }
  if (tipoImovel) {
    novaPesquisaObject.de_tipo_do_imovel = tipoImovel;
  }
  if (tipologia) {
    novaPesquisaObject.de_tipologia = tipologia;
  }
  if (padrao) {
    novaPesquisaObject.de_padrao = padrao;
  }
  if (idade) {
    novaPesquisaObject.nu_idade = idade;
  }
  if (areaUtil) {
    novaPesquisaObject.nu_area_construida = areaUtil;
  }
  if (conservacao) {
    novaPesquisaObject.de_conservacao = conservacao;
  }
  if (quarto) {
    novaPesquisaObject.nu_quartos = quarto;
  }
  if (fontePesquisa) {
    novaPesquisaObject.de_fonte_pesquisa = fontePesquisa;
  }
  if (banheiro) {
    novaPesquisaObject.nu_banheiros = banheiro;
  }
  if (garagem) {
    novaPesquisaObject.nu_garagens = garagem;
  }
  if (pavimento) {
    novaPesquisaObject.nu_qtd_pavimetos = pavimento;
  }
  if (tipoPavimento) {
    novaPesquisaObject.de_pavimentacao = tipoPavimento;
  }
  if (valorMercado) {
    novaPesquisaObject.nu_valor_mercado = valorMercado;
  }
  if (tipoLote) {
    novaPesquisaObject.de_tipologia = tipoLote;
  }
  if (areaTerreno && fontePesquisa) {
    if (fontePesquisa === 'Campo') {
      novaPesquisaObject.nu_Area_do_Terreno_Cadastro = areaTerreno;
    } else {
      novaPesquisaObject.nu_Area_de_Terreno_Site = areaTerreno;
    }
  }

  if (observacao) {
    novaPesquisaObject.de_Observacao = observacao;
  }
  //let usuarioDados = JSON.parse(localStorage["ngStorage-dados"])
  let usuarioDados = localStorage.getItem('email')
  //usuarioDados.usuario.username
  //console.log(usuarioDados)

  novaPesquisaObject.de_username = usuarioDados;
  novaPesquisaObject.dt_data_cadastro = moment().format('YYYY-MM-DD');
  novaPesquisaObject.dt_atualizacao = moment().format('YYYY-MM-DD');

  return novaPesquisaObject;
}
