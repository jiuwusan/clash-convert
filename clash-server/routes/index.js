const router =  require('koa-router')();
const convert = require('../contoller/convert');

router.use('/sub-api', convert.routes(), convert.allowedMethods());

module.exports = router;