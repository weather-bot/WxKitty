// third parties
const axios = require("axios");
const parseTime = require('../lib/parseTime');
const imagedb = require('../lib/imagedb');
const URL = require('../data/public_url.json');
const messagedb = require('../lib/messagedb');
const getForeignAirData = require('../lib/getForeignAir');
const parseForeAirStMsg = require('../message/parseForeignAirMsg');
const parseSchool = require('../message/parseTpaSchoolMsg');
const getForecast = require('../lib/getForecast');
const {
    getGeoLocation,
    GeoLocError
} = require("../lib/getGeoLocation");
const {
    platformReplyText,
    platformReplyImage
} = require("./crossPlatformHandle");
const {
    isAir,
    isWeather,
    isFunny,
    isAirStation,
    isForeignAirStation,
    isTime,
    isForecast,
    isSchool
} = require('../lib/keywords');
const {
    OverviewException,
    getOverview
} = require('../lib/getOverview');
const {
    getObsStation,
    ObsStException
} = require('../lib/getObsStation');
const {
    TPASchoolException,
    getTpaSchoolRawData
} = require('../lib/getTpaSchoolApi');
const {
    getAreaWeather,
} = require('../lib/areaWeather');
const cloudClassifyingHandler = require('./cloudClassifyingHandle');
const {
    createWeatherImg,
    WeatherImgError
} = require('../lib/createWeatherImg')

