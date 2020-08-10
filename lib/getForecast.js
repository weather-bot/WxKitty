const parser = require("xml2json");
const axios = require("axios");
const config = require('../config');
const parseForecastMsg = require('../message/parseForecastMsg');
const countyID = require("../data/CWB_county_ID.json")
const {
    isTaiwanArea,
    isTime,
    isForeignForecastArea
} = require('./keywords');

// CWB open data list
// http://opendata.cwb.gov.tw/datalist
const list = {
    "36hrCountyForecast": "F-C0032-001",
    "7dayCountyForecast": "F-C0032-005",
    "worldCityForecast": "F-C0032-007"
};

// The object fotamt return from this lib
// const retObj = {
//     area: "",
//     time: "",
//     weatherDescription: "",
//     minTemp: "",
//     maxTemp: "",
//     feelingDesciption: "",
//     rainProbability: "",
// }

// main function in this lib
async function getForecast(msg) {
    let msgTime = isTime(msg);
    if (msgTime == null) {
        msgTime = isTime("明天");
    }
    const taiwanArea = isTaiwanArea(msg);
    const foreignArea = isForeignForecastArea(msg)
    // Time Reference. Transfor Server time to Taiwan time.
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    date = new Date(utc + (3600000 * 8));
    const currentEpoch = date.getTime();
    const deltaTime = msgTime.epoch - currentEpoch;
    if (taiwanArea != null) {
        // If time is in 36 hours
        if (deltaTime > 0 && deltaTime < 60 * 60 * 36 * 1000) {
            const obj = await get48hrForecast(taiwanArea, msgTime);
            if (obj != null) {
                return parseForecastMsg.parse48HoursMsg(obj);
            }
            // If time is in 7 days
        } else if (deltaTime >= 60 * 60 * 36 * 1000 && deltaTime < 60 * 60 * 24 * 7 * 1000) {
            const obj = await get7dayForecast(taiwanArea, msgTime);
            if (obj != null) {
                return parseForecastMsg.parse7DaysMsg(obj);
            }
        }
        return "查不到此時間，目前只支援臺灣縣市的7天內預報。請試著縮短時間，例如明天14:00、後天早上等，或是改變時間表示法，5月23號可以寫5-23，因為套件支援英文輸入，23/5才是可辨識的英文輸入。";
    } else if (foreignArea != null) {

        return "目前未開放國外氣象資料查詢，請期待未來更新！"
        // FIX: Once CWB foreign API is re-opened, uncomment this section
        // // If msg includes foreign city name and time is in 24 hours
        // if (new Date(msgTime.epoch).getDate() == (date.getDate() + 1)) {
        // const obj = await getForeignForcast(foreignArea, msgTime);
        // if (obj != null) {
        // return parseForecastMsg.parseForeignForecastMsg(obj);
        // } else {
        // return "取得資料失敗，請稍後在試";
        // }
        // }
        // return "查不到此時間，目前只支援外國城市24小時內預報。請試著縮短時間，例如明天14:00，或是改變時間表示法，5月23號可以寫5-23，因為套件支援英文輸入，23/5才是可辨識的英文輸入。";
    } else {
        return "查不到此地區，請輸入台灣行政區名稱或外國城市名。目前只支援外國城市24小時內和臺灣縣市的7天內預報。";
    }
}

// Decrapted due to the unstable CWD 36hr forecast API.
async function get36hrForecast(loc, msgTime) {
    try {
        let ret = null;
        let data;
        const url = `https://opendata.cwb.gov.tw/opendataapi?` +
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

async function get48hrForecast(loc, msgTime) {
    try {
        let ret = null;
        let data;
        const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/` +
            `${countyID[loc.county][0]}?Authorization=${config.cwbKey}&elementName=WeatherDescription`;

        const res = await axios.get(url);
        const dataJson = res.data;
        //console.log(dataJson)

        // ensure data is correct and successfully parse to json from xml
        try {
            data = dataJson.records.locations[0].location;
        } catch (parseErr) {
            console.log("parse xml to json fail : " + parseErr);
            return null;
        }

        data.forEach(e => {
            // there is three time in this api, id record what we should choose.
            let id = 0;
            // choose county
            if (loc.name.includes(e.locationName)) {
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
                ret.area = loc.county + e.locationName;
                ret.time = msgTime.time;
                let dsp = weatherDescription = e.weatherElement[0]["time"][id].elementValue[0].value;
                ret.data = dsp.split('。')
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
        const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/` +
        `${countyID[loc.county][1]}?Authorization=${config.cwbKey}&elementName=WeatherDescription`;

        const res = await axios.get(url);
        const dataJson = res.data;

        // ensure data is correct and successfully parse to json from xml
        try {
            data = dataJson.records.locations[0].location;
        } catch (parseErr) {
            console.log("parse xml to json fail : " + parseErr);
            return null;
        }
        const targetAreaData = data.filter(e => {
            return loc.name.includes(e.locationName);
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
        ret.area = loc.county + targetAreaData.locationName;
        ret.time = msgTime.time;
        let dsp = weatherDescription = targetTimeData.elementValue[0].value;
        ret.data = dsp.split('。')

        return ret;
    } catch (apiErr) {
        console.log("cwb api fail : " + apiErr);
        return null;
    }
}

// FIX: CWB foreign API is not yet opened
async function getForeignForcast(city, msgTime) {
    try {
        const url = `https://opendata.cwb.gov.tw/api/v1/rest/datastore/` +
            `${list["worldCityForecast"]}?Authorization=${config.cwbKey}&elementName=WeatherDescription`;
        const res = await axios.get(url);
        const dataJson = res.data;
        try {
            data = dataJson.records.locations[0].location;
        } catch (parseErr) {
            console.log("parse foreign xml to json fail : " + parseErr);
            return null;
        }

        let location = dataJson.cwbopendata.dataset.location;
        let forecast = {};
        location.forEach(e => {
            if (e.locationName == city[0]) {
                forecast = {
                    "area": `${city[0]} ${city[1]}`,
                    "time": msgTime.time,
                    "weatherDescription": e.weatherElement[0].time.parameter.parameterName,
                    "maxTemp": e.weatherElement[1].time.parameter.parameterName,
                    "minTemp": e.weatherElement[2].time.parameter.parameterName
                }
            }
        });
        return forecast;
    } catch (apiErr) {
        console.log("cwb foreign api fail : " + apiErr);
        return null;
    }
}

module.exports = getForecast;