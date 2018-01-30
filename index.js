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
        const msg = event.message.text;

        if (msg.includes("help")) {
            event.reply(
                "目前支援指令：\n" +
                "天氣圖、雷達圖"
            ).then(data => {
                // success 
                logger.info(msg);
            }).catch(error => {
                // error 
                logger.error(error);
            });
        }

        if (msg.includes("天氣圖")) {
            event.reply(
                'http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png'
            ).then(data => {
                // success 
                logger.info(msg);
            }).catch(error => {
                // error 
                logger.error(error);
            });
        }

        if (msg.includes("雷達圖")) {
            function format(val) {
                if (val < 10) {
                    val = '0' + val;
                }
                return val;
            }
            let date = new Date();
            const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
            // zone time utc+8
            date = new Date(utc + (3600000 * 8));
            const year = date.getFullYear();
            const month = format(date.getMonth() + 1);
            const day = format(date.getDate());
            const hour = format(date.getHours());
            // back 30 min to ensure the url is valid
            date.setDate(date.getMinute() - 30);
            const minute = format(Math.floor(date.getMinutes() / 10) * 10);
            const time = `${year}${month}${day}${hour}${minute}`;
            event.reply(
                `http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`
            ).then(data => {
                // success 
                logger.info(msg);
            }).catch(error => {
                // error 
                logger.error(error);
            });
        }

        // event.reply().then(data => {
        //     // success 
        //     logger.info(msg);
        // }).catch(error => {
        //     // error 
        //     logger.error(error);
        // });

    }
});

bot.on('join', event => {
    const msg = '我是氣象機器人￼￼￼￼ (moon grin)\n想知道怎麼呼叫我\n請回覆：help';
    event.reply(msg).then(data => {
        // success 
        logger.info(msg);
    }).catch((error) => {
        // error 
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