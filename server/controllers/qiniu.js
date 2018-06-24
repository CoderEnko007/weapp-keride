/*
七牛云配置
*/
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
  const putPolicy = new qiniu.rs.PutPolicy(options);
  const uploadToken = putPolicy.uploadToken(mac);

  ctx.state.data = {
    token: uploadToken
  }
}

module.exports = {
  get
};
