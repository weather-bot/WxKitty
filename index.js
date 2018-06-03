const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

// Platforms
const {
    LineBot,
    MessengerBot,
    ConsoleBot
} = require('bottender');

const {
    registerRoutes
} = require('bottender/express');

const handler = require("./handler");

const server = express();

server.use(
    bodyParser.json({
        verify: (req, res, buf) => {
            req.rawBody = buf.toString();
        },
    })
);

// Choose platform
let bots;
if (process.argv[2] == "console") {
    bots = new ConsoleBot({
        fallbackMethods: true,
    }).onEvent(handler);
} else {
    bots = {
        messenger: new MessengerBot({
            accessToken: config.messengerAccessToken,
            appSecret: config.messengerAppSecret,
        }).onEvent(handler),
        line: new LineBot({
            channelSecret: config.channelSecret,
            accessToken: config.channelAccessToken
        }).onEvent(handler),
    };
}

if (process.argv[2] == "console") {
    bots.createRuntime();
} else {
    registerRoutes(server, bots.messenger, {
        path: '/messenger',
        verifyToken: config.messengerVerifyToken
    });
    registerRoutes(server, bots.line, {
        path: '/line'
    });

    server.listen(process.env.PORT || 5000, () => {
        console.log('server is running on 5000 port...');
    });
}