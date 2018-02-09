'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const getEarthquake = require('../../lib/getEarthquake');

describe('=== Check getEarthquake ===', () => {
    it('Test getEarthquake', done => {
        (async () => {
            const url = await getEarthquake();
            logger.debug(url);
            assert.equal(url.includes("https://"), true);
            assert.notEqual(url, null);
            done();
        })();
    }).timeout(10000);
});