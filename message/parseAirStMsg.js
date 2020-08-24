const parseAqi = require('../lib/parseAqi');

function parseObsStMsg(e) {
    return `測站：${e.SiteName} 
時間：${e.PublishTime} 
空氣指標：${parseAqi(e.AQI)} 
PM10：${e.PM10}(μg/m3) 
PM2.5：${e["PM2.5"]}(μg/m3) 
CO：${e.CO}(ppm) 
SO2：${e.SO2}(ppb) 
NO2：${e.NO2}(ppb)
---
資料來源：環保署`;
}

module.exports = parseObsStMsg;