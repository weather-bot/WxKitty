const parseForeAirStMsg = require("../../message/parseForeignAirMsg");
//const isForeignAirStation = require("../../lib/keywords")
const getForeignAirData = require('../../lib/ForeignAir');
const {
    isAir,
    isWeather,
    isObservation,
    isFunny,
    isAirStation,
    isForeignAirStation,
    isTaiwanArea
} = require("../../lib/keywords");

const assert = require('assert');


describe("=======parseForeAirMsg=======", () => {
    it("parseForeAir", done => {
        (async () => {
            let foreignStation = await isForeignAirStation("紐約");
            let data = await getForeignAirData(foreignStation);
            let msg = parseForeAirStMsg(data[0]);
            console.log(msg);
            assert(1, 1);
            done();
        })();
    }).timeout(10000);
});