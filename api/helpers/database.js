const { Pool } = require('pg')
const sql = require('mssql')

module.exports = {
    
    async connection(){
       
        const pool = new Pool({
            user: 'postgres',
            host: '107.180.106.82',
            database: 'geoitbi_sjr_admin',
            password: 'C0d#%4f3075c0d#KUpg15v$nu5TejBv073@xzS84L&svcGM!goLTecGv12$asK',
            port: 52120
        });

        return await pool;
    },

    async connectionSenografia(){
        const pool = new sql.ConnectionPool({
            server: 'www.senocwb.com',
            database: 'sjr_cadastro',
            port: 54000,
            authentication: { type: 'default', options: { userName: 'sa', password: '%pandora1414%' } },
            options: {
                enableArithAbort: true,
                encrypt: false
            }
        });


        return await pool.connect();;
    }
    
}