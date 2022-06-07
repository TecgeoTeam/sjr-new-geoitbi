var http = require('http');
var app = require('./router');

var httpServer = http.createServer(app);

let port = 6010;

httpServer.listen(port, () => {
	console.log('Geoportal de ITBI iniciado na porta '+port);
});