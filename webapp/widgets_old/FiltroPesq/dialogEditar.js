/* global define moment selfPesquisa esri $:true */
let uploadEditPhoto;

function fecharEditar() {
  // require([
  // 'dojo/_base/declare',
  // 'jimu/BaseWidget',
  // 'dojo/dom',
  // 'dojo/dom-construct'
  // ], function(declare, BaseWidget, dom, domConstruct) {
  // var esriMap = window.esriMap;

  let element = document.getElementById('myWidgetDialogEditar');
  if (element.hasAttribute('open')) {
    element.removeAttribute('open');
  } else {
    element.setAttribute('open', 'false');
  }
}

window.previewFileEdit = function() {
  let file = document.getElementById('edit-Photo').files[0];

  if (file.size > 2048000) {
    let e = document.getElementById('edit-Photo');
    if (e) {
      e.value = null;
    }

    return false;
  } else {
    let reader = new FileReader();

    reader.addEventListener('load', function() {
      uploadEditPhoto = reader.result;
    }, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }
};

window.updateEditHtml = function() {
  let editTitleLabel = document.getElementById('editTitleLabel');
  editTitleLabel.innerHTML = 'ID: ' + window.filtroPesq.editFeaturePesquisa.attributes.OBJECTID;

  let editTipoImovel = document.getElementById('edit-tipoImovel');
  editTipoImovel.value = window.filtroPesq.editFeaturePesquisa.attributes.de_tipo_do_imovel;

  let editTipologia = document.getElementById('edit-tipologia');
  editTipologia.value = window.filtroPesq.editFeaturePesquisa.attributes.de_tipologia;

  let editPadrao = document.getElementById('edit-padrao');
  editPadrao.value = window.filtroPesq.editFeaturePesquisa.attributes.de_padrao;

  let editIdade = document.getElementById('edit-idade');
  editIdade.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_idade;

  let editAreaUtil = document.getElementById('edit-areaUtil');
  editAreaUtil.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_area_construida;

  let editConservacao = document.getElementById('edit-conservacao');
  editConservacao.value = window.filtroPesq.editFeaturePesquisa.attributes.de_conservacao;

  let editQuarto = document.getElementById('edit-quarto');
  editQuarto.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_quartos;

  let editFontePesquisa = document.getElementById('edit-fontePesquisa');
  editFontePesquisa.value = window.filtroPesq.editFeaturePesquisa.attributes.de_fonte_pesquisa;

  let editBanheiro = document.getElementById('edit-banheiro');
  editBanheiro.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_banheiros;

  let editGaragem = document.getElementById('edit-garagem');
  editGaragem.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_garagens;

  let editPavimento = document.getElementById('edit-pavimento');
  editPavimento.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_qtd_pavimetos;

  let editTipoPavimento = document.getElementById('edit-tipoPavimento');
  editTipoPavimento.value = window.filtroPesq.editFeaturePesquisa.attributes.de_pavimentacao;

  let editValorMercado = document.getElementById('edit-valorMercado');
  editValorMercado.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_valor_mercado;

  let editTipoLote = document.getElementById('edit-tipoLote');
  editTipoLote.value = window.filtroPesq.editFeaturePesquisa.attributes.de_tipologia;

  let editAreaTerreno = document.getElementById('edit-areaTerreno');
  if (window.filtroPesq.editFeaturePesquisa.attributes.de_fonte_pesquisa) {
    if (window.filtroPesq.editFeaturePesquisa.attributes.de_fonte_pesquisa === 'Campo') {
      editAreaTerreno.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno;
    } else if (window.filtroPesq.editFeaturePesquisa.attributes.de_fonte_pesquisa === 'Site') {
      editAreaTerreno.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno;
    }
  }
  editAreaTerreno.value = window.filtroPesq.editFeaturePesquisa.attributes.nu_area_construida;

  let editObservacao = document.getElementById('edit-observacao');
  editObservacao.value = window.filtroPesq.editFeaturePesquisa.attributes.de_imobiliaria;

  hideByTipoImovelEdit();

  // var editPhoto = document.getElementById('edit-Photo');
  // editPhoto.value = window.filtroPesq.editFeaturePesquisa.attributes.de_foto_link;
};

function updateEditFeature() {
  let editTipoImovel = document.getElementById('edit-tipoImovel');
  if (editTipoImovel.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_tipo_do_imovel = editTipoImovel.value;
  }

  let editTipologia = document.getElementById('edit-tipologia');
  if (editTipologia.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_tipologia = editTipologia.value;
  }
  let editPadrao = document.getElementById('edit-padrao');
  if (editPadrao.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_padrao = editPadrao.value;
  }
  let editIdade = document.getElementById('edit-idade');
  if (editIdade.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_idade = editIdade.value;
  }
  let editAreaUtil = document.getElementById('edit-areaUtil');
  if (editAreaUtil.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_area_construida = editAreaUtil.value;
  }
  let editConservacao = document.getElementById('edit-conservacao');
  if (editConservacao.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_conservacao = editConservacao.value;
  }
  let editQuarto = document.getElementById('edit-quarto');
  if (editQuarto.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_quartos = editQuarto.value;
  }
  let editFontePesquisa = document.getElementById('edit-fontePesquisa');
  if (editFontePesquisa.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_fonte_pesquisa = editFontePesquisa.value;
  }
  let editBanheiro = document.getElementById('edit-banheiro');
  if (editBanheiro.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_banheiros = editBanheiro.value;
  }
  let editGaragem = document.getElementById('edit-garagem');
  if (editGaragem.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_garagens = editGaragem.value;
  }
  let editPavimento = document.getElementById('edit-pavimento');
  if (editPavimento.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_qtd_pavimetos = editPavimento.value;
  }
  let editTipoPavimento = document.getElementById('edit-tipoPavimento');
  if (editTipoPavimento.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_pavimentacao = editTipoPavimento.value;
  }
  let editValorMercado = document.getElementById('edit-valorMercado');
  if (editValorMercado.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.nu_valor_mercado = editValorMercado.value;
  }
  let editTipoLote = document.getElementById('edit-tipoLote');
  if (editTipoLote.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_tipologia = editTipoLote.value;
  }
  let editAreaTerreno = document.getElementById('edit-areaTerreno');
  if (editAreaTerreno.value) {
    if (editFontePesquisa.value) {
      if (editFontePesquisa.value === 'Campo') {
        window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno = editAreaTerreno.value;
        window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno = null;
      } else if (editFontePesquisa.value === 'Site') {
        window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno = editAreaTerreno.value;
        window.filtroPesq.editFeaturePesquisa.attributes.nu_area_terreno = null;
      }
    }
  }

  window.filtroPesq.editFeaturePesquisa.attributes.dt_atualizacao = moment().format('YYYY-MM-DD');

  let editObservacao = document.getElementById('edit-observacao');
  if (editObservacao.value) {
    window.filtroPesq.editFeaturePesquisa.attributes.de_imobiliaria = editObservacao.value;
  }
  // var editPhoto = document.getElementById('edit-Photo');
  // if (editPhoto.value) {
  //     window.filtroPesq.editFeaturePesquisa.attributes.de_foto_link = editPhoto.value;
  // }
}

// function fecharEditar() {
//     require([
//         'dojo/_base/declare',
//         'jimu/BaseWidget',
//         'dojo/dom',
//         'dojo/dom-construct'
//     ], function(declare, BaseWidget, dom, domConstruct) {
//         //var esriMap = window.esriMap;

//         var element = document.getElementById('myWidgetDialogEditar');
//         if (element.hasAttribute('open')) {
//             element.removeAttribute('open');
//         } else {
//             element.setAttribute('open', 'false');
//         }
//
//     });
// }

window.novaEdicao = function novaEdicao() {
  if (uploadEditPhoto) {
    savePhotoEdit(uploadEditPhoto, function(photoUrl) {
      window.filtroPesq.editFeaturePesquisa.attributes.de_foto_link = photoUrl;
      saveEdicaoPesquisa();
    });
  } else {
    saveEdicaoPesquisa();
  }
};

function hideByTipoImovelEdit() {
  let tipoImovel = document.getElementById('edit-tipoImovel').value;
  let toDisable = ['edit-tipologia', 'edit-padrao', 'edit-idade', 'edit-areaUtil', 'edit-conservacao', 'edit-quarto', 'edit-banheiro', 'edit-garagem', 'edit-pavimento', 'edit-tipoPavimento'];
  if (tipoImovel === 'Predial') {
    for (let i = 0; i < toDisable.length; i++) {
      document.getElementById(toDisable[i]).disabled = false;
    }
  } else {
    for (let i = 0; i < toDisable.length; i++) {
      document.getElementById(toDisable[i]).disabled = true;
    }
  }
}

function saveEdicaoPesquisa() {
  require([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'esri/layers/FeatureLayer',
    'dojo/dom',
    'dojo/dom-construct',
    'util/DocumentUtil.js'
  ], function(declare, BaseWidget, FeatureLayer, dom, domConstruct, DocumentUtil) {
    // var novaPesquisaObject = createObject();
    updateEditFeature();
    let novaPesquisa = [window.filtroPesq.editFeaturePesquisa];
    let map = window.filtroPesq.map;

    let layerPesquisa = map.getLayer('Mapas_Tematicos_das_Pesquisas_8171');

    // novaPesquisa = JSON.stringify(novaPesquisa)

    let featureLayer = new FeatureLayer('https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0');

    featureLayer.applyEdits(null, novaPesquisa, null,
      function(adds, updates, deletes) {
        layerPesquisa.refresh();
        DocumentUtil.showMessage('success', 'Pesquisa atualizada com sucesso!', true, 3000, null);
        selfPesquisa.filtroCadastro();
        fecharEditar();
        map.graphics.clear();
        selfPesquisa.limparFiltroCadastro();
      },
      function(err) {
        DocumentUtil.showMessage('success', err.message, true, 3000, null);

        DocumentUtil.showMessage('success', 'Pesquisa atualizada com sucesso!', true, 3000, null);
        layerPesquisa.refresh();
        selfPesquisa.filtroCadastro();
        fecharEditar();
        map.graphics.clear();
      });

    // $.ajax({
    //     url: 'https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0/addFeatures',
    //     type: 'post',
    //     data: novaPesquisa,
    //     dataType: 'json',
    //     success: function(data) {
    //         // selfPesquisa.showMessage('Terceira Avaliação Salva com Sucesso!')

    //     },
    //     error: function(xhr, ajaxOptions, thrownError) {

    //     }
    // });
  });
}

function savePhotoEdit(photoBase64, callback) {
  let headerAuthorization = 'bearer ' + localStorage['ngStorage-token'].replace('"', '').replace('"', '');
  $.ajax({
    url: 'http://172.16.32.46:1010/pesquisa-foto',
    type: 'put',
    data: {
      photo: photoBase64
    },
    headers: {
      authorization: headerAuthorization // If your header name has spaces or any other char not appropriate
    },
    dataType: 'text'
  }).then(function(photoUrl, textStatus, jqXHR) {
    // When AJAX call is successfuly

    callback(photoUrl);
  }, function(jqXHR, textStatus, errorThrown) {
    // When AJAX call has failed

  });
}

window.excluirCadastro = function() {
  $.confirm({
    title: 'Exclusão de pesquisa!',
    content: 'Você realmente deseja excluir a pesquisa? a operação não pode ser desfeita.',
    buttons: {
      excluir: function() {
        require([
          'dojo/_base/declare',
          'jimu/BaseWidget',
          'esri/layers/FeatureLayer',
          'dojo/dom',
          'dojo/dom-construct',
          'util/DocumentUtil.js'
        ], function(declare, BaseWidget, FeatureLayer, dom, domConstruct, DocumentUtil) {
          let id = window.filtroPesq.editFeaturePesquisa.attributes.OBJECTID;
          let query = new esri.tasks.Query();
          let map = window.filtroPesq.map;

          let layerPesquisa = map.getLayer('Mapas_Tematicos_das_Pesquisas_8171');

          let featureLayer = new FeatureLayer('https://sigribamar.com.br/server/rest/services/GeoITBI/Mapas_Tematicos_das_Pesquisas/FeatureServer/0', {
            outFields: ['*']
          });

          query.where = 'OBJECTID  = ' + id; // the valve ops rec layer thus using the val ops rec incident id
          featureLayer.selectFeatures(query, esri.layers.FeatureLayer.SELECTION_NEW,
            function(features) {
              for (let i = 0; i < features.length; i++) {
                featureLayer.applyEdits(null, null, [features[i]], function(adds, updates, deletes) {
                  layerPesquisa.refresh();
                  DocumentUtil.showMessage('success', 'Pesquisa excluida com sucesso!', true, 3000, null);
                  selfPesquisa.filtroCadastro();
                  fecharEditar();
                  map.graphics.clear();
                  selfPesquisa.limparFiltroCadastro();
                },
                function(err) {
                  DocumentUtil.showMessage('error', err.message, true, 3000, null);
                });
              }
            });
        });
      },
      cancelar: function() {

      }
    }
  });
};
