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
        event.reply(msg).then(data => {
            // success 
            logger.info(msg);
        }).catch(error => {
            // error 
            logger.error(error);
        });
    }
});

bot.on('join', event => {
    const msg = '我是天氣機器人 :)\n想知道怎麼呼叫我，請回覆：\nhelp';
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