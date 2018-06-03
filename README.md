# 氣象機器人 Weather Bot

[![Build Status](https://travis-ci.org/weather-bot/weather-bot.svg?branch=master)](https://travis-ci.org/weather-bot/weather-bot)

使用 messenger 和 line bot 實作的氣象機器人，用來自動回應有關天氣的訊息

Using messenger and line bot to implement weather rebot, in order to tell weather information to users automatically.

對此專案有興趣的話，可以閱讀這篇：[來寫個氣象機器人吧！](https://medium.com/@tigercosmos/1563c32a2f34)。

<img width="300" border="0" alt="bot_home" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/bot-home.png">

## Use the bot

### For Messenger

Link: http://m.me/weather.bot.tw/

<img width="300" border="0" alt="demo_messenger" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/messenger.png">

### For Line

Add the bot via QR code or click the button below

![QRcode](https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/qrcode.png)

<a href="https://line.me/R/ti/p/%40lbz9453s"><img height="36" border="0" alt="加入好友" src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"></a>

## Demo

<img width="400" border="0" alt="demo_enter" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo_enter.png">

<img width="400" border="0" alt="demo1" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo1.png">

<img width="400" border="0" alt="demo2" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo2.png">

<img width="400" border="0" alt="demo3" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo3.png">

<img width="400" border="0" alt="demo4" src="https://raw.githubusercontent.com/weather-bot/weather-bot/master/img/demo4.png">

## Document 文件

```text
請對我輸入指令（回覆我以下的關鍵字）
目前支援指令，以及其說明：

【快速使用】
- 預報（圖）
- 地震（圖）
- 空氣品質（圖）
- 衛星雲圖（圖）
- [地區]天氣（例如：東京天氣）
- [縣市][時間]預報 （例如：明天晚上台北預報）
- [縣市]概況（例如：台北概況）
- [地區]空氣（例如：北京空氣）
 
【進階指令】
<地區天氣>：直接查詢地區的天氣狀況（支援英文查詢國外地區）
 ＊[地址]天氣：取得地區氣象數據
    例如：高雄市天氣、淡水天氣
         new york 天氣、東京天氣

 ＊[縣市][時間]天氣：取得縣市預報
    例如：明天台中天氣、明天17:00台南天氣

 ＊[縣市]概況：臺灣的縣市天氣概況
    例如：全臺概況、金門縣概況

<預報>：台灣縣市預報
 ＊預報：取得台灣地區預報圖

 ＊[縣市][時間]預報
    例如：明天晚上台北預報
 ＊[縣市][未來時間]天氣
    例如：明天台中天氣、明天17:00台南天氣

 註：目前只支援 7 天內台灣縣市預報

<氣象圖>：提供氣象圖的連結
 ＊空汙
 ＊預報
 ＊天氣圖
 ＊衛星雲
 ＊雷達

<氣象觀測站>：查詢單一測站的詳細數據
 ＊[觀測站名稱]觀測
    例如：宜蘭觀測、士林觀測
 ＊觀測站清單：用來查詢有哪些觀測站

<空氣品質查詢>：查詢地區或測站空氣資訊
 ＊[地區]空氣
    例如：紐約空氣、北京空氣、台北空氣
 ＊[監測站名稱]空氣
    例如：基隆空氣、淡水空氣
 ＊監測站清單：用來查詢有哪些台灣監測站

<其他>
 ＊氣象局/CWB
 ＊回報問題/issue
 ＊Github/原始碼
```

## Develop 開發

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
node . console
```

#### Test the real bot

Test bot(line) link: https://line.me/R/ti/p/pOGQWj-4j-

Steps:

1. add the test line bot above as friend
2. send a PR
3. ask @tigercosmos to help you call the bot

For user IDs in white list, create comment `bot try` in PR.

### Heroku

see https://github.com/Automattic/node-canvas/wiki/Installation-on-Heroku

`./Aptfile`, `app.json` is for Heroku.

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

Make sure npm and nodeJS(require above version 7.6) have installed.

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
