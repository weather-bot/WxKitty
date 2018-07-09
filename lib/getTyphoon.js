const axios = require("axios");

async function getTyphoon() {
    let url = '';
    try {
        const res = await axios.get('https://www.cwb.gov.tw/V7/prevent/typhoon/Data/PTA_NEW/');
        const rawData = res.data;
        const tmp = rawData.split("imgs/products")[1];
        const latestID = tmp.split(".png")[0];
        const invalidChar = />|<|=|"|'/; // should not include these if parse succeed.
        if(invalidChar.test(latestID)){
            return null;
        }
        url = `https://www.cwb.gov.tw/V7/prevent/typhoon/Data/PTA_NEW/imgs/products${latestID}.png`;
    } catch (err) {
        console.log(err);
        return null;
    }
    return url;
}

module.exports = getTyphoon;