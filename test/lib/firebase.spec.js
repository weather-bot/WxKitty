'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    dbRead,
    dbWrite
} = require('../../lib/firebase');

describe('=== Check firebase ===', () => {
    it('Test firebase', done => {
        (async () => {
            const url = `http://example.com/${Math.floor(Math.random()*100)}`;

            logger.info("test dbWrite");
            const input = {
                url: url
            };
            const res = await dbWrite(input, 'tests');
            assert.equal(res.url, url);

            logger.info("test dbRead");
            const data = await dbRead('tests');
            assert.equal(data.url, url);

            done();
        })();
    }).timeout(5000);
});