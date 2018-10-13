'use strict';
const axios = require("axios");
const URL = require('../data/public_url.json');

// We use "Leaky Bucket" method to control the works.
const POOL_LIMITATION = 10;

const CloudClassifyingException = {
    BodyError: 1,
    ClassifyError: 2,
    PoolLimitationError: 3
}

async function getCloudClassification(context) {
    const url = URL.WXKITTY_API_URL + "/api/classify";

    console.log("Pool size: ", global.CLOUD_POOL_SIZE);

    if (global.CLOUD_POOL_SIZE >= POOL_LIMITATION) {
        throw CloudClassifyingException.PoolLimitationError
    }

    if (context.id == "none") {
        throw CloudClassifyingException.BodyError;
    }

    try {
        global.CLOUD_POOL_SIZE += 1;
        const result = await axios.post(url, context);
        global.CLOUD_POOL_SIZE -= 1;
        return result.data;
    } catch (err) {
        console.log(err);
        global.CLOUD_POOL_SIZE -= 1;
        throw CloudClassifyingException.ClassifyError;
    }
}

module.exports = {
    getCloudClassification,
    CloudClassifyingException
};