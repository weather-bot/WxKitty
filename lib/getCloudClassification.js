'use strict';
const axios = require("axios");
const config = require("../config");

async function main(context) {
    const urlBase = config.cloudLadyUrl;
    const url = urlBase + "/api/classify";
    if(context.id == "none")
        return null;
    try{
        const result = await axios.post(url, context);
        return result.data;
    } catch(err) {
        console.log(err);
        return null;
    }
}

module.exports = main;