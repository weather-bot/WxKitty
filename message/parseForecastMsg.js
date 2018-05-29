function parseForecastMsg(e) {
    let res = `地區：${e.area}
時間：${e.time}
描述：${e.weatherDescription} ${e.feelingDesciption}
最高溫度：${e.maxTemp}℃
最低溫度：${e.minTemp}℃
`;
    if(e.rainProbability != undefined ) {
       res += `降雨機率：${e.rainProbability}%\n`
    }
    res += `---
資料來源：中央氣象局
`;
    return res;
} 

module.exports = parseForecastMsg;