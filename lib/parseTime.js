function format(val) {
    return val < 10 ? '0' + val : val;
}

function parseTime(epochSecond) {
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);

    // zone time utc+8, and back 30 min to ensure the url is valid
    date = new Date(utc + (3600000 * 7.5));

    if (epochSecond) {
        date = new Date(epochSecond * 1000);
    }

    const year = date.getFullYear();
    const month = format(date.getMonth() + 1);
    const day = format(date.getDate());
    const hour = format(date.getHours());
    const minute = format(Math.floor(date.getMinutes() / 10) * 10);

    return {
        year,
        month,
        day,
        hour,
        minute
    };
}

module.exports = parseTime;