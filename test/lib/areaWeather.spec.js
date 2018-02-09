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
});