const axios = require("axios");
const imagedb = require('./imagedb');
const URL = require('../data/public_url.json');

async function getEarthquake() {
    let url = '';
    try {
        let latestID = '';
        const res = await axios.get(URL.EARTHQUAKE_SITE_URL);
        const rawData = res.data;
        const tmp = rawData.split(".htm")[0];
        latestID = tmp.split("EC")[1];
        latestID = "EC" + latestID;
        const cwbImgUrl = latestID.includes("ECL") ?
            `${URL.EARTHQUAKE_LOCAL_IMG_API_URL}/${latestID}.gif` :
            `${URL.EARTHQUAKE_QUAKE_IMG_API_URL}/${latestID}.gif`;
        url = await imagedb('earthquake', latestID, cwbImgUrl)
    } catch (err) {
        console.log(err);
        url = null;
    }
    return url;
}

module.exports = getEarthquake;