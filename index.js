const fetch = require('node-fetch');
const linebot = require('linebot');
const express = require('express');

const parseWindDirection = require('./lib/parseWindDirection');
const segment = require('./lib/segment');
const parseTime = require('./lib/parseTime');
const parseAqi = require('./lib/parseAqi');

const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

bot.on('message', event => {
    if (event.message.type = 'text') {
        // message from user
        let msg = event.message.text.replace(/\s/g, '');
        msg = msg.replace(/台/g, '臺');

        if (msg.toLowerCase().includes("help")) {
            event.reply(
                require('./message/helpMsg')
            );
        } else if (msg.toLowerCase().includes("issue") || msg.includes("回報問題")) {
            event.reply(
                "請寄信到 phy.tiger@gmail.com 說明問題\n" +
                "或是上 Github 發 issue: https://github.com/ntu-as-cooklab/line-bot \n" +
                "謝謝回報！"
            );
        } else if (msg.toLowerCase().includes("github") || msg.includes("原始碼")) {
            event.reply("https://github.com/ntu-as-cooklab/line-bot");
        } else if (msg.toLowerCase().includes("cwb") || msg.includes("氣象局")) {
            event.reply("www.cwb.gov.tw/");
        } else if (msg.includes("觀測站清單")) {
            const replyMsg = '基隆 彭佳嶼 鞍部 臺北 陽明山 臺灣大學 文化大學 社子 大直 石牌 天母 士林 內湖 南港 大屯山 信義 文山 平等 松山 大安森林 板橋 淡水 文山茶改 新店 山佳 坪林 四堵 泰平 福山 桶後 屈尺 石碇 火燒寮 瑞芳 大坪 五指山 福隆 雙溪 富貴角 三和 金山 鼻頭角 三貂角 三重 三峽 新莊 三芝 八里 蘆洲 土城 鶯歌 中和 汐止 永和 五分山 林口 深坑 新屋 桃園農改 茶改場 中央大學 拉拉山 復興 桃園 八德 大園 觀音 蘆竹 大溪 平鎮 楊梅 龍潭 龜山 中壢 香山 新竹市東區 新竹 五峰站 梅花 關西 峨眉 打鐵坑 橫山 雪霸 竹東 寶山 新豐 湖口 雪見 新竹畜試 竹南 南庄 大湖 三義 後龍 明德 通霄 馬都安 頭份 造橋 苗栗 銅鑼 卓蘭 西湖 獅潭 苑裡 大河 高鐵苗栗 苗栗農改 臺中 梧棲 大肚 雪山圈谷 石岡 中坑 審馬陣 南湖圈谷 東勢 梨山 大甲 大坑 中竹林 神岡 大安 后里 豐原 大里 潭子 清水 外埔 龍井 烏日 西屯 南屯 新社 大雅 桃山 雪山東峰 武陵 臺中農改 彰師大 芬園 鹿港 員林 溪湖 溪州 二林 大城 竹塘 高鐵彰化 福興 秀水 花壇 埔鹽 埔心 田尾 埤頭 北斗 田中 社頭 芳苑 二水 伸港 玉山 日月潭 魚池茶改 凍頂茶改 埔里 中寮 草屯 昆陽 神木村 合歡山頂 廬山 信義 鳳凰 竹山 水里 魚池 集集 仁愛 名間 國姓 南投 梅峰 萬大林道 玉山風口 小奇萊 奇萊稜線 臺大竹山 臺大溪頭 雲林分場 麥寮 草嶺 崙背 四湖 宜梧 虎尾 土庫 斗六 北港 西螺 褒忠 二崙 大埤 斗南 林內 莿桐 古坑 元長 水林 東勢 臺西 蔦松 棋山 高鐵雲林 嘉義 嘉義市東區 嘉義農試 阿里山 義竹分場 馬頭山 東後寮 奮起湖 中埔 朴子 溪口 大林 太保 水上 竹崎 東石 番路 六腳 布袋 民雄 梅山 鹿草 新港 茶山 里佳 達邦 山美 臺南 永康 臺南農改 畜試所 曾文 北寮 王爺宮 大內 善化 玉井 安南 崎頂 虎頭埤 新市 媽廟 東河 下營 佳里 臺南市北區 臺南市南區 麻豆 官田 西港 安定 仁德 關廟 山上 安平 左鎮 白河 學甲 鹽水 關子嶺 新營 後壁 柳營 將軍 北門 鹿寮 七股 高雄 東沙島 南沙島 表湖 復興 甲仙 月眉 美濃 溪埔 內門 古亭坑 阿公店 鳳山 鳳森 新興 旗津 阿蓮 梓官 永安 茄萣 湖內 彌陀 岡山 楠梓 仁武 鼓山 三民 苓雅 林園 大寮 旗山 路竹 橋頭 大社 萬山 六龜 左營 鳳山農試 恆春 高雄農改 恆春畜試 尾寮山 阿禮 瑪家 三地門 新圍 屏東 赤山 潮州 來義 春日 琉球嶼 檳榔 貓鼻頭 墾丁 佳樂水 枋寮 楓港 牡丹池山 東港 高樹 長治 九如 竹田 萬丹 崁頂 林邊 佳冬 新埤 新園 麟洛 南州 里港 舊泰武 墾雷 蘇澳 宜蘭 蘭陽分場 雙連埤 礁溪 玉蘭 龜山島 東澳 南澳 五結 頭城 大礁溪 三星 內城 冬山 羅東 鶯子嶺 大福 坪林石牌 員山 多加屯 花蓮 花蓮農改 太魯閣 合歡山 大禹嶺 天祥 鯉魚潭 西林 光復 月眉山 水源 和中 大坑 水璉 鳳林山 加路蘭山 豐濱 靜浦 明里 佳心 玉里 舞鶴 富源 東華 吉安光華 鳳林 卓溪 新城 富世 萬榮 瑞穗 和平 瑞穗林道 蕃薯寮 德武 赤柯山 東里 大武 成功 蘭嶼 臺東 斑鳩分場 賓朗果園 臺東茶改 太麻里 知本 鹿野 綠島 池上 向陽 紅石 大溪山 金崙 東河 長濱 南田 關山 東吉島 澎湖 吉貝 西嶼 花嶼 金門 金門(東) 九宮碼頭 金沙 金寧 烏坵 馬祖 東莒 東引';
            event.reply(replyMsg);
        } else if (msg.includes("天氣")) {
            let replyMsg = '';
            const area = msg.split('天氣')[0];
            fetch(encodeURI(`https://maps.googleapis.com/maps/api/geocode/json?address=${area}`))
                .then(r => r.json())
                .then(res => {
                    const lon = res.results[0].geometry.location.lng;
                    const lat = res.results[0].geometry.location.lat;
                    fetch(`http://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${process.env.apiKey}`)
                        .then(r2 => r2.json())
                        .then(data => {
                            const d = parseTime(data.ts);
                            const time = `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`;
                            const rain = data.rain == undefined ? 0 : (data.rain["3h"] / 3).toFixed(2);
                            const temp = data.main.temp;
                            const rh = data.main.humidity;
                            const ws = data.wind.speed;
                            const feel = Math.round(1.07 * temp +
                                0.2 * rh / 100 * 6.105 *
                                Math.pow(2.71828, (17.27 * temp / (237.7 + temp))) -
                                0.65 * ws - 2.7);
                            const wd = ws == 0 ? '-' : parseWindDirection(data.wind.deg);
                            replyMsg = `地區：${area}\n時間：${time}\n` +
                                `溫度：${temp}℃\n體感溫度：${feel}℃\n` +
                                `濕度：${rh}%\n壓力：${data.main.pressure}hPa\n風速：${ws}m/s\n` +
                                `風向：${wd}\n雨量：${rain}mm`;
                            event.reply(replyMsg);
                        }).catch(err => {
                            console.log(err)
                            replyMsg = `查不到此地區天氣資料`;
                            event.reply(replyMsg);
                        });
                }).catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '找不到這個地區，請再試一次，或試著把地區放大、輸入更完整的名稱。例如有時候「花蓮」會找不到，但「花蓮縣」就可以。';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("觀測")) {
            let replyMsg = '';
            const stationName = msg.split('觀測')[0];
            fetch('http://140.112.67.183/mospc/returnJson.php?file=CWBOBS.json')
                .then(res => res.json())
                .then(data => {
                    function getText(e) {
                        return `測站：${e.name}\n時間：${e.time}\n` +
                            `溫度：${e.temp}℃\n體感溫度：${e.feel}℃\n` +
                            `濕度：${e.humd}%\n壓力：${e.pres}hPa\n風速：${e.ws}m/s\n` +
                            `風向：${e.wd}\n雨量：${e.rain}mm`;
                    }
                    const results = [];
                    //  find candidates stations
                    data.forEach(e => {
                        if (e.name.includes(stationName)) {
                            results.push(e);
                        }
                    })
                    // choose candidates for precise name
                    results.forEach(e => {
                        if (e.name == stationName) {
                            replyMsg = getText(e);
                        }
                    })
                    // choose candidates for approximative name
                    if (replyMsg == '') {
                        results.forEach(e => {
                            if (e.name.includes(stationName)) {
                                replyMsg = getText(e);
                            }
                        })
                    }
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg);
                }).catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("監測站清單")) {
            const replyMsg = '富貴角 陽明 萬里 淡水 基隆 士林 林口 三重 菜寮 汐止 大同 中山 大園 松山 萬華 新莊 觀音 古亭 永和 板橋 桃園 土城 新店 平鎮 中壢 龍潭 湖口 新竹 竹東 頭份 苗栗 三義 豐原 沙鹿 西屯 忠明 線西 大里 彰化 埔里 二林 南投 竹山 崙背 麥寮 臺西 斗六 新港 朴子 嘉義 新營 善化 安南 臺南 美濃 橋頭 楠梓 仁武 左營 屏東 前金 鳳山 復興 前鎮 小港 大寮 潮州 林園 恆春 宜蘭 冬山 花蓮 關山 臺東 馬祖 金門 馬公 彰化(大城) 屏東(琉球) ';
            event.reply(replyMsg);
        } else if (msg.includes("空氣")) {
            let replyMsg = '';
            const epoch = new Date().getMilliseconds();
            const url = `https://taqm.epa.gov.tw/taqm/aqs.ashx?lang=tw&act=aqi-epa&ts=${epoch}`;
            const stationName = msg.split('空氣')[0];
            fetch(url)
                .then(res => res.json())
                .then(data => {
                    data['Data'].forEach(e => {
                        if (e.SiteName.includes(stationName)) {
                            replyMsg = `測站：${e.SiteName}\n時間：${e.Time}\n` +
                                `空氣指標：${parseAqi(e.AQI)}\n` +
                                `PM10：${e.PM10}(μg/m3)\nPM2.5：${e.PM25}(μg/m3)\n` +
                                `CO：${e.CO}(ppm)\nSO2：${e.SO2}(ppb)\nNO2：${e.NO2}(ppb)`;
                        }
                    })
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg);
                })
                .catch(err => {
                    console.log("input text: ", msg);
                    console.log(err);
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("預報圖")) {
            event.reply('http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png');
        } else if (msg.includes("天氣圖")) {
            event.reply('http://www.cwb.gov.tw/V7/forecast/fcst/Data/I04.jpg');
        } else if (msg.includes("雷達圖")) {
            const d = parseTime();
            const time = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`);
        } else if (msg.includes("衛星雲圖")) {
            const d = parseTime();
            const time = `${d.year}-${d.month}-${d.day}-${d.hour}-${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/satellite/Data/s1p/s1p-${time}.jpg`);
        } else if (msg.includes('概況')) {
            const table = {
                "W50": "全臺",
                "W50_63": "臺北市",
                "W50_65": "新北市",
                "W50_68": "桃園市",
                "W50_66": "臺中市",
                "W50_67": "臺南市",
                "W50_64": "高雄市",
                "W50_10017": "基隆市",
                "W50_10004": "新竹縣",
                "W50_10018": "新竹市",
                "W50_10005": "苗栗縣",
                "W50_10007": "彰化縣",
                "W50_10008": "南投縣",
                "W50_10009": "雲林縣",
                "W50_10010": "嘉義縣",
                "W50_10020": "嘉義市",
                "W50_10013": "屏東縣",
                "W50_10002": "宜蘭縣",
                "W50_10015": "花蓮縣",
                "W50_10014": "臺東縣",
                "W50_10016": "澎湖縣",
                "W50_09020": "金門縣",
                "W50_09007": "連江縣",
            }
            const areaName = msg.split('概況')[0];
            let replyMsg = '';
            for (areaID in table) {
                if (table[areaID].includes(areaName)) {
                    fetch(`http://www.cwb.gov.tw/V7/forecast/taiwan/Data/${areaID}.txt`)
                        .then(res => res.text())
                        .then(data => {
                            replyMsg = data.replace(/<BR>/g, '\n');
                            replyMsg = replyMsg.split('<div')[0];
                            event.reply(replyMsg);
                        })
                        .catch(err => {
                            console.log("input text: ", msg);
                            console.log(err);
                            replyMsg = '取得資料失敗';
                            event.reply(replyMsg);
                        });
                }
            }
        }
    }
});

bot.on('join', event => {
    event.reply('Hi！我是氣象機器人￼￼￼￼(•ω•)\n想知道怎麼呼叫我\n請回覆：help');
});

bot.on('follow', event => {
    event.reply(
        "Hi！我是氣象機器人(•ω•)\n" +
        "您可以把我加進群組，讓大家一起使用\n" +
        "想知道怎麼呼叫我\n請回覆：help"
    );
});

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
});