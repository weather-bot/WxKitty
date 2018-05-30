function parseForeignForecastMsg(e) {
    return `地區：${e.area}
    開始時間：${e.Stime}
    結束時間：${e.Etime}
描述：${e.weatherDescription}
最高溫度：${e.maxTemp}℃
最低溫度：${e.minTemp}℃
---
資料來源：中央氣象局
`;
}

module.exports = parseForeignForecastMsg;