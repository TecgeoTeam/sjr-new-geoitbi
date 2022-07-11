define(['jimu/shared/BaseVersionManager'],
  function(BaseVersionManager) {
    function VersionManager() {
      /* jshint maxlen:150 */
      this.versions = [{
        version: '1.0',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.2',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '1.3',
        upgrader: function(oldConfig) {
          let newConfig = {};
          newConfig.sources = [];
          if (!oldConfig.geocoder) {
            return newConfig;
          }
          let oldGeocoder = oldConfig.geocoder;
          let source = null;
          let defaultMaxResults = 6;
          if (oldGeocoder.arcgisGeocoder) {
            source = {};
            if (Object.prototype.toString.call(oldGeocoder.arcgisGeocoder) === '[object Object]') {
              for (let p in oldGeocoder.arcgisGeocoder) {
                source[p] = oldGeocoder.arcgisGeocoder[p];
              }
              source.url = source.url ||
                'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
              source.singleLineFieldName = source.singleLineFieldName || 'SingleLine';
              source.name = source.name || 'Esri World Geocoder';
            } else if (typeof oldGeocoder.arcgisGeocoder === 'boolean') {
              source.url = 'https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer';
              source.name = 'Esri World Geocoder';
              source.singleLineFieldName = 'SingleLine';
              source.placeholder = 'Esri World Geocoder';
            }
            source.countryCode = source.sourceCountry || source.countryCode || '';
            source.maxResults = oldGeocoder.maxLocations || defaultMaxResults;
            newConfig.sources.push(source);
          }

          for (let i = 0, len = oldGeocoder.geocoders.length; i < len; i++) {
            source = {};
            let geocoder = oldGeocoder.geocoders[i];
            for (let p2 in geocoder) {
              source[p2] = geocoder[p2];
            }
            source.countryCode = source.sourceCountry || source.countryCode || '';
            source.maxResults = oldGeocoder.maxLocations || defaultMaxResults;
            source.type = source.type || 'locator';
            newConfig.sources.push(source);
          }

          newConfig.upgradeFromGeocoder = true;
          return newConfig;
        }
      }, {
        version: '1.4',
        upgrader: function(oldConfig) {
          oldConfig.allPlaceholder = '';
          oldConfig.showInfoWindowOnSelect = true;

          return oldConfig;
        }
      }, {
        version: '2.0beta',
        upgrader: function(oldConfig) {
          function addMaxSuggestions(sources) {
            for (let i = 0, len = sources.length; i < len; i++) {
              let s = sources[i];
              s.maxSuggestions = s.maxSuggestions || 6;
            }
          }

          function addZoomScale(sources) {
            for (let i = 0, len = sources.length; i < len; i++) {
              let s = sources[i];
              s.zoomScale = s.zoomScale || 50000;
            }
          }

          addMaxSuggestions(oldConfig.sources);
          addZoomScale(oldConfig.sources);

          return oldConfig;
        }
      }, {
        version: '2.0',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.1',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.2',
        upgrader: function(oldConfig) {
          let newConfig = oldConfig;
          let _esriLocatorRegExp = /http(s)?:\/\/geocode(.){0,3}\.arcgis.com\/arcgis\/rest\/services\/World\/GeocodeServer/g;
          for (let i = 0, len = newConfig.sources.length; i < len; i++) {
            let source = newConfig.sources[i];
            if (source.type === 'locator') {
              _esriLocatorRegExp.lastIndex = 0;
              source.enableLocalSearch = _esriLocatorRegExp.test(source.url);
              source.localSearchMinScale = 300000;
              source.localSearchDistance = 50000;
            }
          }

          return newConfig;
        }
      }];
    }

    VersionManager.prototype = new BaseVersionManager();
    VersionManager.prototype.constructor = VersionManager;
    return VersionManager;
  });
