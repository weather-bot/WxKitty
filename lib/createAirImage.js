const download = require('image-downloader')
const mergeImages = require('merge-images')
const canvas = require('canvas');
const imagedb = require('./imagedb');
const parseTime = require('./parseTime')
const path = require('path')
const fs = require('fs')
async function createAirImage() {
    let url = '';
    const epoch = new Date().getTime();
    try {
        const file1 = await download.image({
            url: `https://taqm.epa.gov.tw/taqm/Chart/AqiMap/map2.aspx?lang=tw&ts=${epoch}`,
            dest: path.join(__dirname, "../img")
        })
        const b64 = await mergeImages([{
                src: file1.filename,
                x: 0,
                y: 0
            },
            {
                src: path.join(__dirname, "../img/air_symbol.png"),
                x: 0,
                y: 721
            }
        ], {
            Canvas: canvas,
            width: 480,
            height: 864
        })
        const base64Data = b64.replace(/^data:image\/png;base64,/, "");

        /* If want to output the image */
        // fs.writeFileSync("out.png", base64Data, 'base64');

        const d = parseTime();
        const dbKey = `${d.year}${d.month}${d.day}${d.hour}`;
        url = await imagedb('air', dbKey, base64Data)

        fs.unlink(file1.filename);
    } catch (err) {
        console.log(err);
        url = null;
    }
    return url;
}

module.exports = createAirImage;