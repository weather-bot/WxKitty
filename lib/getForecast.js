const parser = require("xml2json");
const axios = require("axios");
const config = require('../config');
const parseForecastMsg = require('../message/parseForecastMsg');
const {
    isTaiwanArea,
    isTime
} = require('./keywords');

// CWB open data list
// http://opendata.cwb.gov.tw/datalist
const list = {
    "36hrCountyForecast": "F-C0032-001",
    "7dayCountyForecast": "F-C0032-005",
    "worldCityForecast": "F-C0032-007"
};

// The object fotamt return from this lib
const retObj = {
    area: "",
    time: "",
    weatherDescription: "",
    minTemp: "",
    maxTemp: "",
    feelingDesciption: "",
    rainProbability: "",
}

// main function in this lib
async function getForecast(msg) {
    const msgTime = isTime(msg);
    const taiwanArea = isTaiwanArea(msg);
    const date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    const currentEpoch = (new Date(utc + (3600000 * 8))).getTime();
    const deltaTime = msgTime.epoch - currentEpoch;
    if (taiwanArea != null) {
        // If time is in 36 hours
        if (deltaTime > 0 && deltaTime < 60 * 60 * 36 * 1000) {
            const obj = await get36hrForecast(taiwanArea.name, msgTime.epoch);
            if (obj != null) {
                return parseForecastMsg(obj);
            }
        }
    }
    return "查不到，目前只支援臺灣縣市的36小時內預報";
}

async function get36hrForecast(loc, epoch) {
    try {
        let ret = null;
        let data;
        const url = `http://opendata.cwb.gov.tw/opendataapi?` +
            `dataid=${list["36hrCountyForecast"]}&authorizationkey=${config.cwbKey}`;

        const res = await axios.get(url);
        const dataXml = res.data;

        const dataJson = JSON.parse(parser.toJson(dataXml));
        // ensure data is correct and successfully parse to json from xml
        try {
            data = dataJson.cwbopendata.dataset.location;
        } catch (parseErr) {
            console.log("parse xml to json fail : " + parseErr);
            return null;
        }

        data.forEach(e => {
            // there is three time in this api, id record what we should choose.
            let id;
            // choose county
            if (loc.includes(e.locationName)) {
                // choose time
                for (let i = 0; i < 3; i++) {
                    const startTime = (new Date(e.weatherElement[0].time[i].startTime)).getTime();
                    const endTime = (new Date(e.weatherElement[0].time[i].endTime)).getTime();
                    if (epoch < endTime && epoch > startTime) {
                        id = i;
                    }
                }
                ret = {};
                ret.area = e.locationName;
                ret.time = e.weatherElement[0].time[id].startTime;
                ret.weatherDescription = e.weatherElement[0]["time"][id].parameter.parameterName;
                ret.maxTemp = e.weatherElement[1]["time"][id].parameter.parameterName;
                ret.minTemp = e.weatherElement[2]["time"][id].parameter.parameterName;
                ret.feelingDesciption = e.weatherElement[3]["time"][id].parameter.parameterName;
                ret.rainProbability = e.weatherElement[4]["time"][id].parameter.parameterName;
            }
        })
        return ret;
    } catch (apiErr) {
        console.log("cwb api fail : " + apiErr);
        return null;
    }
}

module.exports = getForecast;