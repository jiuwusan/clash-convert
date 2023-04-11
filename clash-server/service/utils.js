function baseStr2proxies(baseStr) {
    let rss = Buffer.from(baseStr, "base64").toString();
    rss = decodeURIComponent(rss).split('\n');
    let proxies = [];
    for (let i = 0; i < rss.length; i++) {
        let item = rss[i];
        if (!item) continue;
        //开始解析
        // 加密方式 ss:\/\/(.+)@
        // 域名 @(.+):
        // 端口 :(\d+)/
        // 插件 (plugin.+)#
        // 名称 #(.+)
        let type = 'ss';
        let secret = item.match(/ss:\/\/(.+)@/)[1];
        let [cipher, password] = Buffer.from(secret, "base64").toString().split(':');
        let server = item.match(/@(.+):/)[1];
        let port = Number(item.match(/:(\d+)\//)[1]);
        let [plugin, mode, host] = item.match(/(plugin.+)#/)[1].split(';').map((p) => p.split('=')[1]);
        let name = item.match(/#(.+)/)[1];
        proxies.push({
            name,
            type,
            server,
            port,
            cipher,
            password,
            plugin: 'obfs',
            'plugin-opts': { mode, host },
            udp: true
        })
    }
    return {
        proxies
    }
}

const isBase64 = (str) => {
    return Buffer.from(str, 'base64').toString('base64') === str
}

module.exports = {
    baseStr2proxies,
    isBase64
}