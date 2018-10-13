'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
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
        info = {
            title: data.hourly.summary,
            time: `${date.month}/${date.dat} ${date.hour}:${date.minute}`,
            location: geo.realAreaName,
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
        const urlBase = config.cloudLadyUrl;
        const url = urlBase + "/api/meow";
        const res = await axios.post(url, info);
        return `${urlBase}/img?${res.data.uuid}`;
    } catch (err) {
        console.log("Meow error: " + err);
        throw WeatherImgError.HTTP_MEOW_ERROR;
    }
}

module.exports = {
    createWeatherImg,
    WeatherImgError
};