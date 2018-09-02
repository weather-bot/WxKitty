const URL = require('../data/public_url.json');
const config = require('../config');
const fs = require('fs');
const axios = require("axios");
const md5 = require('md5');
const path = require('path');

const OlamiException = {
    SEND_API_ERROR: 0,
    GET_RESULT_API_ERROR: 1,
    COOKIE_NOT_FOUND: 2,
    GET_RESULT_API_TIMEOUT: 3,
    FILE_ERROR: 4,
    INPUT_TYPE_ERROR: 5,
}

// API parametes
// https://tw.olami.ai/wiki/?mp=api_asr&content=api_asr2.html#請求參數說明
function OlamiSpeech(file, type) {
    this.apiType = "asr";
    this.apiKey = config.olamiAiKey;
    this.apiSecret = config.olamiAiSecret;
    this.apiBaseUrl = URL.OLAMI_SPEECH_API_URL;
    this.seq = "seg";
    this.compress = 0; // normal file
    this.type = type;
    this.file = file;
    this.cookies;
}

OlamiSpeech.prototype.sendFile = async function () {
    const url = this.getBaseQueryUrl();

    let data;
    if (this.type == "path") {
        try {
            data = fs.readFileSync(this.file)
        } catch (e) {
            console.log(e);
            throw OlamiException.FILE_ERROR;
        }
    } else if (this.type == "bin") {
        data = this.file;
    } else {
        throw OlamiException.INPUT_TYPE_ERROR;
    }

    try {
        const res = await axios({
            method: 'post',
            url,
            data,
            headers: {
                'Content-Type': 'application/octet-stream',
                'Connection': 'Keep-Alive',
                'Content-Length': data.length
            }
        });

        if (res.data.status != "ok")
            throw OlamiException.SEND_API_ERROR;

        this.cookies = res.headers['set-cookie'];

    } catch (err) {
        console.log(err);
        throw OlamiException.SEND_API_ERROR;
    }
    if (!this.cookies)
        throw OlamiException.COOKIE_NOT_FOUND;
}

OlamiSpeech.prototype.getResult = async function () {
    const url = this.getBaseQueryUrl();
    let result = "";

    try {
        let startTime = Date.now();

        while (Date.now() - startTime < 3000) { // timeout

            const res = await axios({
                method: 'gets',
                url,
                headers: {
                    'Cookie': this.cookies
                }
            });

            if (res.data.status != "ok")
                throw OlamiException.GET_RESULT_API_ERROR;

            if (res.data.data.asr.final) {
                result = res.data.data.asr.result;
                break;
            }

        }

        if (result == "") {
            throw OlamiException.GET_RESULT_API_TIMEOUT;
        }

    } catch (err) {
        console.log(err);
        throw OlamiException.GET_RESULT_API_ERROR;
    }

    return result;
}

OlamiSpeech.prototype.getBaseQueryUrl = function () {
    const timestamp = Date.now();

    // The rule followed by
    // https://tw.olami.ai/wiki/?mp=api_asr&content=api_asr1.html#sign-請求參數說明
    let sign = '';
    sign += this.apiSecret;
    sign += 'api=';
    sign += this.apiType;
    sign += 'appkey=';
    sign += this.apiKey;
    sign += 'timestamp=';
    sign += timestamp;
    sign += this.apiSecret;
    // Generate MD5 digest.
    sign = md5(sign);

    let url = '';
    url += this.apiBaseUrl + '?_from=nodejs';
    url += '&appkey=' + this.apiKey;
    url += '&api=';
    url += this.apiType;
    url += '&timestamp=' + timestamp;
    url += '&sign=' + sign;
    url += '&seq=' + this.seq;
    url += `&stop=1&compress=0`;

    return url;
}

/**
 * @param {path | Buffer} file: file path or file buffer
 * @param {String} type: `"path"` or `"bin"`
 * @return {String} recognized string
 */
async function olamiSpeech(file, type) {
    const ol = new OlamiSpeech(file, type);
    await ol.sendFile();
    return await ol.getResult();
}

module.exports = {
    olamiSpeech,
    OlamiException
};