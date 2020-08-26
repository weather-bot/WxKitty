'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    getAreaAir,
} = require('../../lib/areaAir');

describe('=== Check getAreaAir ===', () => {
    it('use CWB station', done => {
        (async () => {
            const msg = await getAreaAir({
                lon: "121.5361352",
                lat: "25.13101919",
                realAreaName: "天母里"
            });
            logger.debug(msg);
            assert.equal(msg.includes("資料來源：環保署"), true);
            done();
        })();
    }).timeout(5000);
});
