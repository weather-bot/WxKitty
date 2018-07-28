const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

// Platforms
const {
    LineBot,
    MessengerBot,
    TelegramBot,
    ConsoleBot,
    FileSessionStore 
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
    bots.createRuntime();
} else {
    bots = {
        messenger: new MessengerBot({
            accessToken: config.messengerAccessToken,
            appSecret: config.messengerAppSecret,
            sessionStore: new FileSessionStore(),
        }).onEvent(handler),
        line: new LineBot({
            channelSecret: config.channelSecret,
            accessToken: config.channelAccessToken,
            sessionStore: new FileSessionStore(),
        }).onEvent(handler),
        telegram: new TelegramBot({
            accessToken: config.telegramAccessToken,
            sessionStore: new FileSessionStore(),
        }).onEvent(handler),
    };
    registerRoutes(server, bots.messenger, {
        path: '/messenger',
        verifyToken: config.messengerVerifyToken
    });
    registerRoutes(server, bots.line, {
        path: '/line'
    });
    registerRoutes(server, bots.telegram, {
        path: '/telegram'
    });
    server.listen(process.env.PORT || 5000, () => {
        console.log('server is running on 5000 port...');
    });
}