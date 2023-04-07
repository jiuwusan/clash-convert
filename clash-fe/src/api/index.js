import ApiGenerator from './ApiGenerator'
import request from './request'

const { genApi } = new ApiGenerator(request, '', (config) => {
    return config
}, (res) => {
    if (res.code !== 0) {
        // 错误处理
    }
    return res
});

/**
 * Api 字典
 */
const convertApi = genApi({
    // 获取列表
    link: 'POST /sub-api/link',
    rules: '/sub-api/rules'
})

const API = {
    convertApi
}

export default API