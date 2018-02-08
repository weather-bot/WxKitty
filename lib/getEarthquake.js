const {
    dbRead,
    dbWrite
} = require('./firebase');
const axios = require("axios");
const imagedb = require('./imagedb');

async function getEarthquake() {
    let url = '';
    try {
        let latestID = '';
        const res = await axios.get('http://www.cwb.gov.tw/V7/modules/MOD_EC_Home.htm');
        const rawData = res.data;
        const tmp = rawData.split(".htm")[0];
        latestID = tmp.split("ECL")[1];
        latestID = "ECL" + latestID;
        url = await imagedb('earthquake', latestID, `http://www.cwb.gov.tw/V7/earthquake/Data/local/${latestID}.gif`)
    } catch (err) {
        console.log(err);
        url = null;
    }
    return url;
}

module.exports = getEarthquake;