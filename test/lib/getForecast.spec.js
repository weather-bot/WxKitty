'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const  getForecast = require('../../lib/getForecast');

describe('=== Check getForecast ===', () => {
    it('Case 1', done => {
        (async () => {
            const msg = await getForecast("士林區明天的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺北市"), true);
            assert.equal(msg.includes("降雨機率"), true);
            done();
        })();
    }).timeout(4000);

    it('Case 2: No Area', done => {
        (async () => {
            const msg = await getForecast("明天的天氣");
            assert.equal(msg.includes("查不到"), true);
            done();
        })();
    }).timeout(4000);

    it('Case 3: Invalid Time', done => {
        (async () => {
            const msg = await getForecast("臺北市後天的天氣");
            assert.equal(msg.includes("查不到"), true);
            done();
        })();
    }).timeout(4000);
});