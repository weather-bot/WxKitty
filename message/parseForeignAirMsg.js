const parseAqi = require('../lib/parseAqi');

function parseForeAirStMsg(e) {
    return `地點：${e.ChineseName} 
　　　${e.EnglishName} 
時間：${e.time} 
空氣指標AQI：${parseAqi(e.aqi)} 
PM10：${e.PM10}(μg/m3) 
PM2.5：${e.PM25}(μg/m3) 
CO：${e.CO}(ppm) 
SO2：${e.SO2}(ppb) 
NO2：${e.NO2}(ppb)
---
資料來源：${e.attribution}`;
}

module.exports = parseForeAirStMsg;
