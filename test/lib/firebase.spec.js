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
            const res = await dbWrite('tests/url', input);
            assert.equal(res.url, url);

            logger.info("test dbRead");
            const data = await dbRead('tests/url');
            assert.equal(data.url, url);

            logger.info("test dbRead null");
            const dataNull = await dbRead('testNull');
            assert.equal(dataNull, null);

            done();
        })();
    }).timeout(5000);
});