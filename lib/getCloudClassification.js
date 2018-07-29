'use strict';
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const path = require('path');
const fs = require('fs');
const fwrite = util.promisify(fs.writeFile);
const axios = require("axios");
const config = require("../config");

async function getCloudImg(context) {
    if (context.platform == "line") {
        try {
            const id = context.event.image.id;
            const res = await axios({
                method: 'get',
                url: `https://api.line.me/v2/bot/message/${id}/content`,
                responseType: 'arraybuffer',
                headers: {
                    'Authorization': `Bearer ${config.channelAccessToken}`
                }
            });
            console.log("get image binary");
            return res.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    } else if (context.platform == "telegram") {
        try {
            const id = context.event.photo[0].file_id;
            const url1 = `https://api.telegram.org/bot${config.telegramAccessToken}/getFile?file_id=${id}`;
            const res1 = await axios.get(url1);
            const fileInfo = res1.data;
            const url2 = `https://api.telegram.org/file/bot${config.telegramAccessToken}/${fileInfo.file_path}`;
            const res2 = await axios.get(url2, {
                responseType: 'arraybuffer'
            });
            return res2.data;
        } catch (err) {
            console.log(err);
            return null;
        }
    } else { // not support this platform
        return null;
    }
}

// Excute python to run DL
async function getCloudImgResult(filePath) {
    const pythonScript = path.join(__dirname, '../python/script/label_image.py');
    const labelFile = path.join(__dirname, '../python/model/retrained_labels.txt');
    const graphFile = path.join(__dirname, '../python/model/retrained_graph.pb');
    const command = `python ${pythonScript} ${filePath} ${labelFile} ${graphFile}`;
    const {
        stdout,
        stderr
    } = await exec(command);
    if (stderr) {
        console.log('stderr:', stderr);
        return null;
    }
    console.log('stdout:', stdout);
    return JSON.parse(stdout);
}

async function main(context) {
    const imgBin = await getCloudImg(context);
    if (!imgBin) {
        return null;
    }
    const fileName = `${(new Date()).getTime()}-${context.platform}.jpg`;
    await fwrite(fileName, imgBin).catch(error => console.log(error));
    const result = await getCloudImgResult(fileName);
    // We don't need to wait for file deletion.
    // Therefor we do not use `unlinkSync` here.
    fs.unlink(fileName, err => {
        if (err) {
            console.log(err);
        }
    });
    return result;
}

module.exports = main;