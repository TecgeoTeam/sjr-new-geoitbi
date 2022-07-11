/*
Copyright ©2014 Esri. All rights reserved.

TRADE SECRETS: ESRI PROPRIETARY AND CONFIDENTIAL
Unpublished material - all rights reserved under the
Copyright Laws of the United States and applicable international
laws, treaties, and conventions.

For additional information, contact:
Attn: Contracts and Legal Department
Environmental Systems Research Institute, Inc.
380 New York Street
Redlands, California, 92373
USA

email: contracts@esri.com
*/

define([
  'dojo/_base/array',
  'jimu/LayerInfos/LayerInfos'
], function(array, LayerInfos) {
  let mo = {};

  mo.getLayerInfosParam = function() {
    // summary:
    //   get layerInfos parameter for create/refresh/settingPage in legend dijit.
    // description:
    let layerInfosParamFromCurrentMap = getLayerInfosParamFromCurrentMap();
    return layerInfosParamFromCurrentMap;
  };

  mo.getLayerInfosParamByConfig = function(legendConfig) {
    let layerInfosParam = [];
    let layerInfosParamFromCurrentMap;
    if (legendConfig.layerInfos && legendConfig.layerInfos.length) {
      layerInfosParamFromCurrentMap = getLayerInfosParamFromCurrentMap();
      // respect config
      array.forEach(layerInfosParamFromCurrentMap, function(layerInfoParam) {
        let layerInfoConfig = getLayerInfoConfigById(legendConfig, layerInfoParam.jimuLayerInfo.id);
        if (layerInfoConfig) {
          layerInfoParam.hideLayers = layerInfoConfig.hideLayers;
          layerInfosParam.push(layerInfoParam);
        }
      });
    }
    return layerInfosParam;
  };

  var getLayerInfosParamFromCurrentMap = function() {
    let layerInfosParam = [];
    let jimuLayerInfos = LayerInfos.getInstanceSync();
    let jimuLayerInfoArray = jimuLayerInfos.getLayerInfoArray();
    array.forEach(jimuLayerInfoArray, function(topLayerInfo) {
      let hideLayers = [];
      if (topLayerInfo.getShowLegendOfWebmap()) {
        // temporary code.
        if (topLayerInfo.layerObject &&
           (topLayerInfo.layerObject.declaredClass === 'esri.layers.ArcGISDynamicMapServiceLayer' ||
            topLayerInfo.layerObject.declaredClass === 'esri.layers.ArcGISTiledMapServiceLayer')) {
          topLayerInfo.traversal(function(layerInfo) {
            if (layerInfo.isLeaf() && !layerInfo.getShowLegendOfWebmap()) {
              hideLayers.push(layerInfo.originOperLayer.mapService.subId);
            }
          });
        }
        // add to layerInfosparam
        if (topLayerInfo.isMapNotesLayerInfo()) {
          array.forEach(topLayerInfo.getSubLayers(), function(mapNotesSubLayerInfo) {
            let layerInfoParam = {
              layer: mapNotesSubLayerInfo.layerObject,
              title: 'Map Notes - ' + mapNotesSubLayerInfo.title
            };
            layerInfosParam.push(layerInfoParam);
          });
        } else {
          let layerInfoParam = {
            hideLayers: hideLayers,
            layer: topLayerInfo.layerObject,
            title: topLayerInfo.title
          };
          layerInfosParam.push(layerInfoParam);
        }
      }
    });
    return layerInfosParam.reverse();
  };

  var getLayerInfoConfigById = function(legendConfig, id) {
    let layerInfoConfig = array.filter(legendConfig.layerInfos, function(layerInfoConfig) {
      let result = false;
      if (layerInfoConfig.id === id) {
        result = true;
      }
      return result;
    });
    return layerInfoConfig[0];
  };
  return mo;
});
