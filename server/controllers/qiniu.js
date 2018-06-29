/*
七牛云配置
*/
const jwt = require('jsonwebtoken')
const config = require('../config')
const util = require('util')
const verify = util.promisify(jwt.verify)
const qiniu = require('qiniu')

// 创建上传凭证
const accessKey = 'ybJ6Taf7Biv7nJFWMCzfxdOOKu7eVhV9bBOihqkU';
const secretKey = '-aqo7n5chvRpsI90GGdHcszv7oSCpWpkYxrfD7iR';
const mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
const options = {
  scope: 'image',
  expires: 7200
};

async function get(ctx) {
  const token = ctx.header.authorization;
  if(token) {
    let payload;
    try {
      payload = await verify(token.split(' ')[1], config.sign);  // 解密payload，获取用户名和ID
      // ctx.user中存放登陆者信息，可以在getUserInfo中获取
      console.log(payload)

      const putPolicy = new qiniu.rs.PutPolicy(options);
      const uploadToken = putPolicy.uploadToken(mac);

      ctx.state.data = {
        token: uploadToken
      }
    } catch (err) {
      console.log('token verify fail: ', err)
      ctx.body = {
        code: -1,
        data: {
          error: '认证失败'
        }
      }
    }
  } else {
    ctx.body = {
      code: -1,
      data: {
        error: '认证失败'
      }
    }
  }


}

module.exports = {
  get
};
