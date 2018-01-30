const fetch = require('node-fetch');
const linebot = require('linebot');
const express = require('express');
const Logger = require('node-color-log');
const logger = new Logger();

const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken
});

bot.on('message', event => {
    if (event.message.type = 'text') {
        // message from user
        const msg = event.message.text;

        if (msg.includes("help")) {
            event.reply(
                "目前支援指令：\n" +
                "＊天氣圖\n" +
                "＊雷達圖\n" +
                "＊[名稱]測站\n" +
                "＊回報問題\n"
            ).catch(error => {
                logger.error(error);
            });
        } else if (msg.includes("回報問題")) {
            event.reply(
                "請寄信到 phy.tiger@gmail.com 說明問題，謝謝回報！"
            ).catch(error => {
                logger.error(error);
            });
        } else if (msg.includes("測站")) {
            let replyMsg = '';
            const stationName = msg.split('測站')[0];
            fetch('http://140.112.67.183/mospc/returnJson.php?file=CWBOBS.json')
                .then(res => res.json())
                .then(data => {
                    data.forEach(e => {
                        if (e.name.includes(stationName)) {
                            replyMsg = `測站：${e.name}\n時間：${e.time}\n溫度：${e.temp}℃\n` +
                                `濕度：${e.humd}%\n壓力：${e.pres}hPa\n風速：${e.ws}m/s\n` +
                                `風向：${e.wd}\n雨量：${e.rain}mm`
                        }
                    })
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg).then(data => {
                        logger.info(msg);
                        logger.error(error);
                    });
                })
                .catch(err => {
                    logger.error(error);
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg).catch(error => {
                        logger.error(error);
                    });
                });
        } else if (msg.includes("天氣圖")) {
            event.reply(
                'http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png'
            ).catch(error => {
                logger.error(error);
            });
        } else if (msg.includes("雷達圖")) {
            function format(val) {
                if (val < 10) {
                    val = '0' + val;
                }
                return val;
            }
            let date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            // zone time utc+8, and back 30 min to ensure the url is valid
            date = new Date(utc + (3600000 * 7.5));
            const year = date.getFullYear();
            const month = format(date.getMonth() + 1);
            const day = format(date.getDate());
            const hour = format(date.getHours());
            const minute = format(Math.floor(date.getMinutes() / 10) * 10);
            const time = `${year}${month}${day}${hour}${minute}`;
            event.reply(
                `http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`
            ).catch(error => {
                logger.error(error);
            });
        }
    }
});

bot.on('join', event => {
    const msg = 'Hi！我是氣象機器人￼￼￼￼(•ω•)\n想知道怎麼呼叫我\n請回覆：help';
    event.reply(msg).catch((error) => {
        logger.error('error');
    });
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
});