module.exports = {
    parse36HoursMsg: e => {
        return `地區：${e.area}
時間：${e.time}
描述：${e.weatherDescription} ${e.feelingDesciption}
最高溫度：${e.maxTemp}℃
最低溫度：${e.minTemp}℃
降雨機率：${e.rainProbability}%
---
資料來源：中央氣象局`;
    },

    parse48HoursMsg: e => {
        return `地區：${e.area}
時間：${e.time}
描述：${e.data[0]}
氣溫：${e.data[2].match(/\d+/)}℃
降雨機率：${e.data[1].match(/\d+/)}%
總體：${e.data[3]}
---
資料來源：中央氣象局`;
    },

    parse7DaysMsg: e => {
        let msg = `地區：${e.area}
時間：${e.time}`
        let data = e.data
        data.forEach(e => {
            msg += e + '\n'
        })
        msg += "---\n資料來源：中央氣象局"
        return msg
    },

    parseForeignForecastMsg: e => {
        return `地區：${e.area}
時間：${e.time}
描述：${e.weatherDescription}
最高溫度：${e.maxTemp}℃
最低溫度：${e.minTemp}℃
---
資料來源：中央氣象局`;
    }
}