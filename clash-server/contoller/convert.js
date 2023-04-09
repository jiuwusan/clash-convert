const fs = require('fs');
const YAML = require('js-yaml');
const router = require('koa-router')();
const https = require('https')
const database = require('../service/database')
const rulesUtils = require('../service/rules')

const COUNTRYS = [{ "English": "HK", "Chinese": "香港", "id": "1001" },
{ "English": "TW", "Chinese": "台湾", "id": "1002" },
{ "English": "Singapore", "Chinese": "新加坡", "id": "1" },
{ "English": "Angola", "Chinese": "安哥拉", "id": "2" },
{ "English": "Albania", "Chinese": "阿尔巴尼亚", "id": "3" },
{ "English": "United Arab Emirates", "Chinese": "阿联酋", "id": "4" },
{ "English": "Argentina", "Chinese": "阿根廷", "id": "5" },
{ "English": "Armenia", "Chinese": "亚美尼亚", "id": "6" },
{ "English": "French Southern and Antarctic Lands", "Chinese": "法属南半球和南极领地", "id": "7" },
{ "English": "Australia", "Chinese": "澳大利亚", "id": "8" },
{ "English": "Austria", "Chinese": "奥地利", "id": "9" },
{ "English": "Azerbaijan", "Chinese": "阿塞拜疆", "id": "10" },
{ "English": "Burundi", "Chinese": "布隆迪", "id": "11" },
{ "English": "Belgium", "Chinese": "比利时", "id": "12" },
{ "English": "Benin", "Chinese": "贝宁", "id": "13" },
{ "English": "Burkina Faso", "Chinese": "布基纳法索", "id": "14" },
{ "English": "Bangladesh", "Chinese": "孟加拉国", "id": "15" },
{ "English": "Bulgaria", "Chinese": "保加利亚", "id": "16" },
{ "English": "The Bahamas", "Chinese": "巴哈马", "id": "17" },
{ "English": "Bosnia and Herzegovina", "Chinese": "波斯尼亚和黑塞哥维那", "id": "18" },
{ "English": "Belarus", "Chinese": "白俄罗斯", "id": "19" },
{ "English": "Belize", "Chinese": "伯利兹", "id": "20" },
{ "English": "Bermuda", "Chinese": "百慕大", "id": "21" },
{ "English": "Bolivia", "Chinese": "玻利维亚", "id": "22" },
{ "English": "Brazil", "Chinese": "巴西", "id": "23" },
{ "English": "Brunei", "Chinese": "文莱", "id": "24" },
{ "English": "Bhutan", "Chinese": "不丹", "id": "25" },
{ "English": "Botswana", "Chinese": "博茨瓦纳", "id": "26" },
{ "English": "Central African Republic", "Chinese": "中非共和国", "id": "27" },
{ "English": "Canada", "Chinese": "加拿大", "id": "28" },
{ "English": "Switzerland", "Chinese": "瑞士", "id": "29" },
{ "English": "Chile", "Chinese": "智利", "id": "30" },
{ "English": "China", "Chinese": "中国", "id": "31" },
{ "English": "Ivory Coast", "Chinese": "象牙海岸", "id": "32" },
{ "English": "Cameroon", "Chinese": "喀麦隆", "id": "33" },
{ "English": "Democratic Republic of the Congo", "Chinese": "刚果民主共和国", "id": "34" },
{ "English": "Republic of the Congo", "Chinese": "刚果共和国", "id": "35" },
{ "English": "Colombia", "Chinese": "哥伦比亚", "id": "36" },
{ "English": "Costa Rica", "Chinese": "哥斯达黎加", "id": "37" },
{ "English": "Cuba", "Chinese": "古巴", "id": "38" },
{ "English": "Northern Cyprus", "Chinese": "北塞浦路斯", "id": "39" },
{ "English": "Cyprus", "Chinese": "塞浦路斯", "id": "40" },
{ "English": "Czech Republic", "Chinese": "捷克共和国", "id": "41" },
{ "English": "Germany", "Chinese": "德国", "id": "42" },
{ "English": "Djibouti", "Chinese": "吉布提", "id": "43" },
{ "English": "Denmark", "Chinese": "丹麦", "id": "44" },
{ "English": "Dominican Republic", "Chinese": "多明尼加共和国", "id": "45" },
{ "English": "Algeria", "Chinese": "阿尔及利亚", "id": "46" },
{ "English": "Ecuador", "Chinese": "厄瓜多尔", "id": "47" },
{ "English": "Egypt", "Chinese": "埃及", "id": "48" },
{ "English": "Eritrea", "Chinese": "厄立特里亚", "id": "49" },
{ "English": "Spain", "Chinese": "西班牙", "id": "50" },
{ "English": "Estonia", "Chinese": "爱沙尼亚", "id": "51" },
{ "English": "Ethiopia", "Chinese": "埃塞俄比亚", "id": "52" },
{ "English": "Finland", "Chinese": "芬兰", "id": "53" },
{ "English": "Fiji", "Chinese": "斐", "id": "54" },
{ "English": "Falkland Islands", "Chinese": "福克兰群岛", "id": "55" },
{ "English": "France", "Chinese": "法国", "id": "56" },
{ "English": "Gabon", "Chinese": "加蓬", "id": "57" },
{ "English": "United Kingdom", "Chinese": "英国", "id": "58" },
{ "English": "Georgia", "Chinese": "格鲁吉亚", "id": "59" },
{ "English": "Ghana", "Chinese": "加纳", "id": "60" },
{ "English": "Guinea", "Chinese": "几内亚", "id": "61" },
{ "English": "Gambia", "Chinese": "冈比亚", "id": "62" },
{ "English": "Guinea Bissau", "Chinese": "几内亚比绍", "id": "63" },
{ "English": "Equatorial Guinea", "Chinese": "赤道几内亚", "id": "64" },
{ "English": "Greece", "Chinese": "希腊", "id": "65" },
{ "English": "Greenland", "Chinese": "格陵兰", "id": "66" },
{ "English": "Guatemala", "Chinese": "危地马拉", "id": "67" },
{ "English": "French Guiana", "Chinese": "法属圭亚那", "id": "68" },
{ "English": "Guyana", "Chinese": "圭亚那", "id": "69" },
{ "English": "Honduras", "Chinese": "洪都拉斯", "id": "70" },
{ "English": "Croatia", "Chinese": "克罗地亚", "id": "71" },
{ "English": "Haiti", "Chinese": "海地", "id": "72" },
{ "English": "Hungary", "Chinese": "匈牙利", "id": "73" },
{ "English": "Indonesia", "Chinese": "印尼", "id": "74" },
{ "English": "India", "Chinese": "印度", "id": "75" },
{ "English": "Ireland", "Chinese": "爱尔兰", "id": "76" },
{ "English": "Iran", "Chinese": "伊朗", "id": "77" },
{ "English": "Iraq", "Chinese": "伊拉克", "id": "78" },
{ "English": "Iceland", "Chinese": "冰岛", "id": "79" },
{ "English": "Israel", "Chinese": "以色列", "id": "80" },
{ "English": "Italy", "Chinese": "意大利", "id": "81" },
{ "English": "Jamaica", "Chinese": "牙买加", "id": "82" },
{ "English": "Jordan", "Chinese": "约旦", "id": "83" },
{ "English": "Japan", "Chinese": "日本", "id": "84" },
{ "English": "Kazakhstan", "Chinese": "哈萨克斯坦", "id": "85" },
{ "English": "Kenya", "Chinese": "肯尼亚", "id": "86" },
{ "English": "Kyrgyzstan", "Chinese": "吉尔吉斯斯坦", "id": "87" },
{ "English": "Cambodia", "Chinese": "柬埔寨", "id": "88" },
{ "English": "South Korea", "Chinese": "韩国", "id": "89" },
{ "English": "Kosovo", "Chinese": "科索沃", "id": "90" },
{ "English": "Kuwait", "Chinese": "科威特", "id": "91" },
{ "English": "Laos", "Chinese": "老挝", "id": "92" },
{ "English": "Lebanon", "Chinese": "黎巴嫩", "id": "93" },
{ "English": "Liberia", "Chinese": "利比里亚", "id": "94" },
{ "English": "Libya", "Chinese": "利比亚", "id": "95" },
{ "English": "Sri Lanka", "Chinese": "斯里兰卡", "id": "96" },
{ "English": "Lesotho", "Chinese": "莱索托", "id": "97" },
{ "English": "Lithuania", "Chinese": "立陶宛", "id": "98" },
{ "English": "Luxembourg", "Chinese": "卢森堡", "id": "99" },
{ "English": "Latvia", "Chinese": "拉脱维亚", "id": "100" },
{ "English": "Morocco", "Chinese": "摩洛哥", "id": "101" },
{ "English": "Moldova", "Chinese": "摩尔多瓦", "id": "102" },
{ "English": "Madagascar", "Chinese": "马达加斯加", "id": "103" },
{ "English": "Mexico", "Chinese": "墨西哥", "id": "104" },
{ "English": "Macedonia", "Chinese": "马其顿", "id": "105" },
{ "English": "Mali", "Chinese": "马里", "id": "106" },
{ "English": "Myanmar", "Chinese": "缅甸", "id": "107" },
{ "English": "Montenegro", "Chinese": "黑山", "id": "108" },
{ "English": "Mongolia", "Chinese": "蒙古", "id": "109" },
{ "English": "Mozambique", "Chinese": "莫桑比克", "id": "110" },
{ "English": "Mauritania", "Chinese": "毛里塔尼亚", "id": "111" },
{ "English": "Malawi", "Chinese": "马拉维", "id": "112" },
{ "English": "Malaysia", "Chinese": "马来西亚", "id": "113" },
{ "English": "Namibia", "Chinese": "纳米比亚", "id": "114" },
{ "English": "New Caledonia", "Chinese": "新喀里多尼亚", "id": "115" },
{ "English": "Niger", "Chinese": "尼日尔", "id": "116" },
{ "English": "Nigeria", "Chinese": "尼日利亚", "id": "117" },
{ "English": "Nicaragua", "Chinese": "尼加拉瓜", "id": "118" },
{ "English": "Netherlands", "Chinese": "荷兰", "id": "119" },
{ "English": "Norway", "Chinese": "挪威", "id": "120" },
{ "English": "Nepal", "Chinese": "尼泊尔", "id": "121" },
{ "English": "New Zealand", "Chinese": "新西兰", "id": "122" },
{ "English": "Oman", "Chinese": "阿曼", "id": "123" },
{ "English": "Pakistan", "Chinese": "巴基斯坦", "id": "124" },
{ "English": "Panama", "Chinese": "巴拿马", "id": "125" },
{ "English": "Peru", "Chinese": "秘鲁", "id": "126" },
{ "English": "Philippines", "Chinese": "菲律宾", "id": "127" },
{ "English": "Papua New Guinea", "Chinese": "巴布亚新几内亚", "id": "128" },
{ "English": "Poland", "Chinese": "波兰", "id": "129" },
{ "English": "Puerto Rico", "Chinese": "波多黎各", "id": "130" },
{ "English": "North Korea", "Chinese": "北朝鲜", "id": "131" },
{ "English": "Portugal", "Chinese": "葡萄牙", "id": "132" },
{ "English": "Paraguay", "Chinese": "巴拉圭", "id": "133" },
{ "English": "Qatar", "Chinese": "卡塔尔", "id": "134" },
{ "English": "Romania", "Chinese": "罗马尼亚", "id": "135" },
{ "English": "Russia", "Chinese": "俄罗斯", "id": "136" },
{ "English": "Rwanda", "Chinese": "卢旺达", "id": "137" },
{ "English": "Western Sahara", "Chinese": "西撒哈拉", "id": "138" },
{ "English": "Saudi Arabia", "Chinese": "沙特阿拉伯", "id": "139" },
{ "English": "Sudan", "Chinese": "苏丹", "id": "140" },
{ "English": "South Sudan", "Chinese": "南苏丹", "id": "141" },
{ "English": "Senegal", "Chinese": "塞内加尔", "id": "142" },
{ "English": "Solomon Islands", "Chinese": "所罗门群岛", "id": "143" },
{ "English": "Sierra Leone", "Chinese": "塞拉利昂", "id": "144" },
{ "English": "El Salvador", "Chinese": "萨尔瓦多", "id": "145" },
{ "English": "Somaliland", "Chinese": "索马里兰", "id": "146" },
{ "English": "Somalia", "Chinese": "索马里", "id": "147" },
{ "English": "Republic of Serbia", "Chinese": "塞尔维亚", "id": "148" },
{ "English": "Suriname", "Chinese": "苏里南", "id": "149" },
{ "English": "Slovakia", "Chinese": "斯洛伐克", "id": "150" },
{ "English": "Slovenia", "Chinese": "斯洛文尼亚", "id": "151" },
{ "English": "Sweden", "Chinese": "瑞典", "id": "152" },
{ "English": "Swaziland", "Chinese": "斯威士兰", "id": "153" },
{ "English": "Syria", "Chinese": "叙利亚", "id": "154" },
{ "English": "Chad", "Chinese": "乍得", "id": "155" },
{ "English": "Togo", "Chinese": "多哥", "id": "156" },
{ "English": "Thailand", "Chinese": "泰国", "id": "157" },
{ "English": "Tajikistan", "Chinese": "塔吉克斯坦", "id": "158" },
{ "English": "Turkmenistan", "Chinese": "土库曼斯坦", "id": "159" },
{ "English": "East Timor", "Chinese": "东帝汶", "id": "160" },
{ "English": "Trinidad and Tobago", "Chinese": "特里尼达和多巴哥", "id": "161" },
{ "English": "Tunisia", "Chinese": "突尼斯", "id": "162" },
{ "English": "Turkey", "Chinese": "土耳其", "id": "163" },
{ "English": "United Republic of Tanzania", "Chinese": "坦桑尼亚", "id": "164" },
{ "English": "Uganda", "Chinese": "乌干达", "id": "165" },
{ "English": "Ukraine", "Chinese": "乌克兰", "id": "166" },
{ "English": "Uruguay", "Chinese": "乌拉圭", "id": "167" },
{ "English": "United States of America", "Chinese": "美国", "id": "168" },
{ "English": "Uzbekistan", "Chinese": "乌兹别克斯坦", "id": "169" },
{ "English": "Venezuela", "Chinese": "委内瑞拉", "id": "170" },
{ "English": "Vietnam", "Chinese": "越南", "id": "171" },
{ "English": "Vanuatu", "Chinese": "瓦努阿图", "id": "172" },
{ "English": "West Bank", "Chinese": "西岸", "id": "173" },
{ "English": "Yemen", "Chinese": "也门", "id": "174" },
{ "English": "South Africa", "Chinese": "南非", "id": "175" },
{ "English": "Zambia", "Chinese": "赞比亚", "id": "176" },
{ "English": "Zimbabwe", "Chinese": "津巴布韦", "id": "177" }]

