'use strict';

const assert = require('assert');
const logger = require('node-color-log');
const {
    isObservation,
    isAirStation,
    isForeignAirStation,
    isWeather,
    isFunny,
    isTaiwanArea
} = require('../../lib/keywords');

describe('=== Check keywords ===', () => {
    it('Test isWeather', done => {
        assert.equal(isWeather("台北天氣"), "天氣");
        assert.equal(isWeather("台北氣溫"), "氣溫");
        done();
    });

    it('Test isAirStation', done => {
        assert.equal(isAirStation("古亭"), "古亭");
        assert.equal(isAirStation("士林"), "士林");
        assert.equal(isAirStation("公館"), null);
        done();
    });

    it('Test isForeignAirStation', done => {
        (async () => {
            let res = await isForeignAirStation("請告訴我紐約的空氣品質");
            let a =  "NY";
            assert.equal( res[0].address_components[1].short_name, a);
            done();
        })();
    }).timeout(10000);

    it('Test isObservation', done => {
        assert.equal(isObservation("鞍部"), "鞍部");
        assert.equal(isObservation("基隆"), "基隆");
        assert.equal(isObservation("美國"), null);
        done();
    });

    it('Test isFunny', done => {
        assert.notEqual(isFunny("新年"), null);
        assert.equal(isObservation("美國"), null);
        done();
    });

    it('Test isTaiwanArea', done => {
        let msg = "台北士林的天氣狀況";
        assert.equal(
            isTaiwanArea(msg).name.includes("臺北市士林區"),
            true,
            logger.debug(`${msg} & ${isTaiwanArea(msg).name}`)
        );
        msg = "我想知道桃園復興霞雲天氣";
        assert.equal(
            isTaiwanArea(msg).name.includes("桃園市復興區霞雲里"),
            true,
            logger.debug(`${msg} & ${isTaiwanArea(msg).name}`)
        );
        msg = "我想知道中壢天氣";
        assert.equal(
            isTaiwanArea(msg).name.includes("桃園市中壢區"),
            true,
            logger.debug(`${msg} & ${isTaiwanArea(msg).name}`)
        );
        msg = "現在臺南濕度";
        assert.equal(
            isTaiwanArea(msg).name.includes("臺南市"),
            true,
            logger.debug(`${msg} & ${isTaiwanArea(msg).name}`)
        );
        msg = "內湖的天氣";
        assert.equal(
            isTaiwanArea(msg).name.includes("臺北市內湖區"),
            true,
            logger.debug(`${msg} & ${isTaiwanArea(msg).name}`)
        );
        assert.equal(isTaiwanArea("美國紐約"), null);
        done();
    }).timeout(3000);
});