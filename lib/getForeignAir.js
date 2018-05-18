const axios = require("axios");
const config = require('../config')

async function getForeignAirData(loc) {
    try {
        const geo = [loc.geometry.location.lat, loc.geometry.location.lng];
        const url = `https://api.breezometer.com/baqi/${geo[0]},${geo[1]}?key=${config.breezometerKey}`;
        const res = await axios.get(url);
        const data = res.data;
        const ret = {
            "ChineseName": loc.formatted_address,
            "EnglishName": data.country_name,
            "time": data.datetime,
            "aqi": data.country_aqi,
            "CO": data.pollutants.co.concentration,
            "NO2": data.pollutants.no2.concentration,
            "SO2": data.pollutants.so2.concentration,
            "PM25": data.pollutants.pm25.concentration,
            "PM10": data.pollutants.pm10.concentration
        };
        return ret;
    } catch (err) {
        console.log("getForeignAirData breezometer api fail : " + err);
        return null;
    }
}

module.exports = getForeignAirData;