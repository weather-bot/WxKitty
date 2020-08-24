const axios = require("axios");
const URL = require("../data/public_url.json");
const geodist = require('geodist');


async function getAreaAir(location, msg) {
    let replyMsg = '';
    let {
        lon,
        lat,
        realAreaName
    } = location;
    // if the target location is near to CWB station, use CWB data
    const stations = require('../data/air_stations_location.json');
    let distance = 1000;
    let SiteName = "";
    for (const stname in stations) {
        const dist = geodist({
            lat,
            lon
        }, stations[stname], {
            exact: true,
            unit: 'km'
        })
        // if distance between target and station less than 10km
        if (dist < 5 && distance > dist) {
            distance = dist;
            SiteName = stname;
        }
    }
    if (SiteName) {
        try {
            const res = await axios.get(`${URL.AIR_STATION_API_URL}`);
            const data = res.data;
            replyMsg += `搜尋： ${realAreaName}\n`;
            let isFind = false;
	    data.forEach(e => {
                    if (e.SiteName.includes(SiteName)) {
                        replyMsg = require('../message/parseAirStMsg')(e);
                    isFind = true;
                    }
                })
            replyMsg += `\n註：此為目標地區方圓 5 公里最近的測站`;
	    if (isFind) {
                return replyMsg;
            }
        } catch (err) {
            console.log("input text: ", msg, err);
            replyMsg = '取得資料失敗';
        }

    }

    return replyMsg;
}

module.exports.getAreaAir = getAreaAir;