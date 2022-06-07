var enc2 = require("crypto-js/sha256");
var enc5 = require("crypto-js/sha512");
var md5s = require("crypto-js/md5");
var randomstring = require("randomstring");

module.exports.saltGen = async function () {
    var dateTime = Date.now();
    var saltRnd = await randomstring.generate() + dateTime;
    var salt = await enc2(saltRnd).toString();
    return salt;
}

module.exports.hashGen = async function (data, salt) {
    var hash = await enc5(data + salt).toString();
    return hash;
}

module.exports.fileNameGen = async function () {
    var dateTime = Date.now();
    var saltRnd = await randomstring.generate(50) + dateTime;
    var fileName = await md5s(saltRnd).toString();
    return fileName;
}

module.exports.idGen = async function (qntde) {
    var dateTime = Date.now();
    var saltRnd = await randomstring.generate(qntde) + dateTime;
    var newid = await md5s(saltRnd).toString();
    return newid;
}