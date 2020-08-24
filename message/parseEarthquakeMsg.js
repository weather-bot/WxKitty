function parseEarthquakeMsg(majorList, mildList){
    let res = ""
    if (majorList.length != 0){
        res += "近日較大地震:\n"
        majorList.forEach(e => {
            res += "⦿ " + e + '\n'
        })
    }
    if (mildList.length != 0){
        res += "近日一般地震:\n"
        mildList.forEach(e => {
            res += "⦿ " + e + '\n'
        })
    }

    res += "---\n資料來源:中央氣象局"
    return res
}

module.exports.parseEarthquakeMsg = parseEarthquakeMsg;