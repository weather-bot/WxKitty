'use strict';
const axios = require("axios");
const config = require("../config");
const URL = require("../data/public_url.json");

const maxSize = 15 * 1000; // 15 MB

const LineException = {
    API_ERROR: 1,
    FILE_LIMIT_EXCEEDED: 2,
}

async function getLineContent(id) {
    try {
        const res = await axios({
            method: 'get',
            url: `${URL.LINE_BOT_API_BASE_URL}/message/${id}/content`,
            responseType: 'arraybuffer',
            headers: {
                'Authorization': `Bearer ${config.channelAccessToken}`
            }
        });
        const data = res.data;
        if (data.length > maxSize)
            throw LineException.FILE_LIMIT_EXCEEDED;
        return data;
    } catch (err) {
        console.log(err)
        throw LineException.API_ERROR;
    }
}

module.exports = {
    getLineContent,
    LineException
};