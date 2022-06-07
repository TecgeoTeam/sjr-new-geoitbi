var Service = require('node-windows').Service;
 
// Create a new service object
var svc = new Service({
  name:'Geo_Integration',
  description: 'Serviço de integração do geoitbi',
  script: 'C:\\projetos\\geo_integration_jb\\server.js'
});
 
// Listen for the "install" event, which indicates the
// process is available as a service.
svc.on('install',function(){
  svc.start();
});
 
svc.install();