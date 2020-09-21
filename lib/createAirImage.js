const download = require('image-downloader')
const mergeImages = require('merge-images')
const canvas = require('canvas');
const imagedb = require('./imagedb');
const parseTime = require('./parseTime')
const path = require('path')
const fs = require('fs')
async function createAirImage() {
    let url = '';
    const date = new Date().toLocaleString('en-us', {year: 'numeric',
month: '2-digit',
day: '2-digit'}).
        replace(/(\d+)\/(\d+)\/(\d+)/, '$3$1$2');
    try {
        let timeStr = ('0000' + new Date().getHours() + '0000').substr(-6)
        const file1 = await download.image({
            url: `https://airtw.epa.gov.tw//ModelSimulate/${date}/output_AQI_${date+timeStr}.png`, // ?lang=tw&ts=${epoch}`,
            dest: path.join(__dirname, "../img")
        })
        const b64 = await mergeImages([{
                src: file1.filename,
                x: 160,
                y: 0
            },
            {
                src: path.join(__dirname, "../img/air_symbol.png"),
                x: 0,
                y: 400
            }
        ], {
            Canvas: canvas,
            width: 480,
            height: 550
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
