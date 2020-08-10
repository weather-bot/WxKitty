'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const getForecast = require('../../lib/getForecast');

describe('=== Check getForecast ===', () => {
    it('Case 1: valid input', done => {
        (async () => {
            let msg = await getForecast("士林區明天的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺北市"), true);
            assert.equal(msg.includes("降雨機率"), true);

            msg = await getForecast("台中明天14:00天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺中市"), true);
            assert.equal(msg.includes("降雨機率"), true);

            msg = await getForecast("宜蘭明天預報");
            logger.debug(msg);
            assert.equal(msg.includes("宜蘭"), true);
            assert.equal(msg.includes("降雨機率"), true);

            // FIX: Once CWB foreign API is re-opened, uncomment this section
            // msg = await getForecast("紐約明天早上預報");
            // logger.debug(msg);
            // assert.equal(msg.includes("紐約"), true);
            // assert.equal(msg.includes("時間"), true);
            // msg = await getForecast("NEW YORK forecast");
            // logger.debug(msg);
            // assert.equal(msg.includes("New York"), true);
            // assert.equal(msg.includes("時間"), true);
            done();
        })();
    }).timeout(60000);

    it('Case 2: No Area', done => {
        (async () => {
            const msg = await getForecast("明天的天氣");
            assert.equal(msg.includes("查不到"), true);
            done();
        })();
    });

    it('Case 3: Weather within 3, 5, 6 days', done => {
        (async () => {
            let msg = await getForecast("臺北市後天的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("臺北市"), true);

            msg = await getForecast("苗栗五天後的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("苗栗"), true);

            msg = await getForecast("高雄市6天後的天氣");
            logger.debug(msg);
            assert.equal(msg.includes("高雄市"), true);
            done();
        })();
    }).timeout(30000);

    it('Case 4: Invalid Time', done => {
        (async () => {
            let msg = await getForecast("臺北市10天後天氣");
            assert.equal(msg.includes("查不到"), true);

            // FIX: Once CWB foreign API is re-opened, uncomment this section
            // msg = await getForecast("紐約後天的天氣");
            // logger.debug(msg)
            // assert.equal(msg.includes("查不到"), true);
            done();
        })();
    }).timeout(5000);
});