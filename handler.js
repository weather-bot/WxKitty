// third parties
const axios = require("axios");
const parseTime = require('./lib/parseTime');
const imagedb = require('./lib/imagedb');
const URL = require('./data/public_url.json');
const {
    getCloudClassification,
    CloudClassifyingException
} = require('./lib/getCloudClassification');
const {
    OverviewException,
    getOverview
} = require('./lib/getOverview');
const {
    getObsStation,
    ObsStException
} = require('./lib/getObsStation');
const {
    getAreaWeather,
} = require('./lib/areaWeather');
const {
    isAir,
    isWeather,
    isFunny,
    isAirStation,
    isForeignAirStation,
    isTaiwanArea,
    isTime,
    isForecast
} = require('./lib/keywords');
const messagedb = require('./lib/messagedb');
const getForeignAirData = require('./lib/getForeignAir');
const parseForeAirStMsg = require('./message/parseForeignAirMsg');
const getForecast = require('./lib/getForecast');
const config = require("./config");

async function platformReplyText(context, messenge) {
    if (context.platform == 'messenger' || context.platform == 'telegram') {
        await context.sendText(messenge)
    } else {
        await context.replyText(messenge);
    }
}

async function platformReplyImage(context, url) {
    if (context.platform == 'messenger' || context.platform == 'telegram') {
        await context.sendImage(url)
    } else {
        await context.replyImage(url);
    }
}

function getPlatformToken(platform) {
    if (platform == "line")
        return config.channelAccessToken;
    else if (platform == "telegram")
        return config.telegramAccessToken;
    else
        return "none";
}

function getImageId(context) {
    if (context.platform == "line")
        return context.event.image.id;
    else if (context.platform == "telegram")
        return context.event.photo[0].file_id;
    else
        return "none";
}

async function cloudClassifyingHandler(context) {
    const requestBody = context.state.isGotReqWaitImg ? {
        platform: context.platform,
        id: getImageId(context),
        token: getPlatformToken(context.platform)
    } : context.state.previousContext;
    try {
        const result = await getCloudClassification(requestBody);
        context.resetState();
        await platformReplyText(context,
            require('./message/parseCloudResult')(result)
        );
    } catch (err) {
        if (err === CloudClassifyingException.BodyError) {
            await platformReplyText(context, '不支援此平台');
        } else if (err === CloudClassifyingException.ClassifyError) {
            await platformReplyText(context, '分析照片失敗，只支援 jpg 格式，請重新上傳檔案');
        } else if (err === CloudClassifyingException.PoolLimitationError) {
            await platformReplyText(context, '分析服務達到上限，請稍後再試');
        } else {
            await platformReplyText(context, '未知錯誤，請重新嘗試');
        }
    }
}

const handler = async context => {
    if (context.event.isFollow) {
        await platformReplyText(context,
            require('./message/followMsg')
        );
    } else if (context.event.isJoin) {
        await platformReplyText(context,
            require('./message/joinMsg')
        );
    } else if (context.event.isImage || context.event.isPhoto) {
        if (context.state.isGotReqWaitImg) {
            await cloudClassifyingHandler(context);
            // only ask if need to classify the photo when user
            // upload a photo in personal mode, otherwise we
            // ignore the photo.
        } else if (context.platform == "telegram" || !(context.event.rawEvent.source.type == 'room' ||
                context.event.rawEvent.source.type == 'group')) {
            context.setState({
                isGotImgWaitAns: true,
                isGotReqWaitImg: false,
                previousContext: {
                    platform: context.platform,
                    id: getImageId(context),
                    token: getPlatformToken(context.platform)
                }
            })
            await platformReplyText(context,
                require('./message/isImageMsg')
            );
        }
    } else if (context.event.isText) {
        let msg = context.event.text;
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

        // answer for session
        let shouldAnsAfterSession = true;
        if (context.state.isGotImgWaitAns) {
            if (/yes|y|是/.test(msg)) {
                await cloudClassifyingHandler(context)
                shouldAnsAfterSession = false;
            } else if (/no|n|否/.test(msg)) {
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
        } else if (/^help$/.test(msg)) {
            await platformReplyText(context,
                require('./message/helpMsg')
            );
        } else if (/^(問題|回報問題|issue)$/.test(msg)) {
            await platformReplyText(context,
                require('./message/issueMsg')
            );
        } else if (/^(原始碼|github)$/.test(msg)) {
            await platformReplyText(context, URL.WEATHER_BOT_URL);
        } else if (/(氣象局(\s|的)?(網站|網址))|(\bcwb\b.*(\burl\b|\blink\b))/.test(msg)) {
            await platformReplyText(context, "http://www.cwb.gov.tw");
        } else if (msg.includes("觀測站清單")) {
            await platformReplyText(context,
                require('./message/obsStMsg')
            );
        } else if (/^(fb|粉專|粉絲專頁)$/.test(msg)) {
            await platformReplyText(context, "http://fb.me/WxKitty.tw");
        } else if (/(雲.*辨識)|(辨識.*雲)/.test(msg)) {
            const replyMsg = "請上傳雲的照片(jpg)";
            context.setState({
                isGotImgWaitAnwser: false,
                isGotReqWaitImg: true,
                previousContext: {}
            });
            await platformReplyText(context, replyMsg);
        } else if (msg.includes("觀測")) {
            const parseObsStMsg = require('./message/parseObsStMsg');
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
            await platformReplyText(context,
                require('./message/airStMsg')
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
                            replyMsg = require('./message/parseAirStMsg')(e);
                        }
                    })
                } catch (err) {
                    console.log("input text: ", msg, err);
                    replyMsg = '取得資料失敗';
                }
                await platformReplyText(context, replyMsg);
            } else if (foreignStation == null) { // else return taiwan air image
                const url = await require('./lib/createAirImage')();
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
                const replyMsg = await getForecast(msg);
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
            const url = await require('./lib/getEarthquake')();
            if (url != null) {
                await platformReplyImage(context, url);
            } else {
                // if get image url fail, just reply in text
                await platformReplyText(context, `取得最新資料失敗。請上 ${URL.CWB_EARTHQUAKE_URL} 查詢`);
            }
        } else if (msg.includes("颱風")) {
            const url = await require('./lib/getTyphoon')();
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
            let replyMsg;
            let area = null;
            area = isTaiwanArea(msg);
            if (area == null) {
                area = {};
                area['name'] = msg.split(weatherKeyword)[0];
            }
            // If there is time, use forecast
            if (timeKeyword) {
                replyMsg = await getForecast(msg);
            } else {
                // get the current wearther
                replyMsg = await getAreaWeather(area);
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
}

module.exports = handler;