/// ////////////////////////////////////////////////////////////////////////
// Copyright © 2014 - 2016 Esri. All Rights Reserved.
//
// Licensed under the Apache License Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/// ////////////////////////////////////////////////////////////////////////

/* global define:true */
define(['dojo/_base/declare',
  'dojo/_base/lang',
  'dojo/_base/html',
  'dojo/on',
  'dojo/query',
  'dojo/cookie',
  'dijit/_WidgetsInTemplateMixin',
  'jimu/BaseWidget',
  'jimu/dijit/CheckBox',
  'jimu/utils',
  'esri/lang',
  'jimu/dijit/LoadingShelter',
  'dojo/Deferred'
],
function(declare, lang, html, on, query, cookie, _WidgetsInTemplateMixin, BaseWidget,
  CheckBox, utils, esriLang, LoadingShelter, Deferred) {
  let clazz = declare([BaseWidget, _WidgetsInTemplateMixin], {
    baseClass: 'jimu-widget-splash',
    _hasContent: null,
    _requireConfirm: null,
    _isClosed: false,

    postCreate: function() {
      this.inherited(arguments);
      // LoadingShelter
      this.shelter = new LoadingShelter({
        hidden: true
      });
      this.shelter.placeAt(this.domNode);
      this.shelter.startup();

      this._hasContent = this.config.splash && this.config.splash.splashContent;
      this._requireConfirm = this.config.splash && this.config.splash.requireConfirm;
      this._showOption = this.config.splash && this.config.splash.showOption;
      this._confirmEverytime = this.config.splash && this.config.splash.confirmEverytime;

      if (this._hasContent) {
        this.customContentNode.innerHTML = this.config.splash.splashContent;
      }

      if (!this._requireConfirm && !this._showOption) {
        html.setStyle(this.confirmCheck, 'display', 'none');
        html.addClass(this.okNode, 'enable-btn');
      } else {
        let hint = '';
        if (this._requireConfirm) {
          hint = this.config.splash.confirm.text;
          html.addClass(this.okNode, 'disable-btn');
        } else {
          hint = this.nls.notShowAgain;
          html.addClass(this.okNode, 'enable-btn');
        }
        this.confirmCheck = new CheckBox({
          label: utils.stripHTML(hint),
          checked: false
        }, this.confirmCheck);
        this.own(on(this.confirmCheck.domNode, 'click', lang.hitch(this, this.onCheckBoxClick)));
        html.setAttr(this.confirmCheck.domNode, 'title', utils.stripHTML(hint));
        this.confirmCheck.startup();
      }
    },

    onOpen: function() {
      if (!utils.isInConfigOrPreviewWindow()) {
        let isFirstKey = this._getCookieKey();
        let isfirst = cookie(isFirstKey);
        if (esriLang.isDefined(isfirst) && isfirst.toString() === 'false') {
          this.close();
        }
      }
    },

    startup: function() {
      this.inherited(arguments);
      this.shelter.show();
      this._normalizeDomNodePosition();

      this._setConfig();
    },

    _setConfig: function() {
      this._setWidthForOldVersion().then(lang.hitch(this, function() {
        this._setSizeFromConfig();

        let button = this.config.splash.button;
        if (typeof button !== 'undefined') {
          if (typeof button.color !== 'undefined') {
            html.setStyle(this.okNode, 'backgroundColor', button.color);
            html.setStyle(this.okNode, 'color', utils.invertColor(button.color));// auto color for text
          }
          if (typeof button.transparency !== 'undefined') {
            html.setStyle(this.okNode, 'opacity', (1 - button.transparency));
          }
        }
        this.okNode.innerHTML = this.config.splash.button.text || this.nls.ok;

        let background = this.config.splash.background;
        if (typeof background !== 'undefined') {
          // image
          if (background.mode === 'image' && typeof background.image !== 'undefined') {
            let bg = '';
            let repeat = '';
            bg = 'url(' + utils.processUrlInWidgetConfig(background.image, this.folderUrl) + ') center center ';
            repeat = 'no-repeat';

            let type = background.type;
            if (typeof type !== 'undefined') {
              html.addClass(this.splashContainerNode, type);
              if (type === 'tile') {
                repeat = 'repeat';// only "tile" need repeat
              }
            }
            html.setStyle(this.splashContainerNode, 'background', bg + repeat);
          } else if (background.mode === 'color' && typeof background.color !== 'undefined') {
            // color
            if (typeof background.color !== 'undefined') {
              html.setStyle(this.splashContainerBackground, 'backgroundColor', background.color);
            }
            if (typeof background.transparency !== 'undefined') {
              html.setStyle(this.splashContainerBackground, 'opacity', (1 - background.transparency));
            }
          }
        }
        // html.setStyle(query(".label", this.dmoNode)[0], 'color', utils.invertColor(background.color));//auto color for text
        let confirm = this.config.splash.confirm;
        if (typeof confirm !== 'undefined') {
          let dom = query('.label', this.dmoNode)[0];
          if (typeof confirm.color !== 'undefined' && dom) {
            html.setStyle(dom, 'color', confirm.color);
          }
          if (typeof confirm.transparency !== 'undefined' && dom) {
            html.setStyle(dom, 'opacity', (1 - confirm.transparency));
          }
        }

        if (typeof this.config.splash.contentVertical !== 'undefined') {
          this.contentVertical = this.config.splash.contentVertical;
        } else {
          this.contentVertical = 'top';
        }

        // resize
        if (!utils.isInConfigOrPreviewWindow()) {
          let isFirstKey = this._getCookieKey();
          let isfirst = cookie(isFirstKey);
          if (esriLang.isDefined(isfirst) && isfirst.toString() === 'false') {
            this.close();
          }
        }

        this.resize();
        this.own(on(window, 'resize', lang.hitch(this, function() {
          this.resize();
        })));
        this._resizeContentImg();

        html.removeClass(this.envelopeNode, 'buried');// show the node
        this.shelter.hide();
      }));
    },

    _normalizeDomNodePosition: function() {
      html.setStyle(this.domNode, 'top', 0);
      html.setStyle(this.domNode, 'left', 0);
      html.setStyle(this.domNode, 'right', 0);
      html.setStyle(this.domNode, 'bottom', 0);
    },

    setPosition: function(position) {
      this.position = position;

      html.place(this.domNode, window.jimuConfig.layoutId);
      this._normalizeDomNodePosition();
      if (this.started) {
        this.resize();
      }
    },

    resize: function() {
      this._changeStatus();
    },

    _resizeContentImg: function() {
      if (this._hasContent && !this._isClosed) {
        let customBox = html.getContentBox(this.envelopeNode);
        html.empty(this.customContentNode);

        let splashContent = html.toDom(this.config.splash.splashContent);
        html.place(splashContent, this.customContentNode);
        // single node only(no DocumentFragment)
        if (this.customContentNode.nodeType && this.customContentNode.nodeType === 1) {
          let contentImgs = query('img', this.customContentNode);
          if (contentImgs && contentImgs.length) {
            contentImgs.style({
              maxWidth: (customBox.w - 40 - 20) + 'px', // prevent x scroll
              maxHeight: (customBox.h - 40) + 'px'
            });
          }
        }
      }
    },

    _changeStatus: function() {
      if (window.appInfo.isRunInMobile) {
        html.setStyle(this.envelopeNode, 'height', '100%');
        html.setStyle(this.envelopeNode, 'width', '100%');
      } else {
        this._setSizeFromConfig();
      }

      this._resizeCustomContent();
      this._resizeContentImg();
    },
    _getNodeStylePx: function(node, prop) {
      if (node && prop) {
        return parseInt(html.getStyle(node, prop), 10);
      } else {
        return 0;
      }
    },
    _resizeCustomContent: function() {
      let containerContent = html.getContentBox(this.splashContainerNode);
      let customContentScrollheight = this.customContentNode.scrollHeight;
      let footerBox = html.getMarginBox(this.footerNode);
      let contentMarginButtom = this._getNodeStylePx(this.customContentNode, 'margin-bottom'); // between content & confirm text
      let footerBottom = this._getNodeStylePx(this.footerNode, 'bottom'); // between footer & splashBottom
      let contentSpace = containerContent.h - (footerBox.h + footerBottom);

      let isNeedLimitCustomContentHeight = (customContentScrollheight >= contentSpace);
      if (isNeedLimitCustomContentHeight === true || window.appInfo.isRunInMobile) {
        // limit the customContent height   OR   extend height in mobile
        html.setStyle(this.customContentNode, 'height', (contentSpace - contentMarginButtom) + 'px');
      } else {
        html.setStyle(this.customContentNode, 'height', 'auto');
        this._moveContentToMiddle({
          contentSpace: contentSpace,
          customContentScrollheight: customContentScrollheight
        });
      }
    },
    // align custom content to vertically
    _moveContentToMiddle: function(context) {
      let contentMarginTop = 10; // this._getNodeStylePx(this.customContentNode, "margin-top"),
      let middleLine = (context.contentSpace - contentMarginTop) / 2;
      // move the content to middle
      if (this.contentVertical === 'middle') {
        // customContent half-height line is upon the middleLine
        let uponTheMiddleline = context.customContentScrollheight / 2 - middleLine;
        if (uponTheMiddleline < 0) {
          // Content is short
          let abs = Math.abs(uponTheMiddleline);
          html.setStyle(this.customContentNode, 'marginTop', abs + contentMarginTop + 'px');
        } else {
          // Content too long
          html.setStyle(this.customContentNode, 'marginTop', contentMarginTop + 'px');
        }
      }
    },
    onCheckBoxClick: function() {
      if (this._requireConfirm) {
        if (this.confirmCheck.getValue()) {
          html.addClass(this.okNode, 'enable-btn');
          html.removeClass(this.okNode, 'disable-btn');
        } else {
          html.addClass(this.okNode, 'disable-btn');
          html.removeClass(this.okNode, 'enable-btn');
        }
      }
    },

    _getCookieKey: function() {
      return 'isfirst_' + encodeURIComponent(utils.getAppIdFromUrl());
    },

    onOkClick: function() {
      let isFirstKey = this._getCookieKey();
      if (this._requireConfirm) {
        if (this.confirmCheck.getValue()) {
          if (utils.isInConfigOrPreviewWindow() || this._confirmEverytime) {
            cookie(isFirstKey, null, {expires: -1});
          } else {
            cookie(isFirstKey, false, {
              expires: 1000,
              path: '/'
            });
          }
          this.close();
        }
      } else {
        if (this._showOption) {
          if (!utils.isInConfigOrPreviewWindow() && this.confirmCheck.getValue()) {
            cookie(isFirstKey, false, {
              expires: 1000,
              path: '/'
            });
          }
        } else {
          cookie(isFirstKey, null, {expires: -1});
        }
        this.close();
      }
    },

    close: function() {
      this._isClosed = true;
      this.widgetManager.closeWidget(this);
    },

    _setSizeFromConfig: function() {
      let size = this.config.splash.size;
      if (typeof size !== 'undefined') {
        if (typeof size === 'object') {
          let percent = size.percent;
          let wh = size.wh;
          if (size.mode === 'percent' && typeof percent !== 'undefined') {
            html.setStyle(this.envelopeNode, 'width', percent);
            html.setStyle(this.envelopeNode, 'height', percent);
          } else if (size.mode === 'wh' && typeof wh !== 'undefined') {
            this._setWidthInCurrentScreen(wh);
            this._setHeightInCurrentScreen(wh);
          }
        }
      }
    },
    // avoid to screen is too small to show the splash, when user use wh pixel
    _setWidthInCurrentScreen: function(wh) {
      let screenWidth = window.innerWidth;
      if (!window.appInfo.isRunInMobile && wh.w <= screenWidth) {
        html.setStyle(this.envelopeNode, 'width', wh.w + 'px');
      } else {
        html.setStyle(this.envelopeNode, 'width', '100%');
      }
    },
    _setHeightInCurrentScreen: function(wh) {
      let screenHeight = window.innerHeight;
      if (!window.appInfo.isRunInMobile && wh.h <= screenHeight) {
        html.setStyle(this.envelopeNode, 'height', wh.h + 'px');
      } else {
        html.setStyle(this.envelopeNode, 'height', '100%');
      }
    },
    // for old version update
    _setWidthForOldVersion: function() {
      let def = new Deferred();
      let size = this.config.splash.size;
      let isOldVersion = (size.mode === 'wh' && typeof size.wh !== 'undefined' && size.wh.h === null);
      if (isOldVersion === true) {
        // this._setWhiteColorTextForOldVersion();
        return utils.getEditorContentHeight(this.config.splash.splashContent, this.domNode, {
          'contentWidth': 600 - 40,
          'contentMarginTop': 20, // contentMarginTop
          'footerHeight': 88 + 10// contentMarginBottom
        }).then(
          lang.hitch(this, function(h) {
            size.wh.h = h;
            return h;
          }));
      } else {
        // this._restoreTextColorForNormal();
        def.resolve();
        return def;
      }
    }//, 
    // _setWhiteColorTextForOldVersion: function() {
    //   html.setStyle(this.customContentNode, 'color', "#fff");
    // },
    // _restoreTextColorForNormal: function() {
    //   html.setStyle(this.customContentNode, 'color', "#000");
    // }
  });
  return clazz;
});
