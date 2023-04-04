const router =  require('koa-router')();
const convert = require('../contoller/convert');

router.use('/convert', convert.routes(), convert.allowedMethods());

module.exports = router;