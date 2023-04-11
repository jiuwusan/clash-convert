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
        let dataStr = fs.readFileSync(databasePath, 'utf8');
        datajson = JSON.parse(dataStr);
    } catch (error) {
        console.log('读取数据文件失败');
    }
    return datajson
}

/**
 * 
 * @param {*} data 
 * @param {*} uid 覆盖更新
 * @returns 
 */
const push = (data, uid) => {
    let datajson = database();
    let config = datajson[uid];
    data.secret = Buffer.from(data.secret, "base64").toString();
    if (config && data.secret !== config.secret)
        throw new Error('SecretKey 验证失败')
        
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