/**
 * @fileOverview 'Configurações gerais como porta da aplicação e configurações do usuário administrador'.
 */

module.exports = {
	/**
	* @desc O modulo com as configurações do Banco de desenvolvimento
     * @module config
     * @prop {string} config.port      - Porta no qual a aplicação vai rodar
     * @prop {object} config.admin      - Usuário administrador para validação, 
     * essas informações devem ser as mesmas com as colocadas no código da aplicação mobile
     * @prop {string} config.admin.user      - Nome do usuário do administrador da aplicação mobile
     * @prop {string} config.admin.password      - Senha do usuário do administrador da aplicação mobile
     */
    'port': 9203,
    'admin':{
    	'username':'admin',
    	'password':'adm!n'
    },
    'tinusConnection':'DRIVER={InterSystems ODBC35};SERVER=www2.tinus.com.br;PORT=56773;UID=tecgeoSJR;PWD=T3cG3@SJR;DATABASE=SAOJOSEDERIBAMAR;'
};
