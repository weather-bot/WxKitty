"use strict";
// third parties
const segment = require('./segment');
const axios = require("axios");
const chrono = require("chrono-node-zh");
const config = require("../config");
const URL = require('../data/public_url.json');

function isTime(msg) {
    // Time Reference. Transfor Server time to Taiwan time.
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    date = new Date(utc + (3600000 * 8));

    // Get the utc time from message refers to Taiwan time
    const timeInfo = chrono.parse(msg, date)[0];
    if (timeInfo == undefined) {
        return null;
    }
    // new time in Taiwan epoch
    const epoch = new Date(timeInfo.start.date().getTime());
    return {
        text: timeInfo.text,
        epoch: epoch,
        time: epoch.toLocaleString('zh-TW', {
            timeZone: 'UTC'
        })
    };
}

function isTaiwanArea(msg) {
    const areas = require('../data/taiwanAreaName');
    const inputWords = segment(msg);
    let result = {
        score: 0,
        name: ''
    };
    areas.forEach(area => {
        let score = 0;
        inputWords.forEach(w => {
            const word = w.replace(/台/g, '臺');
            // area name has at least two characters
            if (word.length >= 2) {
                if (area.county.includes(word)) {
                    score += 5;
                }
                if (area.town.includes(word)) {
                    score += 3;
                }
                if (area.village.includes(word)) {
                    score += 1;
                }
            }
        })
        const name = `${area.county}${area.town}${area.village}`;
        if ((result.name == '' && score > 0) ||
            (score >= 1 && score > result.score)) {
            result = {
                name,
                score,
                county: area.county,
                town: area.town,
                x: area.x,
                y: area.y
            };
        }
        if (score == 9 || score == 8 || score == 6 || score == 4) {
            return result;
        }
    });
    if (result.name == "") {
        return null;
    }
    return result;
}

function isForeignForecastArea(msg) {
    const areas = require('../data/ForeignCityName')
    let result = '';
    msg = msg.replace(/\s/g, '').toLowerCase();
    areas.forEach(e => {
        const t = e.replace(/\s/g, '').toLowerCase();
        if (msg.includes(t)) {
            result = e;
        }
    });
    if (result != '') {
        let pat = new RegExp("[A-Za-z]+");
        // result =  [ ChineseCityName, ForeignCityName ]
        if (pat.test(result))
            result = [areas[areas.indexOf(result) - 1], result];
        else {
            result = [result, areas[areas.indexOf(result) + 1]];
        }
        return result;
    }
    return null;
}

function isObservation(msg) {
    let result = null;
    const data = require('../data/observation');
    data.forEach(e => {
        if (msg.includes(e)) {
            result = e;
        }
    })
    return result;
}

function isAirStation(msg) {
    let result = null;
    const data = require('../data/air');
    data.forEach(e => {
        if (msg.includes(e)) {
            result = e;
        }
    })
    return result;
}

async function isForeignAirStation(msg) {
    try {
        //send url
        let url = `${URL.GOOGLE_GEO_API_URL}/json?address=${msg}&key=${config.googleMapKey}`;
        url = encodeURI(url);
        const res = await axios.get(url, {
            headers: {
                "accept-language": "zh-TW,zh-HK;q=0.8,zh;q=0.7,en-US;q=0.5,en;q=0.3"
            }
        });
        //return the first result
        if (res.data.results != []) {
            return res.data.results[0];
        } else {
            return null;
        }
    } catch (err) {
        console.log("isForeignStation Google api fail :" + err);
        return null;
    }
}

function isWeather(msg) {
    const keywords = [
        "天氣", "氣溫", "溫度", "壓力", "氣壓", "濕度", "溼度", "風", "雨量",
        "weather", "temperature", "wind", "humidity", "pressure", "precipitation",
        "喵喵", "豬豬"
    ];
    let result = null;
    keywords.forEach(e => {
        if (msg.includes(e)) {
            result = e;
        }
    });
    return result;
}

function isAir(msg) {
    const keywords = ["空污", "空汙", "空氣", "pm2.5", "pm10", "呼吸", "口罩", "air"];
    let result = null;
    keywords.forEach(e => {
        if (msg.includes(e)) {
            result = e;
        }
    });
    return result;
}

function isFunny(msg) {
    const keywords = require('../data/funny');
    let result = "";
    for (const keyword in keywords) {
        if (msg.includes(keyword)) {
            const anwsers = keywords[keyword];
            result += anwsers[Math.floor(Math.random() * anwsers.length)] + "\n";
        }
    }
    if (result == "") {
        result = null;
    }
    return result;
}

function isForecast(msg) {
    const keywords = ["預報", "下雨", "傘", "forecast", "rain"];
    let result = null;
    keywords.forEach(e => {
        if (msg.includes(e)) {
            result = e;
        }
    });
    return result;
}


module.exports.isTaiwanArea = isTaiwanArea;
module.exports.isObservation = isObservation;
module.exports.isAir = isAir;
module.exports.isAirStation = isAirStation;
module.exports.isForeignAirStation = isForeignAirStation;
module.exports.isWeather = isWeather;
module.exports.isFunny = isFunny;
module.exports.isTime = isTime;
module.exports.isForecast = isForecast;
module.exports.isForeignForecastArea = isForeignForecastArea;
