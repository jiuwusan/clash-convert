const fs = require('fs');
const YAML = require('js-yaml');
const router = require('koa-router')();
const https = require('https')
const database = require('../service/database')
const rulesUtils = require('../service/rules')
const utils = require('../service/utils')
const countrys = require('../service/countrys')

const readFileNetwork = (url) => {
    console.log(`开始订阅 ${url}`)
    return new Promise((resolve, reject) => {
        https.get(url, function (response) {
            response.setEncoding('utf8');  //二进制binary
            let result = '';
            response.on('data', function (data) {    //加载到内存
                result += data;
            }).on('end', function () {          //加载完
                // let fileBuffer = new Buffer( result, 'binary' );
                // resolve(fileBuffer.toString('utf8'))
                resolve(result);
            }).on('error', function (err) {          //加载完
                reject(err)
            })
        })
    })
}

/**
 * 查询列表
 * 
 * @param {*} ctx 
 */
const convert = async (ctx) => {
    let { uid } = ctx.request.query;
    let config = {}
    if (uid) // 读取 JSON
        config = database.query(uid);
    let proxies = [];

    for (let i = 0; i < config.urls.length; i++) {
        try {
            let subStr = await readFileNetwork(config.urls[i]);
            let sub = { proxies: [] }
            if (utils.isBase64(subStr))
                sub = utils.baseStr2proxies(subStr)
            else
                sub = YAML.load(subStr);
            proxies.push.apply(proxies, sub.proxies);
        } catch (error) {
            console.log(`${config.urls[i]} 订阅出错`);
        }
    }

    proxies = proxies.map((item) => {
        item.name = `${item.name} - ${database.UUID()}`;
        return item
    })

    // 手动分组
    let manualProxies = []

    // 分组
    let proxyGroups = proxies.reduce((prev, next) => {
        let country = countrys.match(next.name);
        if (country)
            if (prev[country.translation])
                prev[country.translation].push(next.name)
            else
                prev[country.translation] = [next.name]
        manualProxies.push(next.name)
        return prev
    }, {})

    // 构建 
    config.proxies = proxies;

    let selectIdx = config['proxy-groups'].findIndex((item) => {
        return item.name.indexOf('节点选择' > -1)
    })

    config['proxy-groups'].splice(selectIdx + 1, 0, {
        name: '🥇 手动选择',
        type: 'select',
        proxies: manualProxies
    })

    let worldIdx = selectIdx + 2;

    config['proxy-groups'].splice(worldIdx, 0, {
        name: '🌐 环游世界',
        type: 'url-test',
        url: 'http://www.gstatic.com/generate_204',
        interval: 60,
        proxies: [],
    })

    let selectWorldIdx = config['proxy-groups'].findIndex((item) => (item.name.indexOf('环游世界' > -1)));
    if (selectWorldIdx === -1 && (selectWorldIdx = 0))
        config['proxy-groups'][selectIdx].proxies.unshift('🌐 环游世界')
    config['proxy-groups'][selectIdx].proxies.splice(selectWorldIdx, 0, '🥇 手动选择')
    let emojis = countrys.flagFn();

    for (const key in proxyGroups) {
        if (Object.hasOwnProperty.call(proxyGroups, key)) {
            let size = config['proxy-groups'][selectIdx].proxies.length;
            let flag = emojis();
            let name = `${flag} ${key} - Auto`;
            config['proxy-groups'][selectIdx].proxies.splice(size - 1, 0, name);
            config['proxy-groups'][worldIdx].proxies.push(name);
            config['proxy-groups'].push({
                name,
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 180,
                proxies: proxyGroups[key]
            })
        }
    }

    let rules = YAML.load(fs.readFileSync(ctx.genPath('/template/rules.yaml'), 'utf8')).rules;
    rules.splice(10, 0, ...[...config['cus-rules'], ...rulesUtils.query(rules)]);
    config.rules = rules;
    ctx.set('Content-disposition', `attachment;filename=${config.rename}.yaml`);
    ctx.set('Content-type', 'application/yaml');
    delete config.rename;
    delete config['cus-rules'];
    delete config.urls;
    delete config.secret;
    // 通用配置
    let clash = YAML.load(fs.readFileSync(ctx.genPath('/template/clash.yaml'), 'utf8'));
    let lastConfig = { ...clash, proxies: config.proxies, 'proxy-groups': config['proxy-groups'], rules: config.rules }
    ctx.body = YAML.dump(lastConfig)
}


const genLink = (ctx) => {
    let { urls, rename = 'config', proxyGroups, cusRules, client, baseApi = '', uid, secret = '' } = ctx.request.body;

    let data = {
        secret,
        rename,
        urls: urls.split('\n'),
        proxies: [],
        'proxy-groups': proxyGroups.map((item) => {
            // 交换 位置
            let i = item.checked || 0;
            let temp = item.proxies[i];
            item.proxies[i] = item.proxies[0];
            item.proxies[0] = temp;
            return item
        }),
        'cus-rules': cusRules ? cusRules.split('\n').map((item) => {
            item = item.replace(/^(\ *-*\ *)/, '');
            return item
        }) : [],
    }

    let rss = database.push(data, uid);

    ctx.body = {
        code: 0,
        data: {
            rss: `${baseApi}/rss?uid=${rss}`
        }
    }

}

const getRules = (ctx) => {
    let templatePath = ctx.genPath('/template/group.yaml');
    let template = YAML.load(fs.readFileSync(templatePath, 'utf8'));

    ctx.body = {
        code: 0,
        data: template['proxy-groups']
    }

}

const pushRules = (ctx) => {
    let { rules, uid } = ctx.request.query;

    rules = rules ? rules.split('\n').map((item) => {
        item = item.replace(/^(\ *-*\ *)/, '');
        return item
    }) : []

    if (!uid) {
        rulesUtils.push(rules);
    } else {
        let config = database.query(uid);
        rules.forEach(item => {
            config['cus-rules'].indexOf(item) === -1 && (config['cus-rules'].push(item))
        });
        database.push(config, uid);
    }
    ctx.body = {
        code: 0,
        data: {},
        msg: '成功'
    }

}

router.get('/rss', convert);
router.post('/link', genLink);
router.get('/rules', getRules);
router.get('/rules/push', pushRules);

module.exports = router