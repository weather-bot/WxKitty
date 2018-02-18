'use strict';
const assert = require('assert');
const logger = require('node-color-log');

const createAirImage = require('../../lib/createAirImage');

describe('=== Check createAirImage ===', () => {
    it('Test createAirImage', done => {
        (async () => {
            const url = await createAirImage();
            logger.debug(url);
            assert.ok(url);
            done();
        })();
    }).timeout(10000);
});