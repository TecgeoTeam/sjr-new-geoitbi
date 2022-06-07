var db = require('odbc')();

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


function fillListWithTop(max) {
    if (max) {
        return select('top ' + max + ' *');
    }

}

function fillList(whereCondition, debug) {
    return select('*', whereCondition, debug);
}

function count() {
    return select('count(*)')[0].Aggregate_1;
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
        return result;
    } catch (e) {

        console.log(e.message);
        db.closeSync();
    }
}

module.exports = DAO;
