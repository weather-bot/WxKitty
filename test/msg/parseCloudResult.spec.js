'use strict';

const assert = require('assert');
const parse = require('../../message/parseCloudResult');

describe('=== Test parseCloudResult ===', () => {

    it('Test response', done => {
            const response = getRes();
            const msg = parse(response);
            console.log(msg);
            assert.equal(msg.includes("「高積雲」"), true);
            done();
    });

});

function getRes() {
    return [{
        "score": "0.70",
        "name": "altocumulus"
    }, {
        "score": "0.23",
        "name": "cirrus"
    }, {
        "score": "0.04",
        "name": "stratocumulus"
    }, {
        "score": "0.02",
        "name": "stratus"
    }, {
        "score": "0.01",
        "name": "cumulonimbus"
    }, {
        "score": "0.00",
        "name": "altostratus"
    }, {
        "score": "0.00",
        "name": "cirrocumulus"
    }, {
        "score": "0.00",
        "name": "cumulus"
    }, {
        "score": "0.00",
        "name": "nimbostratus"
    }, {
        "score": "0.00",
        "name": "cirrostratus"
    }];
}