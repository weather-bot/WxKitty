'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    getAreaWeather,
} = require('../../lib/areaWeather');

describe('=== Check getAreaWeather ===', () => {
    it('Test getAreaWeather', done => {
        (async () => {
            const msg = await getAreaWeather("台北市");
            logger.debug(msg);
            assert.equal(msg.includes("地區"), true);
            done();
        })();
    }).timeout(5000);
    it('Test getAreaWeather', done => {
        (async () => {
            const msg = await getAreaWeather({
                name: "士林區",
                x: "121.5357813",
                y: "25.10390683"
            });
            logger.debug(msg);
            assert.equal(msg.includes("資料來源：中央氣象局"), true);
            done();
        })();
    }).timeout(5000);
});