const date2obj = require('date2obj');

function parseTime(epochSecond) {
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // zone time utc+8, and back 30 min to ensure the url is valid
    date = new Date(utc + (3600000 * 7.5));

    if (epochSecond) {
        date = new Date(epochSecond * 1000);
    }

    return date2obj(date);
}

module.exports = parseTime;