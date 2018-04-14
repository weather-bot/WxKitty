const date2obj = require('date2obj');

function parseTime(epochSecond) {
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // zone time utc+8, and back 30 min to ensure the url is valid
    date = new Date(utc + (3600000 * 7.5));

    // if give a certain time
    if (epochSecond) {
        date = new Date(epochSecond * 1000);
    }

    let time = date2obj(date);
    time.minute = Math.floor(time.minute / 10) * 10;
    if (time.minute == 0) {
        time.minute = "00";
    }
    return time;
}

module.exports = parseTime;