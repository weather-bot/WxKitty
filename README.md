# 氣象機器人 Weather Bot

[![Build Status](https://travis-ci.org/ntu-as-cooklab/weather-bot.svg?branch=master)](https://travis-ci.org/ntu-as-cooklab/weather-bot)

使用 messenger 和 line bot 實作的氣象機器人，用來自動回應有關天氣的訊息

Using messenger and line bot to implement weather rebot, in order to tell weather information to users automatically.

<img width="300" border="0" alt="bot_home" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/bot-home.png">

## Use(Add Friend)

### For messenger

Like to page https://www.facebook.com/weather.bot.tw/

and enjoy talk to messeenger :)

<img width="400" border="0" alt="demo_messenger" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/messenger.png">

### For Line

Add the bot via QR code or click the button below

![QRcode](https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/qrcode.png)

<a href="https://line.me/R/ti/p/%40lbz9453s"><img height="36" border="0" alt="加入好友" src="https://scdn.line-apps.com/n/line_add_friends/btn/zh-Hant.png"></a>

## Demo

<img width="400" border="0" alt="demo_enter" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/demo_enter.png">

<img width="400" border="0" alt="demo1" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/demo1.png">

<img width="400" border="0" alt="demo2" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/demo2.png">

<img width="400" border="0" alt="demo3" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/demo3.png">

<img width="400" border="0" alt="demo4" src="https://raw.githubusercontent.com/ntu-as-cooklab/line-bot/master/img/demo4.png">

## Document

```text
請對我輸入指令（回覆我以下的關鍵字）
目前支援指令，以及其說明：

【快速使用】
- 預報（圖）
- 地震（圖）
- 空氣品質（圖）
- 衛星雲圖（圖）
- [地區]天氣（例如：東京天氣）
- [縣市]概況（例如：台北概況）

【進階指令】
<地區天氣>：直接查詢地區的天氣狀況（支援英文查詢國外地區）
 ＊[地址]天氣：取得地區氣象數據
    例如：高雄市天氣、淡水天氣
            new york 天氣
 ＊[縣市]概況：臺灣的縣市天氣概況
    例如：全臺概況、金門縣概況

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

<空氣品質監測站>：查詢單一測站的詳細數據
 ＊[監測站名稱]空氣
    例如：基隆空氣、淡水空氣
 ＊監測站清單：用來查詢有哪些監測站

<其他>
 ＊氣象局/CWB
 ＊回報問題/issue
 ＊Github/原始碼
```

## Develop

Currently this repo is connecting with https://weather-bot-tw.herokuapp.com/.

The bot use webhook to receive message and reply to users.

For more detail about line bot, can visit https://developers.line.me/

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

Make sure npm and nodeJS have installed.

```sh
git clone https://github.com/ntu-as-cooklab/line-bot
cd line-bot
npm install
npm start
```

## Developer

- programmer: [＠tigercosmos](https://github.com/tigercosmos)
- designer: 戴君倢 Jennesy Dai

## License

MIT
