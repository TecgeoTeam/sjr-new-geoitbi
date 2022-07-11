function goToLayer() {
  require([
    'dojo/_base/declare',
    'jimu/BaseWidget',
    'dojo/dom',
    'dojo/dom-construct'
  ], function(declare, BaseWidget, dom, domConstruct) {
    let esriMap = window.esriMap;
    for (variavel in esriMap._layers) {
      // this.map._layers[i]
      if (variavel === 'Mapas_Tematicos_IPTU_FISICO_LOTES_8337') {
        esriMap._layers[variavel]._zoomEndHandler();
        console.log(esriMap._layers[variavel]);
        console.log(esriMap);
        // this.map._layers[variavel].fullExtent.spatialReference.wkid=102100;
        esriMap.spatialReference.wkid = 31985;
        esriMap.setExtent(esriMap._layers[variavel].fullExtent, true);
      }
    }
  });
}
