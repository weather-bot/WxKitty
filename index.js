const linebot = require('linebot');
const express = require('express');

const bot = linebot({
    channelId: channelId,
    channelSecret: channelSecret,
    channelAccessToken: channelAccessToken
});

bot.on('message', (event) => {
    console.log(event);
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
    console.log("App now running on port", port);
});
