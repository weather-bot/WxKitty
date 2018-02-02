function parseTime(epoch) {
    function format(val) {
        if (val < 10) {
            val = '0' + val;
        }
        return val;
    }
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    // zone time utc+8, and back 30 min to ensure the url is valid
    date = new Date(utc + (3600000 * 7.5));

    if (epoch) {
        date = new Date(epoch * 1000);
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