const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    console.log('HTTP 中间件')
    app.use('/apiv1/**', createProxyMiddleware({
        target: 'http://localhost:31101',
        changeOrigin: true,
        pathRewrite: { '^/apiv1': '' }
    }));
};