const parseComfort = require('../lib/parseComfort.js');
function parseAreaWeatherMsg(e) {
    return `地區：${e.name}
時間：${e.time}
體感溫度：${e.feel}℃  ${parseComfort(e.temp, e.rh)}
溫度：${e.temp}℃
濕度：${e.rh}%
壓力：${e.pres}hPa
風速：${e.ws}m/s
風向：${e.wd}
雨量：${e.rain}mm
---
資料來源：Open Weather Map
註：欲得之鄉鎮市的精確資料，用「[測站]觀測」來查詢會更準`;
}

module.exports = parseAreaWeatherMsg;
