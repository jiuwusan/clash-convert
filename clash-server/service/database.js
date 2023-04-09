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
    let root = (__dirname + '').replace(/(\\|\/)service/, '')
    console.log('genPath--', root);
    return path.join(root, p);
}

const database = () => {
    let databasePath = genPath('/database/data.json');
    let datajson = {};
    try {
        datajson = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
    } catch (error) {
        console.log('读取数据文件失败，尝试创建');
    }
    return datajson
}

const push = (data, uid) => {
    let datajson = database();
    while (!uid) {
        // 防止重复覆盖
        let temp = UUID();
        if (!datajson[temp])
            uid = temp;
    }
    datajson[uid] = data;
    fs.writeFileSync(genPath('/database/data.json'), JSON.stringify(datajson), 'utf8')
    return uid
}

const query = (uid) => {
    let datajson = database();
    return datajson[uid]
}

module.exports = {
    push,
    query,
    UUID
}