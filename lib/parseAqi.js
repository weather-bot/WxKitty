function parseAqi(aqi) {
    if (aqi < 50)
        return `空氣良好`;
    else if (aqi < 100)
        return `空氣普通`;
    else if (aqi < 150)
        return `空氣有點糟`;
    else if (aqi < 200)
        return `空氣很糟`;
    else if (aqi < 300)
        return `空氣超糟`;
    else if (aqi > 300)
        return `空氣危害`;
}

module.exports = parseAqi;