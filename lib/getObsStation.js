const axios = require("axios");
const URL = require("../data/public_url.json");
const config = require("../config");

const ObsStException = {
    DATA_ERROR: 0,
    NO_STATION: 1
}

async function getObsStation(msg) {
    const locationName = msg.split('觀測')[0];
    try {
        const res = await axios.get(`${URL.OBS_STATION_API_URL}?Authorization=${config.cwbKey}`);
        const data = res.data.records.location;
        const results = [];
        let result = null;
        //  find candidates stations
        data.forEach(e => {
            if (e.locationName.includes(locationName)) {
                results.push(e);
            }
        })
        // choose candidates for precise name
        results.forEach(e => {
            if (e.locationName == locationName) {
                result = e;
            }
        })
        // choose candidates for approximative name
        results.forEach(e => {
            if (e.locationName.includes(locationName)) {
                result = e;
            }
        });
        if (!result)
            throw ObsStException.NO_STATION;
        return result;
    } catch (err) {
        console.log(err);
        throw ObsStException.DATA_ERROR;
    }
}

module.exports = {
    ObsStException,
    getObsStation
};