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