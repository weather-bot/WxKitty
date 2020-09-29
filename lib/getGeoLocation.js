const axios = require("axios");
const config = require('../config')
const URL = require('../data/public_url.json');
const {
    isTaiwanArea,
} = require('./keywords');

const GeoLocError = {
    HTTP_GEO_API_ERROR: 0,
}

async function getGeoLocation(locStr) {
    let lon = 0,
        lat = 0,
        realAreaName = '';

    let area = isTaiwanArea(locStr);
    // if area location is already known.
    if (area != null) {
        lat = area.y;
        lon = area.x;
        realAreaName = area.name;
    } else {
        realAreaName = locStr;
        // else use google api to find.
        try {
            const googleGeoUrl = encodeURI(`${URL.GOOGLE_GEO_API_URL}/json?address=${realAreaName}&key=${config.googleMapKey}`);
            let geoRes = await axios.get(googleGeoUrl, {
                headers: {
                    "accept-language": "zh-TW,zh-HK;q=0.8,zh;q=0.7,en-US;q=0.5,en;q=0.3"
                }
            });
            // try three times
            for (let i = 0; geoRes.data.results[0].geometry == undefined && i < 3; i++) {
                geoRes = await axios.get(googleGeoUrl);
            }
            lon = geoRes.data.results[0].geometry.location.lng;
            lat = geoRes.data.results[0].geometry.location.lat;
            realAreaName = geoRes.data.results[0].formatted_address;
        } catch (err) {
            console.log(err);
            throw GeoLocError.HTTP_GEO_API_ERROR;
        }
    }

    return {
        lon,
        lat,
        realAreaName
    };
}

module.exports = {
    getGeoLocation,
    GeoLocError
};
