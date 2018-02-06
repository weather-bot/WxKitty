const {
    dbRead,
    dbWrite
} = require('./firebase');
const axios = require("axios");
const uploadImgur = require('./uploadImgur');


async function imagedb(cat, dbKey, imgUrl) {
    const dbData = await dbRead(`${cat}/${dbKey}`);
    let url = '';
    if (dbData == null || dbData.url == null) {
        const img = imgUrl;
        url = await uploadImgur(img);
        const result = await dbWrite(`${cat}/${dbKey}`, {
            url
        });
        if (result == null) {
            url = null;
        }
    } else {
        url = dbData.url;
    }
    return url;
}

module.exports = imagedb;