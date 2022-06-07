/* global define */
/* jslint nomen:true */
/// <reference path="../jsapi_vsdoc12_v33.js" />
define([
  'require',

  'dojo/io/script'
], function(require) {
  'use strict';

  class DocumentUtil {
    static createTable(tableId, titles, rows) {
      let tableDiv = document.getElementById(tableId);

      while (tableDiv.hasChildNodes()) {
        tableDiv.removeChild(tableDiv.firstChild);
      }
      let tbody = document.createElement('tbody');
      tableDiv.appendChild(tbody);
      let trTitles = document.createElement('tr');
      tbody.appendChild(trTitles);
      for (let i = 0; i < titles.data.length; i++) {
        let thTitles = document.createElement('th');
        let textTitles = document.createTextNode(titles.data[i]);
        thTitles.appendChild(textTitles);
        for (let variable in titles.options) {
          if (titles.options.hasOwnProperty(variable)) {
            thTitles.setAttribute(variable, titles.options[variable]);
          }
        }

        trTitles.appendChild(thTitles);
      }

      for (let i = 0; i < rows.data.length; i++) {
        let dataRow = rows.data[i];
        let trData = document.createElement('tr');
        trData.setAttribute('class', 'tr-click');
        trData.setAttribute('onclick', 'selfRecorte.clickTr(this)');
        tbody.appendChild(trData);
        for (let j = 0; j < dataRow.length; j++) {
          let column = dataRow[j];
          let tdColumn = document.createElement('td');
          trData.appendChild(tdColumn);
          for (let variable in rows.options) {
            if (rows.options.hasOwnProperty(variable)) {
              tdColumn.setAttribute(variable, rows.options[variable]);
            }
          }
          let textColumn = document.createTextNode(column);
          tdColumn.appendChild(textColumn);
        }
      }

      return tableDiv;
    }

    static showMessage(type, text, willShow, timeOut, id, dontBlink) {
      // snackbar
      // Get the snackbar DIV
      let messageDiv = document.getElementById('messagesDiv');
      let boxDiv;
      if (willShow) {
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
          if (!dontBlink) {
            boxDiv.style.opacity = '0';
            boxDiv.style.display = 'none';
            setTimeout(function() {
              boxDiv.style.opacity = '1';
              setTimeout(function() {
                boxDiv.style.display = 'block';
              }, 600);
            }, 600);
          }
        }

        // // x.innerHTML = text;

        if (id) {
          boxDiv.setAttribute('id', id);
        }

        let spanMessage = document.createElement('span');
        spanMessage.setAttribute('class', 'closebtn');
        spanMessage.innerHTML = '&#10005;';
        boxDiv.appendChild(spanMessage);

        let titleMessage = document.createElement('label');
        titleMessage.setAttribute('class', 'title-message-warning');
        boxDiv.appendChild(titleMessage);
        let iconWarning = document.createElement('span');
        if (type === 'success') {
          boxDiv.setAttribute('class', 'message-alert success');
          titleMessage.innerText = 'Mensagem de Sucesso';
          iconWarning.setAttribute('class', 'glyphicon glyphicon-ok');
          iconWarning.setAttribute('style', 'color: green; padding-left: 5px;');
        } else if (type === 'info') {
          boxDiv.setAttribute('class', 'message-alert info');
          titleMessage.innerText = 'Mensagem de Informação';
          iconWarning.setAttribute('class', 'glyphicon glyphicon-exclamation-sign');
          iconWarning.setAttribute('style', 'color: #ff9b00; padding-left: 5px;');
        } else if (type === 'warning') {
          boxDiv.setAttribute('class', 'message-alert warning');
          titleMessage.innerText = 'Atenção';
          iconWarning.setAttribute('class', 'glyphicon glyphicon-warning-sign');
          iconWarning.setAttribute('style', 'color: red; padding-left: 5px;');
        }
        titleMessage.appendChild(iconWarning);

        let divLogo = document.createElement('div');
        boxDiv.appendChild(divLogo);
        divLogo.setAttribute('class', 'div-logo-message');
        let logoSL = document.createElement('img');
        divLogo.appendChild(logoSL);
        logoSL.setAttribute('class', 'logo-sl-message');
        logoSL.setAttribute('src', 'images/logoHeader.png');
        let textDiv = document.createElement('div');
        boxDiv.appendChild(textDiv);
        textDiv.setAttribute('class', 'text-box');

        textDiv.appendChild(document.createTextNode(text));

        let divFooterSL = document.createElement('div');
        boxDiv.appendChild(divFooterSL);
        divFooterSL.setAttribute('class', 'div-footer-message');
        let footerSL = document.createElement('span');
        footerSL.setAttribute('class', 'footer-sl-message');
        footerSL.setAttribute('aria-hidden', 'true');
        footerSL.innerText = 'Prefeitura de São José de Ribamar - MA';
        divFooterSL.appendChild(footerSL);

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
          boxDiv = document.getElementById(id);
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
      //
      return boxDiv;
    }

    static showMessageWithButton(buttons, type, text, willShow, timeOut, id) {
      let messageDiv = this.showMessage(type, text, willShow, timeOut, id);
      for (let i = 0; i < buttons.length; i++) {
        let btn = document.createElement('BUTTON');
        let t = document.createTextNode(buttons[i].label); // Create a text node
        btn.appendChild(t);
        for (let variable in buttons[i].attributes) {
          if (buttons[i].attributes.hasOwnProperty(variable)) {
            btn.setAttribute(variable, buttons[i].attributes[variable]);
          }
        }
        messageDiv.appendChild(btn);
      }
    }

    static showSpinner(show) {
      let element = document.getElementById('spinner-filtro');
      if (show) {
        element.style.display = 'block';
      } else {
        element.style.display = 'none';
      }
    }
  }

  return DocumentUtil;
});
