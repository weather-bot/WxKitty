'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    getAreaWeather,
} = require('../../lib/areaWeather');

describe('=== Check getAreaWeather ===', () => {
    it('Case 1: Open Weather Map', done => {
        (async () => {
            const msg = await getAreaWeather("東京都");
            logger.debug(msg);
            assert.equal(msg.includes("Open Weather Map"), true);
            done();
        })();
    }).timeout(5000);
    it('Case 2: use CWB station', done => {
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
    it('Case 3: Stations List\'s ID is not in CWB API', done => {
        (async () => {
            const msg = await getAreaWeather({
                name: "公館鄉",
                x: "120.8248492",
                y: "24.49698261"
            });
            logger.debug(msg);
            assert.equal(msg.includes("Open Weather Map"), true);
            done();
        })();
    }).timeout(5000);
});