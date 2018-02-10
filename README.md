# 氣象機器人 Weather Bot

[![Build Status](https://travis-ci.org/ntu-as-cooklab/weather-bot.svg?branch=master)](https://travis-ci.org/ntu-as-cooklab/weather-bot)

使用 line bot 實作的氣象機器人，用來自動回應有關天氣的訊息

Using line bot to implement weather rebot, in order to tell weather information to users automatically.

## Use(Add Friend)

Add the bot via QR code or click the button

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

<地區天氣>：直接查詢地區的天氣狀況（支援英文查詢國外地區）
 ＊[地址]天氣：取得地區氣象數據
    例如：高雄市天氣、淡水天氣
            new york 天氣
 ＊[縣市]概況：臺灣的縣市天氣概況
    例如：全臺概況、金門縣概況

<氣象圖>：提供氣象圖的連結
 ＊預報圖
 ＊天氣圖
 ＊衛星雲圖
 ＊雷達圖

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

### Setup and Run

Make sure npm and nodeJS have installed.

```sh
git clone https://github.com/ntu-as-cooklab/line-bot
cd line-bot
npm install
npm start
```
