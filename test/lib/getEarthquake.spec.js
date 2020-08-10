'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const getEarthquake = require('../../lib/getEarthquake');

describe('=== Check getEarthquake ===', () => {
    it('Test getEarthquake', done => {
        (async () => {
            const res = await getEarthquake();
            logger.debug(res);
            assert.equal(res.includes("地震"), true);
            assert.equal(res.includes("/"), true); // include date
            done();
        })();
    }).timeout(10000);
});