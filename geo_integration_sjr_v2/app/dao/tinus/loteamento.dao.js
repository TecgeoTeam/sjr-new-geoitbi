var db = require('odbc');

var config = require('../../../config.js');

/** bairro.dao.js **/

var tableName = 'TecGeo.Loteamentos';

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

async function fillList(whereCondition, debug) {
    var qry = await select('*', whereCondition, debug);
    return qry;
}

async function count() {
    var qry = await select('count(*)');
    return qry[0].Aggregate_1;
}

/*function select(columns, whereCondition, debug) {
    try {
        var query = 'select ' + columns + ' from ' + tableName;
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

async function select(columns, whereCondition, debug) {
    try {
        var query = 'select ' + columns + ' from ' + tableName;
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
