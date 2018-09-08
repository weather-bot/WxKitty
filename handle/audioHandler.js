const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fs = require('fs');
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

// Parse audio to text and then handle the text.
async function audioHandler(context) {
    let replyMsg = "";
    const time = Date.now(); // simply use time as uuid
    const inputFileName = `${time}.m4a`;
    const outputFileName = `${time}.wav`;

    if (context.platform == "line") {
        let audioBin;
        try {
            audioBin = await getLineContent(context.event.audio.id);
            fs.writeFileSync(inputFileName, audioBin);
            await exec(`ffmpeg -i ${inputFileName} ${outputFileName}`);
            fs.unlink(inputFileName, err => {
                if (err) logger.error(err);
            });
        } catch (err) {
            if (err === LineException.API_ERROR)
                replyMsg = "Get audio file error. please try again.";
            else if (err === LineException.FILE_LIMIT_EXCEEDED)
                replyMsg = "Audio too big. Please try a shorter audio.";
            else
                replyMsg = "Unknown error. Please consider filing the issue via 'issue' command";
        }
        try {
            const text = await olamiSpeech(outputFileName, "path");
            textHandler(context, text);
            fs.unlink(outputFileName, err => {
                if (err) logger.error(err);
            });
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
                replyMsg = "File is wrong.";
            else
                replyMsg = "Unknown error.";

            replyMsg += " Please try again. Or consider filing the issue via 'issue' command";

            await platformReplyText(context, replyMsg);
        }
    } else {
        replyMsg = "Not support this platform!";
        await platformReplyText(context, replyMsg);
    }

}

module.exports = audioHandler;