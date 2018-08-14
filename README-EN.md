# 氣象喵 WxKitty

[![Build Status](https://travis-ci.org/weather-bot/weather-bot.svg?branch=master)](https://travis-ci.org/weather-bot/weather-bot)

「氣象喵」是聊天氣象機器人，自動回應有關天氣的訊息

"WxKitty" is a weather chatbot that answers all questions about weather.

<img width="700px" border="0" alt="bot_home" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/cover.JPG">

***Supporting:***
- [Line](https://line.me/R/ti/p/%40lbz9453s)
- [Telegram](https://t.me/weather_tw_bot)

If you want to know more about this project, you can checkout this article(Chinese)：[來寫個氣象機器人吧！](https://medium.com/@tigercosmos/1563c32a2f34)。

## Start to Use

### Line

Add the bot via QR code or click the button below

You can chat with the bot directly or add the bot in the group.

<img height="100" border="0" alt="QRcode" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/qrcode.png">

<a href="https://line.me/R/ti/p/%40lbz9453s"><img height="30" border="0" alt="加入好友" src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"></a>

### Telegram

Add the bot: https://t.me/weather_tw_bot

You can chat with the bot directly or add the bot in the group.

### ~~Messenger~~(deprecated)

You can chat with the bot via the link.

~~Link: http://m.me/weather.bot.tw/~~

## Demo

<img width="400" border="0" alt="demo_enter" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo_enter.png">

<img width="400" border="0" alt="demo1" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo1.png">

<img width="400" border="0" alt="demo2" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo2.png">

<img width="400" border="0" alt="demo3" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo3.png">

<img width="400" border="0" alt="demo4" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo4.png">

## Document

Enter questions, and WxKitty will anwser you.

```text
[Quickly Use]
New York Weather
Tokyo Weather

Taipei Air
London Air

[Checkout all command]
Help
```

## Develop

Currently this repo is connecting with:

- Line: https://weather-bot-tw.herokuapp.com/line 
- Messenger: https://weather-bot-tw.herokuapp.com/messenger

The bot use webhook to receive message and reply to users.

The two bot are synced to `master`.

For more detail about line bot, can visit https://developers.line.me/

### How to test

#### Console mode testing

Console mode is an interactive mode that you can test in local.

```sh
npm run console
```

#### Test the real bot

Test bot(line) link: https://line.me/R/ti/p/pOGQWj-4j-

Steps:

1. add the test line bot above as friend
2. send a PR
3. ask @tigercosmos to help you call the bot

For user IDs in white list, create comment `bot try` in PR.

## Setup

### Dependencies

#### node-canvas

Linux:

```sh
sudo apt-get install libcairo2-dev libjpeg-dev libpango1.0-dev libgif-dev build-essential g++
```

MacOS:

```sh
brew install pkg-config cairo pango libpng jpeg giflib
export PKG_CONFIG_PATH=/usr/local/lib/pkgconfig
export PATH="/usr/local/opt/icu4c/bin:$PATH
export PATH="/usr/local/opt/icu4c/sbin:$PATH
cp /usr/local/Cellar/libpng/1.6.34/lib/pkgconfig/libpng.pc /usr/local/lib/pkgconfig
cp /usr/local/Cellar/fontconfig/2.12.6/lib/pkgconfig/fontconfig.pc /usr/local/lib/pkgconfig
```

### Run

Make sure npm and NodeJS(v8.11.2) have installed.

> note: it is known that not work in NodeJS v10

```sh
git clone https://github.com/weather-bot/weather-bot
cd weather-bot
npm install
npm start
```

## Developer

- Programmer: [＠tigercosmos](https://github.com/tigercosmos), [@csinrn](https://github.com/csinrn), [＠cochiachang](https://github.com/cochiachang)
- Art Designer: 戴君倢 Jennesy Dai

## License

MIT
