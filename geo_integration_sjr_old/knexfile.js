/**
 * @fileOverview Configurações do banco de desenvolvimento e produção.
 */

/**
 * @module knexfile
 */
module.exports = {
    /**
     * @desc Configurações do Banco de desenvolvimento
     * @prop {string} knexfile.development.client      - Nome do cliente do banco de dados
     * @prop {object} knexfile.development.connection      - Informações de conexão
     * @prop {string} knexfile.development.connection.user      - Nome do usuário do banco de dados
     * @prop {string} knexfile.development.connection.password      - Senha do usuário do banco de dados
     * @prop {string} knexfile.development.connection.database      - Nome do banco de dados
     * @prop {object} knexfile.development.pool      -  Configuração inicializa um pool de conexão
     * @prop {object} knexfile.development.pool.min      -  Valor mínimo
     * @prop {object} knexfile.development.pool.max      -  Valor máximo
     */

    development: {
        client: 'postgresql',
        connection: {
            host: '93.188.166.2',
            user: 'postgres',
            password: 'adminpostgres',
            database: 'geointegrationsjr',
            port: '5432',
            connectTimeout: 180000
        },
        pool: {
            min: 0,
            max: 100,
            ping: function (conn, cb) { conn.query('SELECT 1', cb); },
            createTimeoutMillis: 30000,
            acquireTimeoutMillis: 300000,
            idleTimeoutMillis: 300000,
            reapIntervalMillis: 100000,
            createRetryIntervalMillis: 1000,
            propagateCreateError: false  
        },
        acquireConnectionTimeout: 300000
    },
    geoAuth: {
        client: 'postgresql',
        connection: {
            host: '93.188.166.2',
            user: 'postgres',
            password: 'adminpostgres',
            database: 'geointegrationsjr',
            port: '5432',
            connectTimeout: 180000
        },
        pool: {
            min: 0,
            max: 100,
            ping: function (conn, cb) { conn.query('SELECT 1', cb); },
            createTimeoutMillis: 30000,
            acquireTimeoutMillis: 300000,
            idleTimeoutMillis: 300000,
            reapIntervalMillis: 100000,
            createRetryIntervalMillis: 1000,
            propagateCreateError: false  
        },
        acquireConnectionTimeout: 300000
    },

    /**
     * @desc Configurações do Banco de produção
     * @prop {string} knexfile.production.client      - Nome do cliente do banco de dados
     * @prop {object} knexfile.production.connection      - Informações de conexão
     * @prop {string} knexfile.production.connection.user      - Nome do usuário do banco de dados
     * @prop {string} knexfile.production.connection.password      - Senha do usuário do banco de dados
     * @prop {string} knexfile.production.connection.database      - Nome do banco de dados
     * @prop {object} knexfile.production.pool      -  Configuração inicializa um pool de conexão
     * @prop {object} knexfile.production.pool.min      -  Valor mínimo
     * @prop {object} knexfile.production.pool.max      -  Valor máximo
     */
    financas: {
        client: 'mssql',
        connection: {
            host: 'www.senocwb.com',
            user: 'sa',
            password: '%pandora1414%',
            database: 'sjr_cadastro',
            port: 54000,
            connectTimeout: 180000
        },
        pool: {
            min: 0,
            max: 100,
            ping: function (conn, cb) { conn.query('SELECT 1', cb); },
            createTimeoutMillis: 30000,
            acquireTimeoutMillis: 300000,
            idleTimeoutMillis: 300000,
            reapIntervalMillis: 100000,
            createRetryIntervalMillis: 1000,
            propagateCreateError: false,  
        },
        acquireConnectionTimeout: 300000
    }
    // financas: {
    //     client: 'mssql',
    //     connection: {
    //         host: 'localhost',
    //         user: 'sa',
    //         password: 'adminsql',
    //         database: 'sjr_cadastro',
    //         port: 1433,
    //         connectTimeout: 180000
    //     },
    //     pool: {
    //         min: 0,
    //         max: 100,
    //         ping: function (conn, cb) { conn.query('SELECT 1', cb); },
    //         createTimeoutMillis: 300000,
    //         acquireTimeoutMillis: 300000,   
    //         idleTimeoutMillis: 300000,
    //         reapIntervalMillis: 100000,
    //         createRetryIntervalMillis: 1000,
    //         propagateCreateError: false,  
    //     },
    //     acquireConnectionTimeout: 300000
    // }

};
