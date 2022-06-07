var db = require('odbc')();

var config = require('../../../config.js');

/** iptu.dao.js **/

var tableName = 'TecGeo.BCFQ'

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

function fillList(whereCondition, debug) {
    return select('*', whereCondition, debug);
}

function count() {
    return select('count(*)').result[0].Aggregate_1;
}

function select(columns, whereCondition, debug) {
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
        return {error:null,result:result};
    } catch (e) {
        db.closeSync();
        return {error:e,result:[]};
    }
}

module.exports = DAO;
