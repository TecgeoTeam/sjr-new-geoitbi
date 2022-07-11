define(['jimu/shared/BaseVersionManager'],
  function(BaseVersionManager) {
    function VersionManager() {
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
          return oldConfig;
        }
      }, {
        version: '1.4',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0Beta',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.0',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }, {
        version: '2.1',
        upgrader: function(oldConfig) {
          let newConfig = oldConfig;
          if (newConfig) {
            if (typeof newConfig.showArea === 'undefined') {
              newConfig.showArea = true;
            }
            if (typeof newConfig.showDistance === 'undefined') {
              newConfig.showDistance = true;
            }
            if (typeof newConfig.showLocation === 'undefined') {
              newConfig.showLocation = true;
            }
          }
          return newConfig;
        }
      }, {
        version: '2.2',
        upgrader: function(oldConfig) {
          return oldConfig;
        }
      }];
    }

    VersionManager.prototype = new BaseVersionManager();
    VersionManager.prototype.constructor = VersionManager;
    return VersionManager;
  });
