'use strict';
const assert = require('assert');

const createAirImage = require('../../lib/createAirImage');

describe('=== Check createAirImage ===', () => {
    it('Test createAirImage', done => {
        (async () => {
            const base64Data = await createAirImage();
            assert.ok(base64Data);
            done();
        })();
    }).timeout(5000);
});