const linebot = require('linebot');
const express = require('express');

const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken
});

bot.on('message', (event) => {
    if (event.message.type = 'text') {
        const msg = event.message.text;
        event.reply(msg).then((data) => {
            // success 
            console.log(msg);
        }).catch((error) => {
            // error 
            console.log('error');
        });
    }
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
});