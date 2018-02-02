function parseAqi(aqi) {
    if (aqi < 50)
        return `良好`;
    else if (aqi < 100)
        return `普通`;
    else if (aqi < 150)
        return `對敏感族群不健康`;
    else if (aqi < 200)
        return `對所有族群不健康`;
    else if (aqi < 300)
        return `非常不健康`;
    else if (aqi > 300)
        return `危害`;
}

module.exports = parseAqi;