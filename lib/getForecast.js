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
    let msgTime = isTime(msg);
    if (msgTime == null) {
        msgTime = isTime("明天");
    }
    const taiwanArea = isTaiwanArea(msg);
    // Time Reference. Transfor Server time to Taiwan time.
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    date = new Date(utc + (3600000 * 8));
    const currentEpoch = date.getTime();
    const deltaTime = msgTime.epoch - currentEpoch;
    if (taiwanArea != null) {
        // If time is in 36 hours
        if (deltaTime > 0 && deltaTime < 60 * 60 * 36 * 1000) {
            const obj = await get36hrForecast(taiwanArea.name, msgTime);
            if (obj != null) {
                return parseForecastMsg.parse36HoursMsg(obj);
            }
            // If time is in 7 days
        } else if (deltaTime >= 60 * 60 * 36 * 1000 && deltaTime < 60 * 60 * 24 * 7 * 1000) {
            const obj = await get7dayForecast(taiwanArea.name, msgTime);
            if (obj != null) {
                return parseForecastMsg.parse7DaysMsg(obj);
            }
        }
        return "查不到此時間，目前只支援臺灣縣市的7天內預報。請試著縮短時間，例如明天14:00、後天早上等，或是改變時間表示法，5月23號可以寫5-23，因為套件支援英文輸入，23/5才是可辨識的英文輸入。";
    } else {
        return "查不到此地區，請輸入台灣行政區名稱。目前只支援臺灣縣市的36小時內預報";
    }
}

async function get36hrForecast(loc, msgTime) {
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
            let id = 0;
            // choose county
            if (loc.includes(e.locationName)) {
                // choose time
                for (let i = 0; i < 3; i++) {
                    const startTime = (new Date(e.weatherElement[0].time[i].startTime)).getTime();
                    const endTime = (new Date(e.weatherElement[0].time[i].endTime)).getTime();
                    if (msgTime.epoch < endTime && msgTime.epoch > startTime) {
                        id = i;
                        break;
                    }
                }
                ret = {};
                ret.area = e.locationName;
                ret.time = msgTime.time;
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

async function get7dayForecast(loc, msgTime) {
    try {
        let ret = null;
        let data;
        const url = `http://opendata.cwb.gov.tw/opendataapi?` +
            `dataid=${list["7dayCountyForecast"]}&authorizationkey=${config.cwbKey}`;

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
        const targetAreaData = data.filter(e => {
            return loc.includes(e.locationName);
        })[0];
        const allTimeData = targetAreaData.weatherElement[0].time;
        let id = allTimeData.findIndex(e => {
            const startTime = (new Date(e.startTime)).getTime();
            const endTime = (new Date(e.endTime)).getTime();
            return msgTime.epoch <= endTime && msgTime.epoch >= startTime;
        });
        id = (id < 0) ? 0 : id;
        const targetTimeData = allTimeData[id];

        ret = {};
        ret.area = targetAreaData.locationName;
        ret.time = msgTime.time;
        ret.weatherDescription = targetTimeData.parameter.parameterName;
        ret.maxTemp = targetAreaData.weatherElement[1]["time"][id].parameter.parameterName;
        ret.minTemp = targetAreaData.weatherElement[2]["time"][id].parameter.parameterName;
        ret.feelingDesciption = targetTimeData.parameter.parameterValue;

        return ret;
    } catch (apiErr) {
        console.log("cwb api fail : " + apiErr);
        return null;
    }
}
module.exports = getForecast;