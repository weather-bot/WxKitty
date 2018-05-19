const jieba = require("nodejieba");
const trans = require('chinese-conv');
const path = require("path");

jieba.load({
    // User's Words
    userDict: path.join(__dirname, '../data/jieba_userdict.utf8')
});

// nodejieba only support Simplified Chinese, so translate Traditonal to Simplified.
// After segment, translate back to Traditonal Chinese.
const segment = input => {
    const words = jieba.cut(trans.sify(input));
    const results = [];
    words.forEach(w => {
        results.push(trans.tify(w));
    })
    return results;
}
module.exports = segment;