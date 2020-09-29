const parseComfort = require('../lib/parseComfort.js');
function parseObsStMsg(data) {
    let TEMP = data.weatherElement[3].elementValue == '-99' ? '因故無資料' : data.weatherElement[3].elementValue;
    let HUMD = data.weatherElement[4].elementValue == '-99' ? '因故無資料' : data.weatherElement[4].elementValue;
    let PRES = data.weatherElement[5].elementValue == '-99' ? '因故無資料' : data.weatherElement[5].elementValue;
    let WDIR = data.weatherElement[1].elementValue == '-99' ? '因故無資料' : data.weatherElement[1].elementValue;
    let WDSD = data.weatherElement[2].elementValue == '-99' ? '因故無資料' : data.weatherElement[2].elementValue;
    let H_24R = data.weatherElement[6].elementValue == '-99' ? '因故無資料' : data.weatherElement[6].elementValue;
    return res = `測站：${data.locationName}
時間：${data.time.obsTime}
體感溫度：${(TEMP - 0.55 * (1 - HUMD / 100) * (TEMP - 14)).toFixed(1)}℃  ${parseComfort(TEMP, HUMD)}
溫度：${TEMP}℃
濕度：${HUMD}%
壓力：${PRES}hPa
風速：${WDSD}m/s
風向：${WDIR}°
雨量：${H_24R}mm
---
資料來源：中央氣象局`
}

module.exports = parseObsStMsg;
