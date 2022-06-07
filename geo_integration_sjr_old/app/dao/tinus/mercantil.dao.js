var db = require('odbc')();

var config = require('../../../config.js');

/** bairro.dao.js **/

var tableName = 'TecGeo.MERCANTILFISICO';

var DAO = function(list) {
    this.list = list;
}


DAO.prototype.list = [];
DAO.prototype.select = select;
DAO.prototype.fillList = fillList;
DAO.prototype.fillListWithTop = fillListWithTop;
DAO.prototype.count = count;


function fillListWithTop(max) {
    if (max) {
        return select('top ' + max + ' *');
    }

}

function fillList(whereCondition, tableJoin, columnsJoin, debug) {
    var columns;
    if(tableJoin && columnsJoin){
        columns = tableName+'.*, '+tableJoin+'.NU_COD_BAIRRO';
    } else{
        columns = '*'
    }
    return select(columns, whereCondition, tableJoin, columnsJoin, debug);
}

function count() {
    return select('count(*)')[0].Aggregate_1;
}

function select(columns, whereCondition, tableJoin, columnsJoin, debug) {
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
}

module.exports = DAO;
