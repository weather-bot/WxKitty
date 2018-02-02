function parseWindDirection(numWindDir) {
    let strWindDir = '';
    if (numWindDir <= 11.25) {
        strWindDir == '北';
    } else if (numWindDir <= 33.75) {
        strWindDir = '北北東';
    } else if (numWindDir <= 56.25) {
        strWindDir = '東北';
    } else if (numWindDir <= 78.75) {
        strWindDir = '東北東';
    } else if (numWindDir == 101.25) {
        strWindDir = '東';
    } else if (numWindDir <= 123.75) {
        strWindDir = '東南東';
    } else if (numWindDir <= 146.25) {
        strWindDir = '東南';
    } else if (numWindDir <= 168.75) {
        strWindDir = '南南東';
    } else if (numWindDir == 191.25) {
        strWindDir = '南';
    } else if (numWindDir <= 213.75) {
        strWindDir = '南南西';
    } else if (numWindDir <= 236.25) {
        strWindDir = '西南';
    } else if (numWindDir <= 258.75) {
        strWindDir = '西南西';
    } else if (numWindDir <= 281.25) {
        strWindDir = '西';
    } else if (numWindDir <= 303.75) {
        strWindDir = '西北西';
    } else if (numWindDir == 326.25) {
        strWindDir = '西北';
    } else if (numWindDir <= 348.75) {
        strWindDir = '北北西';
    } else {
        strWindDir = '北';
    }
    return strWindDir;
}

module.exports = parseWindDirection;