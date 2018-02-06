'use strict';

const logger = require('node-color-log');
const assert = require('assert');

const {
    read,
    write
} = require('../../lib/firebase');

describe('=== Check firebase ===', () => {
    it('Test firebase', done => {
        (async () => {
            const url = `http://example.com/${Math.floor(Math.random()*100)}`;

            logger.info("test write");
            const input = {
                url: url
            };
            const res = await write(input, 'tests');
            assert.equal(res.url, url);

            logger.info("test read");
            const data = await read('tests');
            assert.equal(data.url, url);

            done();
        })();
    }).timeout(5000);
});