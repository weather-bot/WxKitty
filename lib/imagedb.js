const {
    dbRead,
    dbWrite
} = require('./firebase');
const uploadImgur = require('./uploadImgur');


async function imagedb(cat, dbKey, imgUrl) {
    const dbData = await dbRead(`${cat}/${dbKey}`);
    let url = '';
    if (dbData == null || dbData.url == null) {
        url = await uploadImgur(imgUrl);
        if (url != null) {
            const result = await dbWrite(`${cat}/${dbKey}`, {
                url
            });
            if (result == null) {
                url = null;
            }
        }
    } else {
        url = dbData.url;
    }
    return url;
}

module.exports = imagedb;