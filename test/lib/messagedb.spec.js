'use strict';

const assert = require('assert');
const messagedb = require('../../lib/messagedb');
const date2obj = require('date2obj');

describe('=== Check messagedb ===', () => {

    it('Test messagedb', done => {
        (async () => {
            const time = date2obj();
            const msg = `${time.year}-${time.month}-${time.day}-${time.hour}-${time.minute}-${time.second}`;
            const res = await messagedb.write(msg, 'tests/message')
            assert.equal(res, msg);
            done();
        })();
    }).timeout(10000);

});