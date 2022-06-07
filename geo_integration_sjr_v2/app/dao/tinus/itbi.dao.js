var db = require('odbc');

var config = require('../../../config.js');

/** bairro.dao.js **/

var tableName = 'TecGeo.ITBI';

var DAO = function(list) {
    this.list = list;
}


DAO.prototype.list = [];
DAO.prototype.select = select;
DAO.prototype.fillList = fillList;
DAO.prototype.fillListWithTop = fillListWithTop;
DAO.prototype.count = count;


async function fillListWithTop(max) {
    if (max) {
        var qry = await select('top ' + max + ' *');
        return qry;
    }
}

async function fillList(whereCondition, tableJoin, columnsJoin, debug) {
    var columns;
    if(tableJoin && columnsJoin){
        columns = tableName+'.*, '+tableJoin+'.NU_COD_BAIRRO';
    } else{
        columns = '*'
    }
    var qry = await select(columns, whereCondition, tableJoin, columnsJoin, debug);
    return qry;
}

async function count() {
    var qry = await select('count(*)');
    return qry[0].Aggregate_1;
}



/*function select(columns, whereCondition, tableJoin, columnsJoin, debug) {
    try {
        var query = 'select ' + columns + ' from ' + tableName;
        if(tableJoin && columnsJoin){
            query += ' LEFT JOIN '+tableJoin+ ' ON '+tableJoin+'.'+columnsJoin+'='+tableName+'.'+columnsJoin
        }
        if (whereCondition) {
            query += ' where ' + whereCondition;
        }
        if(debug){
           console.log(query); 
        }
        
        db.openSync(config.tinusConnection);
        var result = db.querySync(query);
        db.closeSync();
        return result;
    } catch (e) {

        console.log(e.message);
        db.closeSync();
    }
}*/


async function select(columns, whereCondition, tableJoin, columnsJoin, debug) {
    try {
        var query = 'select ' + columns + ' from ' + tableName;
        if(tableJoin && columnsJoin){
            query += ' LEFT JOIN '+tableJoin+ ' ON '+tableJoin+'.'+columnsJoin+'='+tableName+'.'+columnsJoin
        }
        if (whereCondition) {
            query += ' where ' + whereCondition;
        }
        if(debug){
           console.log(query); 
        }
        
        const connection = await db.connect(config.tinusConnection);
        const result = await connection.query(query);
        await connection.close();
        return result;
    } catch (e) {
        console.log(e.message);
        return;
    }
}
module.exports = DAO;