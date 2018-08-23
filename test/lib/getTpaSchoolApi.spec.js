//'use strict';
const assert = require('assert');
const logger = require('node-color-log');
const {
    getTpaSchoolRawData,
    findSchoolId
} = require('../../lib/getTpaSchoolApi');

// third parties
const axios = require("axios");


describe('=== Check TpaSchoolAPI ===', () => {
    it('Test SchoolAPI', done => {
        (async () => { 
            let ret = await getTpaSchoolRawData("423601");
            assert.equal(ret.學校名稱, "北投國小");
            done();
        })();
    }).timeout(5000);

    it('Test FindSchoolId', done => {
        (async () => { 
            assert.equal(findSchoolId("北投國小"), "423601");
            done();
        })();
    }).timeout(5000);
});