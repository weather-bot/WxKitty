const axios = require("axios");
const config = require("../config");

async function dbRead(path) {
    const url = `https://${config.firebase}.firebaseio.com/${path}.json?auth=${config.firebaseSecret}`;
    try {
        res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

async function dbWrite(data, path) {
    const url = `https://${config.firebase}.firebaseio.com/${path}.json?auth=${config.firebaseSecret}`;
    try {
        res = await axios.put(url, data)
        return res.data;
    } catch (err) {
        console.log(err);
        return null;
    }
}

module.exports.dbRead = dbRead;
module.exports.dbWrite = dbWrite;