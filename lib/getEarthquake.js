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
        latestID = tmp.split("EC")[1];
        latestID = "EC" + latestID;
        const cwbImgUrl = latestID.includes("ECL") ?
            `http://www.cwb.gov.tw/V7/earthquake/Data/local/${latestID}.gif` :
            `http://www.cwb.gov.tw/V7/earthquake/Data/quake/${latestID}.gif`;
        url = await imagedb('earthquake', latestID, cwbImgUrl)
    } catch (err) {
        console.log(err);
        url = null;
    }
    return url;
}

module.exports = getEarthquake;