const axios = require("axios");
const URL = require("../data/public_url.json");
const {
    isTaiwanArea
} = require("./keywords");

const OverviewException = {
    CANNOT_FIND_LOC: 0,
    DATA_FAILED: 1,
    UNKNOWN_ERROR: 2
}

async function getOverview(msg) {
    const table = require('../data/overviewID');
    const area = msg.split('概況')[0];
    let taiwanArea = "";
    if(area.includes("全台")){
        taiwanArea = "全台";
    } else {
        taiwanArea = isTaiwanArea(area);
    } 
    if (!taiwanArea) {
        throw OverviewException.CANNOT_FIND_LOC;  
    }
    for (areaID in table) {
        if (taiwanArea.name.includes(table[areaID])) {
            try {
                const res = await axios.get(`${URL.CWB_INTRO_URL_PRIFIX}/${areaID}.txt`);
                const data = res.data;
                text = data.replace(/<BR>/g, '\n');
                text = text.split('<div')[0];
            } catch (err) {
                console.log("input text: ", text);
                console.log(err);
                throw OverviewException.DATA_FAILED;
            }
            return text;
        }
    }
    throw OverviewException.UNKNOWN_ERROR;
}

module.exports = {
    OverviewException,
    getOverview
};