const getCountry = (node) => {
    let result;
    for (let i = 0; i < COUNTRYS.length; i++) {
        if (node.indexOf(COUNTRYS[i].Chinese) > -1) {
            result = COUNTRYS[i];
            break;
        }
    }
    console.log(node, ' ->  getCountry====', result);
    return result;
}


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
            let sub = YAML.load(await readFileNetwork(config.urls[i]));
            proxies.push.apply(proxies, sub.proxies);
        } catch (error) {
            console.log(`${config.urls[i]} 订阅出错`);
        }
    }

    // proxies = proxies.map((item) => {
    //     item.name = item.name.replace(/\ +/g, ' ')
    //     return item
    // });

    // 分组
    let proxyGroups = proxies.reduce((prev, next) => {
        let country = getCountry(next.name);
        if (country)
            if (prev[country.Chinese])
                prev[country.Chinese].push(next.name)
            else
                prev[country.Chinese] = [next.name]
        return prev
    }, {})

    // 构建 
    config.proxies = proxies;

    let selectIdx = config['proxy-groups'].findIndex((item) => {
        return item.name.indexOf('节点选择' > -1)
    })

    let emojis = ['🐯', '🦁', '🐮', '🐷', '🐸', '🐔', '🐧', '🐦', '🐌', '🦋', '🐍', '🐓',
        '🐫', '🐙', '🦑', '🦐', '🦞', '🦀', '🕊', '🦩', '🦒', '🦮', '🐀', '🐿',
        '🦎', '🦖', '🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼', '🐻‍❄️', '🐨']

    for (const key in proxyGroups) {
        if (Object.hasOwnProperty.call(proxyGroups, key)) {
            let size = config['proxy-groups'][selectIdx].proxies.length;
            config['proxy-groups'][selectIdx].proxies.splice(size - 1, 0, `${emojis[size]} ${key} - Auto`);
            config['proxy-groups'].push({
                name: `${emojis[size]} ${key} - Auto`,
                type: 'url-test',
                url: 'http://www.gstatic.com/generate_204',
                interval: 180,
                proxies: proxyGroups[key]
            })
        }
    }

    let rules = YAML.load(fs.readFileSync(ctx.genPath('/template/rules.yaml'), 'utf8')).rules;
    rules.splice(10, 0, ...config['cus-rules']);
    config.rules = rules;
    ctx.set('Content-disposition', `attachment;filename=${config.rename}.yaml`);
    ctx.set('Content-type', 'application/yaml');
    delete config.rename;
    delete config['cus-rules'];
    delete config.urls;
    // 通用配置
    let clash = YAML.load(fs.readFileSync(ctx.genPath('/template/clash.yaml'), 'utf8'));
    let lastConfig = { ...clash, proxies: config.proxies, 'proxy-groups': config['proxy-groups'], rules: config.rules }
    ctx.body = YAML.dump(lastConfig)
}


const genLink = (ctx) => {
    let { urls, rename = 'config', proxyGroups, cusRules, client, baseApi = '' } = ctx.request.body;

    let data = {
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

    let uid = database.push(data);

    ctx.body = {
        code: 0,
        data: {
            rss: `${baseApi}/rss?uid=${uid}`
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
    let { rules } = ctx.request.body;
    rules = rules ? rules.split('\n').map((item) => {
        item = item.replace(/^(\ *-*\ *)/, '');
        return item
    }) : []
    rulesUtils.push(rules);

    ctx.body = {
        code: 0,
        data: {},
        msg: '成功'
    }

}

router.get('/rss', convert);
router.post('/link', genLink);
router.get('/rules', getRules);
router.post('/rules/push', pushRules);

module.exports = router