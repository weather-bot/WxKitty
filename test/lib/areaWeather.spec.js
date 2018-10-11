'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    getAreaWeather,
} = require('../../lib/areaWeather');

describe('=== Check getAreaWeather ===', () => {
    it('Case 1: Open Weather Map', done => {
        (async () => {
            const msg = await getAreaWeather({
                realAreaName: "東京都",
                lon: "139.69181",
                lat: "35.689381"
            });
            logger.debug(msg);
            assert.equal(msg.includes("Open Weather Map"), true);
            done();
        })();
    }).timeout(5000);
    it('Case 2: use CWB station', done => {
        (async () => {
            const msg = await getAreaWeather({
                realAreaName: "士林區",
                lon: "121.5357813",
                lat: "25.10390683"
            });
            logger.debug(msg);
            assert.equal(msg.includes("資料來源：中央氣象局"), true);
            done();
        })();
    }).timeout(5000);
});