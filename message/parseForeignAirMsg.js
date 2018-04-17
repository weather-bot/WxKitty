
function parseObsStMsg(e,idX) {
    return `地點：${idX.name[0]} 
時間：${e.time.s} 
空氣指標：${parseAqi(e.aqi)} 
---
資料來源：http://aqicn.org/
更多資訊：${e.city.url}
`;
}

module.exports = parseObsForeStMsg;