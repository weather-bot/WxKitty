const axios = require("axios");
const URL = require('../data/public_url.json');

async function getTyphoon() {
    let url = '';
    try {
        url = `${URL.CWB_TYPHOON_IMG_URL}`;
    } catch (err) {
        console.log(err);
        return null;
    }
    return url;
}

module.exports = getTyphoon;