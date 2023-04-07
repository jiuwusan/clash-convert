const path = require('path');
const fs = require('fs');

const UUID = (max = 6) => {
    let uid = '';
    let strs = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charLength = strs.length;
    for (let i = 0; i < max; i++) {
        uid += strs.charAt(Math.floor(Math.random() * charLength));
    }
    return uid
}

const genPath = (p) => {
    return path.join(__dirname, p);
}

const database = () => {
    let databasePath = genPath('/data.json');
    let datajson = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
    return datajson
}

const push = (data) => {
    let datajson = database();
    let uid;
    while (!uid) {
        // 防止重复覆盖
        let temp = UUID();
        if (!datajson[temp])
            uid = temp;
    }
    datajson[uid] = data;
    fs.writeFileSync(genPath('/data.json'), JSON.stringify(datajson), 'utf8')
    return uid
}

const query = (uid) => {
    let datajson = database();
    return datajson[uid]
}

module.exports = {
    push,
    query
}