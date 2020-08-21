const axios = require("axios");
const URL = require("../data/public_url.json");
const parseWindDirection = require('./parseWindDirection');
const parseTime = require('./parseTime');
const geodist = require('geodist');
const config = require("../config");

async function getAreaWeather(location) {
    let replyMsg = '';

    let {
        lon,
        lat,
        realAreaName
    } = location;
    // if the target location is near to CWB station, use CWB data
    const stations = require('../data/CWB_stations_location.json');
    let distance = 1000;
    let stationId = "";
    for (const stid in stations) {
        const dist = geodist({
            lat,
            lon
        }, stations[stid], {
            exact: true,
            unit: 'km'
        })
        // if distance between target and station less than 10km
        if (dist < 5 && distance > dist) {
            distance = dist;
            stationId = stid;
        }
    }
    if (stationId) {
        try {
            const res = await axios.get(`${URL.OBS_STATION_API_URL}?Authorization=${config.cwbKey}`);
            const data = res.data.records.location
            replyMsg += `搜尋： ${realAreaName}\n`;
            let isFind = false;
            data.forEach(e => {
                if (e.stationId == stationId) {
                    replyMsg += require('../message/parseObsStMsg')(e);
                    isFind = true;
                }
            })
            replyMsg += `\n註：此為目標地區方圓 5 公里最近的測站`;
            if (isFind) {
                return replyMsg;
            }
        } catch (error) {
            console.log(error)
            replyMsg = `查詢失敗，請再試一次`;
        }
    }

    // if no station near by or cannot find data in CWB api, use openweather api to get weather
    try {
        const openWeatherMaprUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.owmApiKey}`;
        const res = await axios.get(openWeatherMaprUrl);
        const data = res.data;
        const d = parseTime(data.ts);
        const newData = {};
        newData['name'] = realAreaName;
        newData['time'] = `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`;
        newData['rain'] = data.rain == undefined ? 0 : (data.rain["3h"] / 3).toFixed(2);
        newData['temp'] = data.main.temp;
        newData['rh'] = data.main.humidity;
        newData['ws'] = data.wind.speed;
        newData['feel'] = Math.round(1.07 * newData['temp'] +
            0.2 * newData['rh'] / 100 * 6.105 *
            Math.pow(2.71828, (17.27 * newData['temp'] / (237.7 + newData['temp']))) -
            0.65 * newData['ws'] - 2.7);
        newData['wd'] = newData['ws'] == 0 ? '-' : parseWindDirection(data.wind.deg);
        newData['pres'] = data.main.pressure;
        replyMsg = require('../message/parseAreaWeatherMsg')(newData);
    } catch (e) {
        console.log(e)
        replyMsg = `查不到此地區天氣資料`;
    }

    return replyMsg;
}

module.exports.getAreaWeather = getAreaWeather;