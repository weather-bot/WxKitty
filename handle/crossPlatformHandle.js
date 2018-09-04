const config = require("../config");

async function platformReplyText(context, messenge) {
    if (context.platform == 'messenger' || context.platform == 'telegram') {
        await context.sendText(messenge)
    } else {
        await context.replyText(messenge);
    }
}

async function platformReplyImage(context, url) {
    if (context.platform == 'messenger' || context.platform == 'telegram') {
        await context.sendImage(url)
    } else {
        await context.replyImage(url);
    }
}

function getPlatformToken(platform) {
    if (platform == "line")
        return config.channelAccessToken;
    else if (platform == "telegram")
        return config.telegramAccessToken;
    else
        return "none";
}

function getImageId(context) {
    if (context.platform == "line")
        return context.event.image.id;
    else if (context.platform == "telegram")
        return context.event.photo[0].file_id;
    else
        return "none";
}

module.exports = {
    platformReplyText,
    platformReplyImage,
    getPlatformToken,
    getImageId
}