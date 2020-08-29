const axios = require("axios");
const URL = require("../data/public_url.json");
const geodist = require('geodist');
const getForeignAirData = require('../lib/getForeignAir');
const parseForeAirStMsg = require('../message/parseForeignAirMsg');


async function getAreaAir(location, foreignStation) {
    let replyMsg = '';
    let {
        lon,
        lat,
        realAreaName
    } = location;
    // if the target location is near to CWB station, use CWB data
    const stations = require('../data/air_stations_location.json');
    let distance = 5;
    let SiteId = "";
    for (const stid in stations) {
        const dist = geodist({
            lat,
            lon
        }, stations[stid], {
            exact: true,
            unit: 'km'
        })
        // if distance between target and station less than 10km
        if (dist < 5 && distance > dist) {
            distance = dist;
            SiteId = stid;
        }
    }
    //if found a station
    if (SiteId) {
        try {
            const res = await axios.get(`${URL.AIR_STATION_API_URL}`);
            const data = res.data.records;
            replyMsg += `搜尋： ${realAreaName}\n`;
            let isFind = false;
            data.forEach(e => {
                if (e.SiteId.includes(SiteId)) {
                    replyMsg = require('../message/parseAirStMsg')(e);
                    isFind = true;
                }
            })
            replyMsg += `\n註：此為目標地區方圓 5 公里最近的測站`;
            if (isFind) {
                return replyMsg;
            }
        } catch (err) {
            replyMsg = '取得資料失敗';
        }
    }
    // if didn't find a station, get data from foreign station
    try {
        const AirData = await getForeignAirData(foreignStation);
        if (AirData != null) {
            replyMsg = parseForeAirStMsg(AirData);
        } else {
            replyMsg = '外國地區取得資料失敗';
        }
    } catch (e) {
        console.log(e)
        replyMsg = `查不到此地區天氣資料`;
    }
    return replyMsg;
}

module.exports.getAreaAir = getAreaAir;
