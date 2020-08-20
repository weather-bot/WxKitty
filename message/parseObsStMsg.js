function parseObsStMsg(data) {
    const elementsWanted = {
        'obsTime': '時間：{}',
        'TEMP': '溫度：{}℃', 
        'HUMD': '濕度：{}%',
        'PRES': '壓力：{}hPa',
        'WDSD': '風速：{}m/s',
        'WDIR': '風向：{}',
        'H_24R': '雨量：{}mm'
    }
    var reg = /{\w*}/
    var res = `測站：${data.locationName}\n`
    data.weatherElement.forEach(e => {
        if (elementsWanted[e.elementName] != null) {
            res += elementsWanted[e.elementName].replace(reg, e.elementValue) + '\n'
        }
    });

    res += `---
資料來源：中央氣象局`;
    return res
}

module.exports = parseObsStMsg;
