"use strict";
const segment = require('./segment')

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
            if (area.county.includes(word)) {
                score += 5;
            }
            if (area.town.includes(word)) {
                score += 3;
            }
            if (area.village.includes(word)) {
                score += 1;
            }
        })
        const name = `${area.county}${area.town}${area.village}`;
        if ((result.name == '' && score > 0) ||
            (score >= 1 && score > result.score)) {
            result = {
                name,
                score,
                x: area.x,
                y: area.y
            };
        }
        if (score == 9 || score == 6 || score == 4) {
            return result;
        }
    });
    if (result.name == "") {
        return null;
    }
    return result;
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

function isWeather(msg) {
    const keywords = ["天氣", "氣溫", "溫度", "壓力", "氣壓", "濕度", "溼度", "風速", "風向", "雨量"];
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

module.exports.isTaiwanArea = isTaiwanArea;
module.exports.isObservation = isObservation;
module.exports.isAir = isAir;
module.exports.isAirStation = isAirStation;
module.exports.isWeather = isWeather;
module.exports.isFunny = isFunny;