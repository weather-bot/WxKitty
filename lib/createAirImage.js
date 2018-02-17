const download = require('image-downloader')
const mergeImages = require('merge-images')
const canvas = require('canvas');
const path = require('path')
const fs = require('fs')
async function createAirImage() {
    const epoch = new Date().getTime();
    const file1 = await download.image({
        url: `https://taqm.epa.gov.tw/taqm/Chart/AqiMap/map2.aspx?lang=tw&ts=${epoch}`,
        dest: __dirname
    })
    const file2 = await download.image({
        url: 'https://raw.githubusercontent.com/ntu-as-cooklab/weather-bot/master/img/air_symbol.png',
        dest: __dirname
    })
    const b64 = await mergeImages([{
            src: file1.filename,
            x: 0,
            y: 0
        },
        {
            src: file2.filename,
            x: 0,
            y: 721
        }
    ], {
        Canvas: canvas,
        width: 480,
        height: 864
    })

    const base64Data = b64.replace(/^data:image\/png;base64,/, "");

    // If want to output the image
    // fs.writeFileSync("out.png", base64Data, 'base64');

    return base64Data;
}

module.exports = createAirImage;