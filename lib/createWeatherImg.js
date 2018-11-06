'use strict';
const axios = require("axios");
const config = require('../config')
const date2obj = require('date2obj');
const URL = require('../data/public_url.json');
const parseComfort = require('./parseComfort');
const uploadImgur = require('./uploadImgur');

const WeatherImgError = {
    HTTP_DARKSKY_ERROR: 0,
    HTTP_MEOW_ERROR: 1,
    UNKNOWN_ERROR: 2,
    HTTP_IMGUR_ERROR: 3,
}

async function createWeatherImg(geo) {
    let info;
    // use Taiwna time
    const d = new Date();
    const utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    const date = date2obj(new Date(utc + (3600000 * 8)));
    try {
        const url = `${URL.DARKSKY_API_URL}/${config.darkSkyKey}/${geo.lat},${geo.lon}?lang=zh-tw&units=si`;
        const res = await axios.get(url);
        const data = res.data;
        let shortAreaName = geo.realAreaName.split(",")[0];
        shortAreaName = shortAreaName.replace(/\s/g, '');
        if (!(/[A-Za-z\s]/).test(shortAreaName)) {
            shortAreaName = shortAreaName.slice(0, 3);
        } else if (shortAreaName.length > 6) {
            shortAreaName = shortAreaName.slice(0, 6);
        }
        // hard fix to fit the max length of overview
        let overview = data.currently.summary;
        if (overview.length > 4) {
            overview = overview.slice(0, 2) + overview.slice(overview.length - 2, overview.length);
        }
        info = {
            title: data.hourly.summary,
            time: `${date.month}/${date.day} ${date.hour}:${date.minute}`,
            location: shortAreaName,
            temp: Math.round(data.currently.temperature),
            humd: Math.round(data.currently.humidity * 100),
            overview,
            overview2: parseComfort(data.currently.temperature, data.currently.humidity)
        };
    } catch (err) {
        console.log("Dark Sky API HTTP error: " + err);
        throw WeatherImgError.HTTP_DARKSKY_ERROR;
    }
    try {
        const url = URL.WXKITTY_API_URL + "/api/meow";
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