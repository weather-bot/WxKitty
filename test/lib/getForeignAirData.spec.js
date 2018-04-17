'use strict';
const assert = require('assert');
const logger = require('node-color-log');

// third parties
const axios = require("axios");

describe('=== Check ForeignAirAPI ===', () => {
    it('Test ForeignAirAPI', done => {
        (async ()=> {
            assert.equal( await test() , "Shanghai");
            done();
        })();
    }).timeout(10000);
});

async function test ()  {
    try{
        let url = "https://api.waqi.info/api/feed/@"+"1437"+"/now.json";
        url = encodeURI(url);
        const res = await axios.get(url);
        return res.data.rxs.obs[0].msg.city.name;
    }catch(err){
        console.log(err);
    }
    return null;
}