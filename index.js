const fetch = require('node-fetch');
const linebot = require('linebot');
const express = require('express');

const config = require('./config');
const parseWindDirection = require('./lib/parseWindDirection');
const segment = require('./lib/segment');
const parseTime = require('./lib/parseTime');
const parseAqi = require('./lib/parseAqi');

const bot = linebot({
    channelId:  config.channelId,
    channelSecret:  config.channelSecret,
    channelAccessToken:  config.channelAccessToken
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

bot.on('message', event => {
    if (event.message.type = 'text') {

        // trim space and change charactor
        let msg = event.message.text.replace(/\s/g, '');
        msg = msg.replace(/台/g, '臺');

        if (msg.toLowerCase().includes("help")) {
            event.reply(
                require('./message/helpMsg')
            );
        } else if (msg.toLowerCase().includes("issue") || msg.includes("回報問題")) {
            event.reply(
                require('./message/issueMsg.js')
            );
        } else if (msg.toLowerCase().includes("github") || msg.includes("原始碼")) {
            event.reply("https://github.com/ntu-as-cooklab/line-bot");
        } else if (msg.toLowerCase().includes("cwb") || msg.includes("氣象局")) {
            event.reply("www.cwb.gov.tw/");
        } else if (msg.includes("觀測站清單")) {
            event.reply(
                require('./message/obsStMsg')
            );
        } else if (msg.includes("天氣")) {
            let replyMsg = '';
            const area = msg.split('天氣')[0];
            fetch(encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${area}`))
                .then(r => r.json())
                .then(res => {
                    const lon = res.results[0].geometry.location.lng;
                    const lat = res.results[0].geometry.location.lat;
                    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${ config.apiKey}`)
                        .then(r2 => r2.json())
                        .then(data => {
                            const d = parseTime(data.ts);
                            const time = `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`;
                            const rain = data.rain == undefined ? 0 : (data.rain["3h"] / 3).toFixed(2);
                            const temp = data.main.temp;
                            const rh = data.main.humidity;
                            const ws = data.wind.speed;
                            const feel = Math.round(1.07 * temp +
                                0.2 * rh / 100 * 6.105 *
                                Math.pow(2.71828, (17.27 * temp / (237.7 + temp))) -
                                0.65 * ws - 2.7);
                            const wd = ws == 0 ? '-' : parseWindDirection(data.wind.deg);
                            replyMsg = `地區：${area}\n時間：${time}\n` +
                                `溫度：${temp}℃\n體感溫度：${feel}℃\n` +
                                `濕度：${rh}%\n壓力：${data.main.pressure}hPa\n風速：${ws}m/s\n` +
                                `風向：${wd}\n雨量：${rain}mm`;
                            event.reply(replyMsg);
                        }).catch(err => {
                            console.log(err)
                            replyMsg = `查不到此地區天氣資料`;
                            event.reply(replyMsg);
                        });
                }).catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("觀測")) {
            let replyMsg = '';
            const stationName = msg.split('觀測')[0];
            fetch('http://140.112.67.183/mospc/returnJson.php?file=CWBOBS.json')
                .then(res => res.json())
                .then(data => {
                    function getText(e) {
                        return `測站：${e.name}\n時間：${e.time}\n` +
                            `溫度：${e.temp}℃\n體感溫度：${e.feel}℃\n` +
                            `濕度：${e.humd}%\n壓力：${e.pres}hPa\n風速：${e.ws}m/s\n` +
                            `風向：${e.wd}\n雨量：${e.rain}mm`;
                    }
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
                            replyMsg = getText(e);
                        }
                    })
                    // choose candidates for approximative name
                    if (replyMsg == '') {
                        results.forEach(e => {
                            if (e.name.includes(stationName)) {
                                replyMsg = getText(e);
                            }
                        })
                    }
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg);
                }).catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("監測站清單")) {
            event.reply(
                require('./message/airStMsg')
            );
        } else if (msg.includes("test")) {
            event.reply({
                type: 'image',
                originalContentUrl: 'https://www.petmd.com/sites/default/files/petmd-cat-happy-10.jpg',
                previewImageUrl: 'https://www.petmd.com/sites/default/files/petmd-cat-happy-10.jpg'
              });
        } else if (msg.includes("空氣")) {
            let replyMsg = '';
            const epoch = new Date().getMilliseconds();
            const url = `https://taqm.epa.gov.tw/taqm/aqs.ashx?lang=tw&act=aqi-epa&ts=${epoch}`;
            const stationName = msg.split('空氣')[0];
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    data['Data'].forEach(e => {
                        if (e.SiteName.includes(stationName)) {
                            replyMsg = `測站：${e.SiteName}\n時間：${e.Time}\n` +
                                `空氣指標：${parseAqi(e.AQI)}\n` +
                                `PM10：${e.PM10}(μg/m3)\nPM2.5：${e.PM25}(μg/m3)\n` +
                                `CO：${e.CO}(ppm)\nSO2：${e.SO2}(ppb)\nNO2：${e.NO2}(ppb)`;
                        }
                    })
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg);
                })
                .catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("預報圖")) {
            event.reply('http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png');
        } else if (msg.includes("天氣圖")) {
            event.reply('http://www.cwb.gov.tw/V7/forecast/fcst/Data/I04.jpg');
        } else if (msg.includes("雷達圖")) {
            const d = parseTime();
            const time = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`);
        } else if (msg.includes("衛星雲圖")) {
            const d = parseTime();
            const time = `${d.year}-${d.month}-${d.day}-${d.hour}-${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/satellite/Data/s1p/s1p-${time}.jpg`);
        } else if (msg.includes('概況')) {
            const table = {
                "W50": "全臺",
                "W50_63": "臺北市",
                "W50_65": "新北市",
                "W50_68": "桃園市",
                "W50_66": "臺中市",
                "W50_67": "臺南市",
                "W50_64": "高雄市",
                "W50_10017": "基隆市",
                "W50_10004": "新竹縣",
                "W50_10018": "新竹市",
                "W50_10005": "苗栗縣",
                "W50_10007": "彰化縣",
                "W50_10008": "南投縣",
                "W50_10009": "雲林縣",
                "W50_10010": "嘉義縣",
                "W50_10020": "嘉義市",
                "W50_10013": "屏東縣",
                "W50_10002": "宜蘭縣",
                "W50_10015": "花蓮縣",
                "W50_10014": "臺東縣",
                "W50_10016": "澎湖縣",
                "W50_09020": "金門縣",
                "W50_09007": "連江縣",
            }
            const areaName = msg.split('概況')[0];
            let replyMsg = '';
            for (areaID in table) {
                if (table[areaID].includes(areaName)) {
                    fetch(`http://www.cwb.gov.tw/V7/forecast/taiwan/Data/${areaID}.txt`)
                        .then(res => res.text())
                        .then(data => {
                            replyMsg = data.replace(/<BR>/g, '\n');
                            replyMsg = replyMsg.split('<div')[0];
                            event.reply(replyMsg);
                        })
                        .catch(err => {
                            console.log("input text: ", msg);
                            console.log(err);
                            replyMsg = '取得資料失敗';
                            event.reply(replyMsg);
                        });
                }
            }
        }
    }
});

bot.on('join', event => {
    event.reply(
        require('./message/joinMsg')
    );
});

bot.on('follow', event => {
    event.reply(
        require('./message/followMsg')
    );
});

const server = app.listen( process.env.PORT || 8080, () => {
    const port = server.address().port;
});