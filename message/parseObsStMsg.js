function parseObsStMsg(e) {
    return `測站：${e.name}
時間：${e.time}
溫度：${e.temp}℃
體感溫度：${e.feel}℃
濕度：${e.humd}%
壓力：${e.pres}hPa
風速：${e.ws}m/s
風向：${e.wd}
雨量：${e.rain}mm
---
資料來源：中央氣象局`;
}

module.exports = parseObsStMsg;