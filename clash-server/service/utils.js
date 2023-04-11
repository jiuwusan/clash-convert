function baseStr2proxies(baseStr) {
    let result = Buffer.from(baseStr, "base64").toString();
    // proxies:
    //   - name: 香港-01 - 5doksR
    //     type: ss
    //     server: sczx.bzlxzl.com
    //     port: 57001
    //     cipher: chacha20-ietf-poly1305
    //     password: ojhAGa
    //     udp: true
    result = decodeURIComponent(result);
    let proxies = result.split('\n');
    proxies = proxies.map((item) => {
        if (item) {
            item = item.replace(/ss:\/\//, '')
            let itemArr = item.split('@');
            let skey = Buffer.from(itemArr[0], "base64").toString().split(':');
            let serverStr = itemArr[1].split('/?');
            let hostArr = serverStr[0].split(':');
            let lastStr = serverStr[1].split('#');
            let pluginStr = lastStr[0].split(';').map((p) => {
                console.log(p)
                p = p.split('=')
                return p[1]
            });

            let proxie = {
                name: lastStr[1].replace('\r', ''),
                type: 'ss',
                server: hostArr[0],
                port: Number(hostArr[1]),
                cipher: skey[0],
                password: skey[1],
                plugin: 'obfs',
                'plugin-opts': { mode: pluginStr[1], host: pluginStr[2] },
                // tfo: true,
                udp: true,
            }

            return proxie
        }
        console.log('item---',item)
        return item
    })
    proxies.pop();
    return { proxies }
}

const isBase64 = (str) => {
    return Buffer.from(str, 'base64').toString('base64') === str
}

module.exports = {
    baseStr2proxies,
    isBase64
}