const {
    LineException,
    getLineContent
} = require('../lib/getLineContent');
const {
    olamiSpeech,
    OlamiException
} = require('../lib/olamiSpeech');
const {
    platformReplyText,
} = require("./crossPlatformHandle");
const textHandler = require('./textHandler');
const toWav = require('audiobuffer-to-wav');

// Parse audio to text and then handle the text.
async function audioHandler(context) {
    let replyMsg = "";
    if (context.platform == "line") {
        let audioBin;
        try {
            audioBin = await getLineContent(context.event.audio.id);
        } catch (err) {
            if (err === LineException.API_ERROR)
                replyMsg = "Get audio file error. please try again.";
            else if (err === LineException.FILE_LIMIT_EXCEEDED)
                replyMsg = "Audio too big. Please try a shorter audio.";
            else
                replyMsg = "Unknown error. Please consider filing the issue via 'issue' command";
        }
        try {
            const text = await olamiSpeech(toWav(audioBin), "bin");
            textHandler(context, text);
        } catch (err) {
            if (err === OlamiException.SEND_API_ERROR)
                replyMsg = "Failed to upload audio to Olami API.";
            else if (err === OlamiException.GET_RESULT_API_ERROR)
                replyMsg = "Failed to get result from Olami API.";
            else if (err === OlamiException.COOKIE_NOT_FOUND)
                replyMsg = "Lost cookie from Olami API.";
            else if (err === OlamiException.GET_RESULT_API_TIMEOUT)
                replyMsg = "Failed to get the result from Olami API due to timeout.";
            else if (err === OlamiException.INPUT_TYPE_ERROR)
                replyMsg = "Input is wrong.";
            else if (err === OlamiException.FILE_ERROR)
                replyMsg = "File is wrong."

            replyMsg += " Please try again. Or consider filing the issue via 'issue' command";

            await platformReplyText(context, replyMsg);
        }
    } else {
        replyMsg = "Not support this platform!";
        await platformReplyText(context, replyMsg);
    }

}

module.exports = audioHandler;