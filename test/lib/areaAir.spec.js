'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    getAreaAir,
} = require('../../lib/areaAir');
const {
    isForeignAirStation
} = require('../../lib/keywords')

describe('=== Check getAreaAir ===', () => {
    it('Case 1: taiwan area use CWB station', done => {
        (async () => {
            const foreignStation = await isForeignAirStation("天母里");
            const msg = await getAreaAir({
                lon: "121.5361352",
                lat: "25.13101919",
                realAreaName: "天母里"
            }, foreignStation);
            logger.debug(msg);
            assert.equal(msg.includes("資料來源：環保署"), true);
            done();
        })();
    }).timeout(5000);
    it('Case 2: taiwan area use foreign station', done => {
        (async () => {
            const foreignStation = await isForeignAirStation("深坑區");
            const msg = await getAreaAir({
                lon: "121.6091939",
                lat: "24.98573162",
                realAreaName: "深坑區"
            }, foreignStation);
            logger.debug(msg);
            assert.equal(msg.includes("空氣指標AQI："), true);
            done();
        })();
    }).timeout(5000);
});
