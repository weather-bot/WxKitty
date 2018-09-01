'use strict';
const assert = require('assert');
const {
    olamiSpeech
} = require('../../lib/olamiSpeech');
const path = require("path");

describe('=== Check olamiSpeech ===', () => {

    it('Test olamiSpeech', done => {
        (async () => {
            const txt = await olamiSpeech(path.join(__dirname, 'sample.wav'));
            assert.equal(txt, "你好");
            done();
        })()
    }).timeout(8000);

});