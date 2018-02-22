const axios = require("axios");
const config = require("../config");

async function dbRead(path) {
    const url = `https://${config.firebaseID}.firebaseio.com/${path}.json?auth=${config.firebaseSecret}`;
    try {
        const res = await axios.get(url);
        return res.data;
    } catch (err) {
        console.log(err.response);
        return null;
    }
}

async function dbWrite(path, data) {
    const url = `https://${config.firebaseID}.firebaseio.com/${path}.json?auth=${config.firebaseSecret}`;
    try {
         const res = await axios.put(url, data)
        return res.data;
    } catch (err) {
        console.log(err.response);
        return null;
    }
}

async function dbPush(_path, data) {
    const timestamp = new Date().getTime();
    const path = `${_path}/${timestamp}`;
    const url = `https://${config.firebaseID}.firebaseio.com/${path}.json?auth=${config.firebaseSecret}`;
    try {
        const res = await axios.put(url, data)
        return res.data;
    } catch (err) {
        console.log(err.response);
        return null;
    }
}

module.exports.dbRead = dbRead;
module.exports.dbWrite = dbWrite;
module.exports.dbPush = dbPush;