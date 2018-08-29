//'use strict';
const assert = require('assert');
const {
    getTpaSchoolRawData,
    findSchoolId
} = require('../../lib/getTpaSchoolApi');

describe('=== Check TpaSchoolAPI ===', () => {
    it('Test SchoolAPI', done => {
        (async () => {
            let ret = await getTpaSchoolRawData("北投國小");
            assert.equal(ret.學校名稱, "北投國小");
            done();
        })();
    }).timeout(5000);

    it('Test FindSchoolId', done => {
        assert.equal(findSchoolId("北投國小"), "423601");
        done();
    });
});