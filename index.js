const fetch = require('node-fetch');
const linebot = require('linebot');
const express = require('express');
const jieba = require("nodejieba");
const trans = require('chinese-conv');

const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken
});

const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);

const getTime = epoch => {
    function format(val) {
        if (val < 10) {
            val = '0' + val;
        }
        return val;
    }
    let date = new Date();
    const utc = date.getTime() + (date.getTimezoneOffset() * 60000);
    // zone time utc+8, and back 30 min to ensure the url is valid
    date = new Date(utc + (3600000 * 7.5));

    if (epoch) {
        date = new Date(epoch * 1000);
    }

    const year = date.getFullYear();
    const month = format(date.getMonth() + 1);
    const day = format(date.getDate());
    const hour = format(date.getHours());
    const minute = format(Math.floor(date.getMinutes() / 10) * 10);
    return {
        year,
        month,
        day,
        hour,
        minute
    };
}

// nodejieba only support Simplified Chinese, so translate Traditonal to Simplified.
// After segmentation, translate back to Traditonal Chinese.
const segment = input => {
    const words = jieba.cut(trans.sify(input));
    const results = [];
    words.forEach(w => {
        results.push(trans.tify(w));
    })
    return results;
}

bot.on('message', event => {
    if (event.message.type = 'text') {
        // message from user
        const msg = event.message.text.replace(/\s/g, '');

        if (msg.toLowerCase().includes("help")) {
            event.reply(
                "請對我輸入指令（回覆我以下的關鍵字）\n" +
                "目前支援指令，以及其說明：\n" +
                "\n" +
                "<地區天氣>：直接查詢地區的天氣狀況（支援英文查詢國外地區）\n" +
                " ＊[地址]天氣\n" +
                "    例如：高雄市天氣、淡水天氣\n" +
                "            new york 天氣\n" +
                "\n" +
                "<氣象圖>：提供氣象圖的連結\n" +
                " ＊預報圖\n" +
                " ＊天氣圖\n" +
                " ＊衛星雲圖\n" +
                " ＊雷達圖\n" +
                "\n" +
                "<氣象觀測站>：查詢單一測站的詳細數據\n" +
                " ＊[觀測站名稱]觀測\n" +
                "    例如：宜蘭觀測、士林觀測\n" +
                " ＊觀測站清單：用來查詢有哪些觀測站\n" +
                "\n" +
                "<空氣品質監測站>：查詢單一測站的詳細數據\n" +
                " ＊[監測站名稱]空氣\n" +
                "    例如：基隆空氣、淡水空氣\n" +
                " ＊監測站清單：用來查詢有哪些監測站\n" +
                "\n" +
                "<其他>\n" +
                " ＊氣象局/CWB\n" +
                " ＊回報問題/issue\n" +
                " ＊Github/原始碼"
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
                            console.log(data)
                            const d = getTime(data.ts);
                            const time = `${d.year}/${d.month}/${d.day} ${d.hour}:${d.minute}`;
                            const rain = data.rain == undefined ? 0 : data.rain["3h"] / 3;
                            const temp = data.main.temp;
                            const rh = data.main.humidity;
                            const ws = data.wind.speed;
                            const feel = Math.round(1.07 * temp +
                                0.2 * rh / 100 * 6.105 *
                                Math.pow(2.71828, (17.27 * temp / (237.7 + temp))) -
                                0.65 * ws - 2.7);
                            replyMsg = `地區：${area}\n時間：${time}\n` +
                                `溫度：${temp}℃\n體感溫度：${feel}℃\n` +
                                `濕度：${rh}%\n壓力：${data.main.pressure}hPa\n風速：${ws}m/s\n` +
                                `風向：${Math.floor(data.wind.deg)}度方位角\n雨量：${rain}mm`;
                            event.reply(replyMsg);
                        }).catch(err => {
                            console.log(err)
                            replyMsg = `查不到此地區天氣資料`;
                            event.reply(replyMsg);
                        });
                }).catch(err => {
                    console.log(err);
                    replyMsg = '找不到這個地區，請試著把地區放大，或是輸入更完整的名稱';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("觀測")) {
            let replyMsg = '';
            const stationName = msg.split('觀測')[0];
            fetch('http://140.112.67.183/mospc/returnJson.php?file=CWBOBS.json')
                .then(res => res.json())
                .then(data => {
                    data.forEach(e => {
                        if (e.name.includes(stationName)) {
                            replyMsg = `測站：${e.name}\n時間：${e.time}\n` +
                                `溫度：${e.temp}℃\n體感溫度：${e.feel}℃\n` +
                                `濕度：${e.humd}%\n壓力：${e.pres}hPa\n風速：${e.ws}m/s\n` +
                                `風向：${e.wd}\n雨量：${e.rain}mm`
                        }
                    })
                    if (replyMsg == '') {
                        replyMsg = `無此測站`;
                    }
                    event.reply(replyMsg);
                })
                .catch(err => {
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
                            function getAirCondition() {
                                if (e.AQI < 50)
                                    return `良好`;
                                else if (e.AQI < 100)
                                    return `普通`;
                                else if (e.AQI < 150)
                                    return `對敏感族群不健康`;
                                else if (e.AQI < 200)
                                    return `對所有族群不健康`;
                                else if (e.AQI < 300)
                                    return `非常不健康`;
                                else if (e.AQI > 300)
                                    return `危害`;
                            }
                            replyMsg = `測站：${e.SiteName}\n時間：${e.Time}\n` +
                                `空氣指標：${getAirCondition()}\n` +
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
                    replyMsg = '取得資料失敗';
                    event.reply(replyMsg);
                });
        } else if (msg.includes("預報圖")) {
            event.reply('http://www.cwb.gov.tw//V7/forecast/taiwan/Data/Forecast01.png');
        } else if (msg.includes("天氣圖")) {
            event.reply('http://www.cwb.gov.tw/V7/forecast/fcst/Data/I04.jpg');
        } else if (msg.includes("雷達圖")) {
            const d = getTime();
            const time = `${d.year}${d.month}${d.day}${d.hour}${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/radar/Data/HD_Radar/CV1_3600_${time}.png`);
        } else if (msg.includes("衛星雲圖")) {
            const d = getTime();
            const time = `${d.year}-${d.month}-${d.day}-${d.hour}-${d.minute}`;
            event.reply(`http://www.cwb.gov.tw/V7/observe/satellite/Data/s1p/s1p-${time}.jpg`);
        }
    }
});

bot.on('join', event => {
    event.reply('Hi！我是氣象機器人￼￼￼￼(•ω•)\n想知道怎麼呼叫我\n請回覆：help');
});

bot.on('follow', event => {
    event.reply(
        "Hi！我是氣象機器人￼￼￼￼(•ω•)\n" +
        "您可以把我加進群組，讓大家一起使用\n" +
        "想知道怎麼呼叫我\n請回覆：help"
    );
});

const server = app.listen(process.env.PORT || 8080, () => {
    const port = server.address().port;
});