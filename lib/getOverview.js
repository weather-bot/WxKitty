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
    let taiwanArea = {};
    if ((/全(台|臺)/).test(area)) {
        taiwanArea.name = "全臺";
    } else {
        taiwanArea = isTaiwanArea(area);
    }
    if (!taiwanArea) {
        throw OverviewException.CANNOT_FIND_LOC;
    }

    const res = await axios.get(`${URL.TAIWAN_OVERALL}`);
    const data = res.data;
    let text = "";
    let cityDatas = data.split("tbody")[1]; // match(/<tbody>((?:\n|.)*)<\/tbody>)/) //(/<tbody>((\n|.)*)<\/tbody>/)[1]
        //console.log(cityDatas)
        cityDatas = cityDatas.split("<tr>");
        delete cityDatas[0];
    if (taiwanArea.name == "全臺"){
        cityDatas.forEach(e => {
            text += parseHTML(e) + '\n';
        });
    } else {
        for (let i in cityDatas){
            if (cityDatas[i].includes(taiwanArea.county)){
                text = parseHTML(cityDatas[i]);
                break;
            }
        }
    }
    if (text.length < 3){
        throw OverviewException.UNKNOWN_ERROR;
    }
    return text;
}

function parseHTML(e){
    let lines = e.match(/<td.*<\/td>/g)
    let res = ""
    res += lines[0].match(/>(.{1,4})</)[1] + " "
    res += lines[1].match(/>(.{2,5})</)[1] + "°C "
    res += lines[2].match(/title=\"(.*)\"/)[1] + " "
    res += "降雨機率" +lines[4].match(/>(.{1,4})</)[1]

    return res
}

module.exports = {
    OverviewException,
    getOverview
};