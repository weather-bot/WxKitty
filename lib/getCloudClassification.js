'use strict';
const axios = require("axios");
const config = require("../config");

// We use "Leaky Bucket" method to control the works.
const POOL_LIMITATION = 10;

const CloudClassifyingException = {
    BodyError: 1,
    ClassifyError: 2,
    PoolLimitationError: 3
}

async function getCloudClassification(context) {
    const urlBase = config.cloudLadyUrl;
    const url = urlBase + "/api/classify";

    if(global.CLOUD_POOL_SIZE >= POOL_LIMITATION) {
        throw CloudClassifyingException.PoolLimitationError
    }
    
    if (context.id == "none") {
        throw Exception.BodyError;
    }
    
    try {
        global.CLOUD_POOL_SIZE += 1;
        const result = await axios.post(url, context);
        global.CLOUD_POOL_SIZE -= 1;
        return result.data;
    } catch (err) {
        console.log(err);
        global.CLOUD_POOL_SIZE -= 1;
        throw Exception.PoolLimitationError;
    }
}

module.exports = {
    getCloudClassification,
    CloudClassifyingException
};