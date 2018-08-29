const axios = require("axios");
const URL = require('../data/public_url.json');

async function getTyphoon() {
    let url = '';
    try {
        const res = await axios.get(URL.CWB_TYPHOON_SITE_URL);
        const rawData = res.data;
        const tmp = rawData.split("imgs/products")[1];
        const latestID = tmp.split(".png")[0];
        const invalidChar = />|<|=|"|'/; // should not include these if parse succeed.
        if (invalidChar.test(latestID)) {
            return null;
        }
        url = `${URL.CWB_TYPHOON_IMG_URL}/products${latestID}.png`;
    } catch (err) {
        console.log(err);
        return null;
    }
    return url;
}

module.exports = getTyphoon;