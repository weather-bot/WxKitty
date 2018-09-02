'use strict';
const assert = require('assert');
const {
    olamiSpeech,
    OlamiException
} = require('../../lib/olamiSpeech');
const path = require("path");

describe('=== Check olamiSpeech ===', () => {

    it('Test olamiSpeech', done => {
        (async () => {
            const txt = await olamiSpeech(path.join(__dirname, 'sample.wav'), "path");
            assert.equal(txt, "你好");
            done();
        })()
    }).timeout(10000);

    it('Test olamiSpeech wrong type', done => {
        (async () => {
            try {
                await olamiSpeech(path.join(__dirname, 'sample.wav'), "image");
            } catch (err) {
                assert.equal(err, OlamiException.INPUT_TYPE_ERROR);
            }
            done();
        })()
    });

    it('Test olamiSpeech wrong file path', done => {
        (async () => {
            try {
                await olamiSpeech('testing-nothing', "path");
            } catch (err) {
                assert.equal(err, OlamiException.FILE_ERROR);
            }
            done();
        })()
    });

});