function parseSchool (schoolRawData){
    return `學校名稱：${schoolRawData.學校名稱}
    開始時間：${schoolRawData.開始時間}
    結束時間：${schoolRawData.結束時間}
    最高溫：${schoolRawData.最高溫}(℃)
    最低溫：${schoolRawData.最低溫}(℃)
    酷熱指數：${schoolRawData.酷熱指數} (℃)
    降雨量：${schoolRawData.降雨量}(mm)
    濕度：${schoolRawData.濕度}(%)
    輻射：${schoolRawData.輻射}(w/m²)
    紫外線指數：${schoolRawData.紫外線}
    風向：${schoolRawData.風向}(°)
    風速：${schoolRawData.風速}(m/s)
    氣壓：${schoolRawData.氣壓}(hPa)
    -------------
    資料來源：臺北市校園數位氣象網`
}

module.exports = parseSchool;