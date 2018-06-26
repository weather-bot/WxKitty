const {
    dbPush,
    dbRead
} = require('./firebase');

class Messagedb {
    constructor() {
        // default path to store data
        this.path = 'message2';
    }
    async write(msg, _path) {
        const path = _path || this.path;
        return await dbPush(path, `"${msg}"`);
    }

    async read(_path) {
        const path = _path || this.path;
        return await dbRead(path);
    }
}

const messagedb = new Messagedb();
module.exports = messagedb;