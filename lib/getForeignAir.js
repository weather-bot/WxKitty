const axios = require("axios");
const config = require('../config')
const URL = require('../data/public_url.json');

async function getForeignAirData(loc) {
    try {
        const geo = [loc.geometry.location.lat, loc.geometry.location.lng];
        const url = `${URL.Air_Quality_API_URL}/geo:${geo[0]};${geo[1]}/?token=${config.AirQualityOpenDataPlatformToken}`;
        const res = await axios.get(url);
        const data = res.data.data;
        const ret = {
            "attribution": data.attributions[1].name,
            "ChineseName": loc.formatted_address,
            "EnglishName": data.city.name,
            "time": data.time.iso,
            "aqi": data.aqi,
            "CO": data.iaqi.co === undefined ? "--" : data.iaqi.co.v,
            "NO2": data.iaqi.no2 === undefined ? "--" : data.iaqi.no2.v,
            "SO2": data.iaqi.so2 === undefined ? "--" : data.iaqi.so2.v,
            "PM25": data.iaqi.pm25 === undefined ? "--" : data.iaqi.pm25.v,
            "PM10": data.iaqi.pm10 === undefined ? "--" : data.iaqi.pm10.v
        }; // show "--" when data are missing
        return ret;
    } catch (err) {
        console.log("getForeignAirData api fail : " + err);
        return null;
    }
}

module.exports = getForeignAirData;
