'use strict';
const axios = require("axios");
const config = require('../config')
const date2obj = require('date2obj');
const URL = require('../data/public_url.json');
const parseComfort = require('./parseComfort');

const WeatherImgError = {
    HTTP_DARKSKY_ERROR: 0,
    HTTP_MEOW_ERROR: 1,
    UNKNOWN_ERROR: 2,
}

async function createWeatherImg(geo) {
    let info;
    let date = date2obj(new Date());
    try {
        const url = `${URL.DARKSKY_API_URL}/${config.darkSkyKey}/${geo.lat},${geo.lon}?lang=zh-tw&units=si`;
        const res = await axios.get(url);
        const data = res.data;
        let shortAreaName = geo.realAreaName.split(",")[0];
        shortAreaName = shortAreaName.replace(/\s/g, '');
        if (!/[A-Za-z\s]/.test(shortAreaName)) {
            shortAreaName = shortAreaName.slice(0, 3);
        } else if(shortAreaName.length > 8) {
            shortAreaName = shortAreaName.slice(0, 8);
        }
        info = {
            title: data.hourly.summary,
            time: `${date.month}/${date.day} ${date.hour}:${date.minute}`,
            location: shortAreaName,
            temp: Math.round(data.currently.temperature),
            humd: Math.round(data.currently.humidity),
            overview: data.currently.summary,
            overview2: parseComfort(data.currently.temperature, data.currently.humidity)
        };
    } catch (err) {
        console.log("Dark Sky API HTTP error: " + err);
        throw WeatherImgError.HTTP_DARKSKY_ERROR;
    }
    try {
        const url = URL.WXKITTY_API_URL + "/api/meow";
        const res = await axios.post(url, info);
        return `${URL.WXKITTY_API_URL}/img?uuid=${res.data.uuid}`;
    } catch (err) {
        console.log("Meow error: " + err);
        throw WeatherImgError.HTTP_MEOW_ERROR;
    }
}

module.exports = {
    createWeatherImg,
    WeatherImgError
};