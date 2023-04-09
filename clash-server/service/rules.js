const path = require('path');
const fs = require('fs');

const genPath = (p) => {
    let root = (__dirname + '').replace(/(\\|\/)service/, '')
    console.log('genPath--', root);
    return path.join(root, p);
}

const baseConfig = (newData) => {
    let databasePath = genPath('/database/config.json');
    let datajson = {};
    try {
        if (!newData)
            datajson = JSON.parse(fs.readFileSync(databasePath, 'utf8'));
        else {
            datajson = newData;
            fs.writeFileSync(databasePath, JSON.stringify(newData), 'utf8');
        }
    } catch (error) {
        console.log('数据文件读取失败，尝试创建');
    }
    return datajson
}

const push = (rules = []) => {
    let datajson = baseConfig();
    !datajson.rules && (datajson.rules = []);
    rules.forEach(item => {
        datajson.rules.indexOf(item) === -1 && (datajson.rules.push(item))
    });
    baseConfig(datajson);
}

const query = () => {
    let config = baseConfig();
    return config.rules || []
}

module.exports = {
    push,
    query
}