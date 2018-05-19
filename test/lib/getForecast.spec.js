'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const  getForecast = require('../../lib/getForecast');

describe('=== Check getForecast ===', () => {
    it('Case 1: valid input', done => {
        (async () => {
            let msg = await getForecast("士林區明天的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺北市"), true);
            assert.equal(msg.includes("降雨機率"), true);

            msg = await getForecast("台中明天的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺中市"), true);
            assert.equal(msg.includes("降雨機率"), true);

            msg = await getForecast("宜蘭明天晚上預報");
            logger.debug(msg);
            assert.equal(msg.includes("宜蘭"), true);
            assert.equal(msg.includes("降雨機率"), true);
            done();
        })();
    }).timeout(16000);

    it('Case 2: No Area', done => {
        (async () => {
            const msg = await getForecast("明天的天氣");
            assert.equal(msg.includes("查不到"), true);
            done();
        })();
    }).timeout(5000);

    it('Case 3: Invalid Time', done => {
        (async () => {
            const msg = await getForecast("臺北市後天的天氣");
            assert.equal(msg.includes("查不到"), true);
            done();
        })();
    }).timeout(1000);
});