async function textHandle(context, text) {
    let msg = text;
    // record all message if in personal mode
    if (context.platform != 'console' &&
        !(context.platform == 'line' &&
            (context.event.rawEvent.source.type == 'room' ||
                context.event.rawEvent.source.type == 'group'))
    ) {
        messagedb.write(msg);
    }
    // trim space and change charactor
    msg = msg.replace(/\s/g, '');
    msg = msg.replace(/台/g, '臺');
    msg = msg.toLowerCase();
    const weatherKeyword = isWeather(msg);
    const airKeyword = isAir(msg);
    const funnyReply = isFunny(msg);
    const timeKeyword = isTime(msg);
    const schoolKeyword = isSchool(msg);

    // answer for session
    let shouldAnsAfterSession = true;
    if (context.state.isGotImgWaitAns) {
        if ((/yes|y|是/).test(msg)) {
            await cloudClassifyingHandler(context)
            shouldAnsAfterSession = false;
        } else if ((/no|n|否/).test(msg)) {
            context.resetState();
            shouldAnsAfterSession = false;
            await platformReplyText(context, '不進行分析');
        } else {
            // User not answer if need to classify cloud
            // Reset session and then go on.
            context.resetState();
        }
    }

    // anwser for command
    if (!shouldAnsAfterSession) {
        // do nothing
    } else if ((/^help$/).test(msg)) {
        await platformReplyText(
            context,
            require('../message/helpMsg')
        );
    } else if ((/^(問題|回報問題|issue)$/).test(msg)) {
        await platformReplyText(
            context,
            require('../message/issueMsg')
        );
    } else if ((/^(原始碼|github)$/).test(msg)) {
        await platformReplyText(context, URL.WEATHER_BOT_URL);
    } else if ((/(氣象局(\s|的)?(網站|網址))|(\bcwb\b.*(\burl\b|\blink\b))/).test(msg)) {
        await platformReplyText(context, URL.CWB_URL);
    } else if (msg.includes("觀測站清單")) {
        await platformReplyText(
            context,
            require('../message/obsStMsg')
        );
    } else if ((/^(fb|粉專|粉絲專頁)$/).test(msg)) {
        await platformReplyText(context, URL.WXKITTY_FB_URL);
    } else if ((/喵喵$/).test(msg)) {
        try {
            const area = await getGeoLocation(msg.split("喵喵")[0]);
            const url = await createWeatherImg(area);
            console.log(url)
            await platformReplyImage(context, url);
        } catch (e) {
            console.log(e);
            let replyMsg = "";
            if (e === GeoLocError.HTTP_GEO_API_ERROR)
                replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
            else if (e === WeatherImgError.HTTP_DARKSKY_ERROR)
                replyMsg = '取得天氣資料失敗';
            else if (e === WeatherImgError.HTTP_IMGUR_ERROR)
                replyMsg = "上傳圖片失敗";
            else if (e === WeatherImgError.HTTP_AIR_ERROR)
                replyMsg = '取得空氣資料失敗';
            else if (e === WeatherImgError.HTTP_MEOW_ERROR)
                replyMsg = "喵圖製作失敗";
            else
                replyMsg = `發生未知錯誤，請輸入 issue 取得回報管道`;
            await platformReplyText(context, replyMsg);
        }
    } else if ((/豬豬$/).test(msg)) {
        try {
            const area = await getGeoLocation(msg.split("豬豬")[0]);
            const url = await createWeatherImg(area, "chinese");
            console.log(url)
            await platformReplyImage(context, url);
        } catch (e) {
            console.log(e);
            let replyMsg = "";
            if (e === GeoLocError.HTTP_GEO_API_ERROR)
                replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
            else if (e === WeatherImgError.HTTP_DARKSKY_ERROR)
                replyMsg = '取得天氣資料失敗';
            else if (e === WeatherImgError.HTTP_AIR_ERROR)
                replyMsg = '取得空氣資料失敗';
            else if (e === WeatherImgError.HTTP_IMGUR_ERROR)
                replyMsg = "上傳圖片失敗";
            else if (e === WeatherImgError.HTTP_MEOW_ERROR)
                replyMsg = "豬豬圖製作失敗";
            else
                replyMsg = `發生未知錯誤，請輸入 issue 取得回報管道`;
            await platformReplyText(context, replyMsg);
        }
    } else if ((/(雲.*辨識)|(辨識.*雲)/).test(msg)) {
        const replyMsg = "請上傳雲的照片(jpg)";
        context.setState({
            isGotImgWaitAnwser: false,
            isGotReqWaitImg: true,
            previousContext: {}
        });
        await platformReplyText(context, replyMsg);
    } else if (msg.includes("觀測")) {
        const parseObsStMsg = require('../message/parseObsStMsg');
        let replyMsg = "";
        try {
            const result = await getObsStation(msg);
            console.log(result);
            replyMsg = parseObsStMsg(result);
        } catch (e) {
            if (e === ObsStException.DATA_ERROR)
                replyMsg = `無法取得資料或資料來源出錯`;
            else if (e === ObsStException.NO_STATION)
                replyMsg = `無此測站，請輸入「觀測站清單」尋找欲查詢測站`;
            else
                replyMsg = `發生未知錯誤，請輸入 issue 取得回報管道`;
        }
        await platformReplyText(context, replyMsg);
    } else if (msg.includes("監測站清單")) {
        await platformReplyText(
            context,
            require('../message/airStMsg')
        );
    } else if (airKeyword) {
        // If there is a staton, return detail data
        const stationName = isAirStation(msg);
        let foreignStation = null;
        if (stationName == null && msg != airKeyword) {
            foreignStation = await isForeignAirStation(msg);
        }
        if (stationName) {
            let replyMsg = '';
            const epoch = new Date().getMilliseconds();
            const url = `${URL.AIR_STATION_API_URL}?lang=tw&act=aqi-epa&ts=${epoch}`;
            try {
                const res = await axios.get(url);
                const data = res.data;
                data['Data'].forEach(e => {
                    if (e.SiteName.includes(stationName)) {
                        replyMsg = require('../message/parseAirStMsg')(e);
                    }
                })
            } catch (err) {
                console.log("input text: ", msg, err);
                replyMsg = '取得資料失敗';
            }
            await platformReplyText(context, replyMsg);
        } else if (foreignStation == null) { // else return taiwan air image
            const url = await require('../lib/createAirImage')();
            if (url != null) {
                await platformReplyImage(context, url);
            } else {
                // if get imgur image url fail, just reply in text
                await platformReplyText(context, "取得空氣品質圖失敗。請輸入[監測站清單]來查詢詳細數值。");
            }
        } else {
            let replyMsg = '';
            const AirData = await getForeignAirData(foreignStation);
            if (AirData != null) {
                replyMsg += parseForeAirStMsg(AirData);
            } else {
                replyMsg = '外國地區取得資料失敗';
            }
            await platformReplyText(context, replyMsg);
        }
    } else if (isForecast(msg)) {
        // Case 1: only forecast, then return image
        if (msg == "預報") {
            const d = parseTime();
            const dbKey = `${d.year}${d.month}${d.day}${d.hour}`;
            const imgUrl = URL.FORECAST_IMG_URL;
            const url = await imagedb('forecast', dbKey, imgUrl)
            if (url != null) {
                await platformReplyImage(context, url);
            } else {
                // if get imgur image url fail, just reply in text
                await platformReplyText(context, imgUrl);
            }
        } else { // Case2: there is future time
            let replyMsg = await getForecast(msg);
            // replyMsg += "\n---\n公告：可以使用「[地區]豬豬」（例如彰化豬豬）使用春節氣象圖喔！"
            await platformReplyText(context, replyMsg);
        }
    } else if (msg.includes("天氣圖")) {
        const d = parseTime();
        const dbKey = `${d.year}${d.month}${d.day}${d.hour}`;
        const imgUrl = URL.WEATHER_IMG_URL;
        const url = await imagedb('weather', dbKey, imgUrl);
        if (url != null) {
            await platformReplyImage(context, url);
        } else {
            // if get imgur image url fail, just reply in text
            await platformReplyText(context, imgUrl);
        }
    } else if (msg.includes("雷達")) {
        const d = parseTime();
        const time = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
        const imgUrl = `${URL.RADAR_IMG_URL_PREFIX}/CV1_3600_${time}.png`;
        const url = await imagedb('radar', time, imgUrl);
        if (url != null) {
            await platformReplyImage(context, url);
        } else {
            // if get imgur image url fail, just reply in text
            await platformReplyText(context, imgUrl);
        }
    } else if (msg.includes("衛星雲")) {
        const d = parseTime();
        const time = `${d.year}-${d.month}-${d.day}-${d.hour}-${d.minute}`;
        const dbKey = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
        const imgUrl = `${URL.STATELLITE_IMG_URL_PREFIX}/ts1p-${time}.jpg`;
        const url = await imagedb('satellite', dbKey, imgUrl);
        if (url != null) {
            await platformReplyImage(context, url);
        } else {
            // if get imgur image url fail, just reply in text
            await platformReplyText(context, imgUrl);
        }
    } else if (msg.includes("地震")) {
        const url = await require('../lib/getEarthquake')();
        if (url != null) {
            await platformReplyImage(context, url);
        } else {
            // if get image url fail, just reply in text
            await platformReplyText(context, `取得最新資料失敗。請上 ${URL.CWB_EARTHQUAKE_URL} 查詢`);
        }
    } else if (msg.includes("颱風")) {
        const url = await require('../lib/getTyphoon')();
        if (url != null) {
            await platformReplyImage(context, url);
        } else {
            // if get imgur image url fail, just reply in text
            await platformReplyText(context, `取得最新資料失敗。請上 ${URL.CWB_TYPHOON_URL} 查詢`);
        }
    } else if (msg.includes('概況')) {
        try {
            const replyMsg = await getOverview(msg);
            await platformReplyText(context, replyMsg);
        } catch (e) {
            if (e === OverviewException.CANNOT_FIND_LOC) {
                await platformReplyText(context, `查無此縣市`);
            } else if (e === OverviewException.DATA_FAILED) {
                await platformReplyText(context, `從氣象局取得資料發生錯誤，請晚點重試`);
            } else {
                await platformReplyText(context, `發生未知錯誤，請輸入 issue 取得回報管道`);
            }
        }
    } else if (weatherKeyword) {
        let replyMsg = "";
        // If there is time, use forecast
        if (timeKeyword) {
            replyMsg = await getForecast(msg);
        } else {
            try {
                const area = await getGeoLocation(msg.split(weatherKeyword)[0]);
                // get the current wearther
                replyMsg = await getAreaWeather(area);
            } catch (e) {
                console.log(e)
                if (e == GeoLocError.HTTP_GEO_API_ERROR)
                    replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
                else
                    replyMsg = `發生未知錯誤，請輸入 issue 取得回報管道`;
            }
        }
        // replyMsg += "\n---\n公告：可以使用「[地區]豬豬」（例如彰化豬豬）使用春節氣象圖喔！"
        await platformReplyText(context, replyMsg);
    } else if (schoolKeyword) {
        try {
            const rawData = await getTpaSchoolRawData(msg);
            replyMsg = parseSchool(rawData);
            await platformReplyText(context, replyMsg);
        } catch (e) {
            if (e == TPASchoolException.CANNOT_FIND_ID) {
                await platformReplyText(context, `欲查詢臺北市校園氣象,請輸入"校園氣象"查詢目標國中小後直接輸入 ,範例輸入:"北投國小"`);
            } else if (e == TPASchoolException.DATA_FAILED) {
                await platformReplyText(context, `資料獲取錯誤`);
            } else {
                await platformReplyText(context, `發生未知錯誤，請輸入 issue 取得回報管道`);
            }
        }
    } else if (msg == "校園氣象") {
        replyMsg = "校園氣象站：\n";
        const schools = require("../data/TpaSchool");
        for (let i in schools) {
            replyMsg += i + ':\n';
            for (let j in schools[i]) {
                replyMsg += schools[i][j].SchoolName + ',';
            }
            replyMsg += '\n';
        }
        await platformReplyText(context, replyMsg);
    } else if ((context.platform == 'line' && context.event.rawEvent.source.type == 'user') ||
        context.platform == 'messenger' || context.platform == 'telegram') {
        if (funnyReply) {
            await platformReplyText(context, funnyReply);
        } else {
            const replyMsg = "很抱歉目前只能回答氣象問題，可以輸入 help 查看更多細節喔！";
            await platformReplyText(context, replyMsg);
        }
    }

}

module.exports = textHandle;