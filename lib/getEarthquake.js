const axios = require("axios");
const config = require('../config')
const { parseEarthquakeMsg } = require('../message/parseEarthquakeMsg')
const URL = require('../data/public_url.json');

async function getEarthquake() {
    const url_mild = `${URL.EARTHQUAKE_LOCAL_API_URL}E-A0016-001?Authorization=${config.cwbKey}`;
    const url_major = `${URL.EARTHQUAKE_LOCAL_API_URL}E-A0015-001?Authorization=${config.cwbKey}`;

    try {
        let data_mild = await axios.get(url_mild);
        data_mild = data_mild.data.records.earthquake;

        mildEarthquake = []
        data_mild.forEach(e => {
            // remove "。"
            mildEarthquake.push(e.reportContent.slice(0, -1))
        })

        let data_major = await axios.get(url_major);
        data_major = data_major.data.records.earthquake;

        majorEarthquake = []
        data_major.forEach(e => {
            majorEarthquake.push(e.reportContent.slice(0, -1))
        })
        if (majorEarthquake.length==0 && mildEarthquake.length ==0 ){
            return null;
        }
        return parseEarthquakeMsg(majorEarthquake, mildEarthquake)
    } catch (err) {
        console.log(err);
    }
}

module.exports = getEarthquake;