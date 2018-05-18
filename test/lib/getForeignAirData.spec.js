//'use strict';
const assert = require('assert');
const logger = require('node-color-log');
const getForeignAirData = require('../../lib/getForeignAir');

// third parties
const axios = require("axios");

describe('=== Check ForeignAirAPI ===', () => {
    it('Test ForeignAirAPI', done => {
        (async () => {
            const loc = {
                "address_components": [{
                    "long_name": "紐約",
                    "short_name": "紐約",
                    "types": ["locality", "political"]
                }, ],
                "formatted_address": "美國紐約州紐約",
                "geometry": {
                    "location": {
                        "lat": 40.7127753,
                        "lng": -74.0059728
                    },
                },
            };
            let res = [{}];
            let apiReturn = await getForeignAirData(loc)
            assert.equal(apiReturn.toString(), res.toString());
            done();
        })();
    }).timeout(10000);
});