'use strict';
const axios = require("axios");
const config = require('../config')
const date2obj = require('date2obj');
const URL = require('../data/public_url.json');
const parseComfort = require('./parseComfort');
const uploadImgur = require('./uploadImgur');
const parseAqi = require('./parseAqi');


const WeatherImgError = {
    HTTP_DARKSKY_ERROR: 0,
    HTTP_MEOW_ERROR: 1,
    UNKNOWN_ERROR: 2,
    HTTP_IMGUR_ERROR: 3,
    HTTP_AIR_ERROR: 4,
}

async function createWeatherImg(geo, specialFlag) {
    let info = {
        title: "",
        time: "",
        location: "",
        temp: 0,
        humd: 0,
        overview: "",
        overview2: ""
    };
    // use Taiwan time
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const date = date2obj(new Date(utc + (3600000 * 8)));

    try {
        const url = `${URL.BREEZOMETER_API_URL}/${geo.lat},${geo.lon}?key=${config.breezometerKey}`;
        const res = await axios.get(url);
        const data = res.data;
        info.overview = parseAqi(data.country_aqi);
    } catch (e) {
        console.log("Air API HTTP error: " + e);
        throw WeatherImgError.HTTP_AIR_ERROR;
    }

    try {
        const url = `${URL.DARKSKY_API_URL}/${config.darkSkyKey}/${geo.lat},${geo.lon}?lang=zh-tw&units=si`;
        const res = await axios.get(url);
        const data = res.data;
        let shortAreaName = geo.realAreaName.split(",")[0];

        info.title = (data.hourly.summary.split("。")[0]).split("，")[0];
        info.time = `${date.month}/${date.day}`;
        info.location = shortAreaName;
        info.temp = Math.round(data.currently.temperature);
        info.humd = Math.round(data.currently.humidity * 100);
        info.overview2 = parseComfort(data.currently.temperature, data.currently.humidity);
    } catch (err) {
        console.log("Dark Sky API HTTP error: " + err);
        throw WeatherImgError.HTTP_DARKSKY_ERROR;
    }
    try {
        let url;
        // detect special flag in order to choose the mode
        if (specialFlag == "chinese") {
            url = URL.WXKITTY_API_URL + "/api/chinese";
        } else {
            url = URL.WXKITTY_API_URL + "/api/meow";
        }
        const res = await axios.post(url, info);
        const img = await uploadImgur(`${URL.WXKITTY_API_URL}/img?uuid=${res.data.uuid}`);
        if (img != null)
            return img;
        else
            throw WeatherImgError.HTTP_IMGUR_ERROR;
    } catch (err) {
        console.log("Meow error: " + err);
        throw WeatherImgError.HTTP_MEOW_ERROR;
    }
}

module.exports = {
    createWeatherImg,
    WeatherImgError
};