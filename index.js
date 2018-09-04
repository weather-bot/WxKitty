const express = require('express');
const bodyParser = require('body-parser');
const config = require('./config');

const MAX_ITEMS_IN_CACHE = 500;
const EXPIRED_IN_FIVE_MINUTE = 5 * 60;

// Initialize Variable
global.CLOUD_POOL_SIZE = 0;

// Platforms
const {
    LineBot,
    // MessengerBot,
    TelegramBot,
    ConsoleBot,
    MemorySessionStore
} = require('bottender');

const {
    registerRoutes
} = require('bottender/express');

const handler = require("./handle/handler");

const server = express();

server.use(bodyParser.json({
    verify: (req, res, buf) => {
        req.rawBody = buf.toString();
    },
}));

// Session: how we store session. We stores sessions in memory.
const mSession = new MemorySessionStore(MAX_ITEMS_IN_CACHE, EXPIRED_IN_FIVE_MINUTE);

// Session data: used for conversation
const sessData = {
    isGotImgWaitAnwser: false,
    isGotReqWaitImg: false,
    previousContext: {}
}

// Choose platform
let bots;
if (process.argv[2] == "console") {
    bots = new ConsoleBot({
        fallbackMethods: true,
    }).onEvent(handler);
    bots.createRuntime();
} else {
    bots = {
        // messenger: new MessengerBot({
        //     accessToken: config.messengerAccessToken,
        //     appSecret: config.messengerAppSecret,
        //     sessionStore: mSession,
        // }).setInitialState(sessData).onEvent(handler),
        line: new LineBot({
            channelSecret: config.channelSecret,
            accessToken: config.channelAccessToken,
            sessionStore: mSession,
        }).setInitialState(sessData).
        onEvent(handler),
        telegram: new TelegramBot({
            accessToken: config.telegramAccessToken,
            sessionStore: mSession,
        }).setInitialState(sessData).
        onEvent(handler),
    };
    // registerRoutes(server, bots.messenger, {
    //     path: '/messenger',
    //     verifyToken: config.messengerVerifyToken
    // });
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