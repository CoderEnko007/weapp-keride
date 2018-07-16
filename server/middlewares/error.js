const jwt = require('jsonwebtoken')
const config = require('../config')
const util = require('util')
const verify = util.promisify(jwt.verify)

/**
 * 判断token是否可用
 */
module.exports = function () {
  return async function (ctx, next) {
    try {
      const token = ctx.header.authorization;  // 获取jwt
      if(token) {
        let payload;
        try {
          payload = await verify(token.split(' ')[1], config.sign);  // 解密payload，获取用户名和ID
          // ctx.user中存放登陆者信息，可以在getUserInfo中获取
          ctx.user = {
            username: payload.username,
            id: payload.id,
          };
        } catch (err) {
          console.log('token verify fail: ', err)
        }
      }

      await next()
    } catch (err) {
      if (err.status === 401) {
        ctx.body = {
          code: 50014,
          data: {
            error: '认证失败'
          }
        }
      } else {
        err.status = 404;
        ctx.body = '404';
        console.log('不服就是怼：', err)
      }
    }
  }
}
