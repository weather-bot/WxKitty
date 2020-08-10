const axios = require("axios");

async function checkUrl(url) {
    try {
        await axios.get(url);
        return true;
    } catch (error) {
        return false;
    }
}

module.exports = checkUrl;