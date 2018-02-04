const {
    LineBot
} = require('bottender');
const {
    createServer
} = require('bottender/express');
const axios = require("axios");

const config = require('./config');
const parseWindDirection = require('./lib/parseWindDirection');
const segment = require('./lib/segment');
const parseTime = require('./lib/parseTime');
const uploadImgur = require('./lib/uploadImgur');


const bot = new LineBot({
    channelSecret: process.env.channelSecret,
    accessToken: process.env.channelAccessToken
});

bot.onEvent(async context => {
    if (context.event.isFollow) {
        await context.replyText(
            require('./message/followMsg')
        );
    } else if (context.event.isJoin) {
        await context.replyText(
            require('./message/joinMsg')
        );
    } else if (context.event.isText) {
        // trim space and change charactor
        let msg = context.event.text.replace(/\s/g, '');
        msg = msg.replace(/台/g, '臺');

        if (msg.toLowerCase().includes("help")) {
            await context.replyText(
                require('./message/helpMsg')
            );
        } else if (msg.toLowerCase().includes("issue") || msg.includes("回報問題")) {
            await context.replyText(
                require('./message/issueMsg')
            );
        } else if (msg.toLowerCase().includes("github") || msg.includes("原始碼")) {
            await context.replyText("https://github.com/ntu-as-cooklab/line-bot");
        } else if (msg.toLowerCase().includes("cwb") || msg.includes("氣象局")) {
            await context.replyText("www.cwb.gov.tw/");
        } else if (msg.includes("觀測站清單")) {
            await context.replyText(
                require('./message/obsStMsg')
            );
        } else if (msg.includes("天氣") && !msg.includes("天氣圖")) {
            let replyMsg = '';

            try {
                const area = msg.split('天氣')[0];
                const googleGeoUrl = encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${area}`);
                const geoRes = await axios.get(googleGeoUrl);
                const geoData = geoRes.data;
                const lon = geoData.results[0].geometry.location.lng;
                const lat = geoData.results[0].geometry.location.lat;
                const realAreaName = geoData.results[0].formatted_address;
                try {
                    const openWeatherMaprUrl = `http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${ config.apiKey}`;
                    const res = await axios.get(openWeatherMaprUrl);
                    const data = res.data;
                    const d = parseTime(data.ts);
                    const newData = {};
                    newData['area'] = realAreaName;
                    newData['time'] = `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`;
                    newData['rain'] = data.rain == undefined ? 0 : (data.rain["3h"] / 3).toFixed(2);
                    newData['temp'] = data.main.temp;
                    newData['rh'] = data.main.humidity;
                    newData['ws'] = data.wind.speed;
                    newData['feel'] = Math.round(1.07 * newData['temp'] +
                        0.2 * newData['rh'] / 100 * 6.105 *
                        Math.pow(2.71828, (17.27 * newData['temp'] / (237.7 + newData['temp']))) -
                        0.65 * newData['ws'] - 2.7);
                    newData['wd'] = newData['ws'] == 0 ? '-' : parseWindDirection(data.wind.deg);
                    newData['pres'] = data.main.pressure;
                    replyMsg = require('./message/parseAreaWeatherMsg')(newData);
                } catch (e) {
                    console.log("input text: ", msg);
                    console.log(e)
                    replyMsg = `查不到此地區天氣資料`;
                }
            } catch (err) {
                console.log("input text: ", msg);
                console.log(err);
                replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
            }
            await context.replyText(replyMsg);

        } else if (msg.includes("觀測")) {
            let replyMsg = '';
            const parseObsStMsg = require('./message/parseObsStMsg');
            const stationName = msg.split('觀測')[0];
            try {
                const res = await axios.get('http://140.112.67.183/mospc/returnJson.php?file=CWBOBS.json');
                const data = res.data;
                const results = [];
                //  find candidates stations
                data.forEach(e => {
                    if (e.name.includes(stationName)) {
                        results.push(e);
                    }
                })
                // choose candidates for precise name
                results.forEach(e => {
                    if (e.name == stationName) {
                        replyMsg = parseObsStMsg(e);
                    }
                })
                // choose candidates for approximative name
                if (replyMsg == '') {
                    results.forEach(e => {
                        if (e.name.includes(stationName)) {
                            replyMsg = parseObsStMsg(e);
                        }
                    })
                }
                if (replyMsg == '') {
                    replyMsg = `無此測站`;
                }
            } catch (err) {
                console.log("input text: ", msg);
                console.log(err);
                replyMsg = '取得資料失敗';
            }
            await context.replyText(replyMsg);
        } else if (msg.includes("監測站清單")) {
            await context.replyText(
                require('./message/airStMsg')
            );
        } else if (msg.includes("空氣")) {
            let replyMsg = '';
            const epoch = new Date().getMilliseconds();
            const url = `https://taqm.epa.gov.tw/taqm/aqs.ashx?lang=tw&act=aqi-epa&ts=${epoch}`;
            const stationName = msg.split('空氣')[0];
            try {
                const res = await axios.get(url);
                const data = res.data;
                data['Data'].forEach(e => {
                    if (e.SiteName.includes(stationName)) {
                        replyMsg = require('./message/parseAirStMsg')(e);
                    }
                })
                if (replyMsg == '') {
                    replyMsg = `無此測站`;
                }
            } catch (err) {
                console.log("input text: ", msg);
                console.log(err);
                replyMsg = '取得資料失敗';
            }
            await context.replyText(replyMsg);
        } else if (msg.includes("預報圖")) {
            const img = 'http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png';
            const url = await uploadImgur(img);
            if (url != null) {
                await context.replyImage(url);
            } else {
                // if get imgur image url fail, just reply in text
                await context.replyText(img);
            }
        } else if (msg.includes("天氣圖")) {
            const img = 'http://www.cwb.gov.tw/V7/forecast/fcst/Data/I04.jpg';
            const url = await uploadImgur(img);
            if (url != null) {
                await context.replyImage(url);
            } else {
                // if get imgur image url fail, just reply in text                
                await context.replyText(img);
            }
        } else if (msg.includes("雷達圖")) {
            const d = parseTime();
            const time = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
            const img = `http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`;
            const url = await uploadImgur(img);
            if (url != null) {
                await context.replyImage(url);
            } else {
                // if get imgur image url fail, just reply in text                
                await context.replyText(img);
            }
        } else if (msg.includes("衛星雲圖")) {
            const d = parseTime();
            const time = `${d.year}-${d.month}-${d.day}-${d.hour}-${d.minute}`;
            const img = `http://www.cwb.gov.tw/V7/observe/satellite/Data/s1p/s1p-${time}.jpg`;
            const url = await uploadImgur(img);
            if (url != null) {
                await context.replyImage(url);
            } else {
                // if get imgur image url fail, just reply in text
                await context.replyText(img);
            }
        } else if (msg.includes('概況')) {
            const table = require('./data/overviewID');
            const areaName = msg.split('概況')[0];
            let replyMsg = '';
            for (areaID in table) {
                if (table[areaID].includes(areaName)) {
                    try {
                        const res = await axios.get(`http://www.cwb.gov.tw/V7/forecast/taiwan/Data/${areaID}.txt`);
                        const data = res.data;
                        replyMsg = data.replace(/<BR>/g, '\n');
                        replyMsg = replyMsg.split('<div')[0];
                    } catch (err) {
                        console.log("input text: ", msg);
                        console.log(err);
                        replyMsg = '取得資料失敗';
                    }
                    await context.replyText(replyMsg);
                }
            }
        }
    }
});

const server = createServer(bot);

server.listen(process.env.PORT || 5000, () => {
    console.log('server is running on 5000 port...');
});