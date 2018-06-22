const {mysql} = require('../../qcloud')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const bcrypt = require('bcryptjs')

async function adminLogin (ctx) {
  const data = ctx.request.body
  const user = await mysql('admin_user').select('*').where('username', data.username).first() // 查询用户
  // 判断用户是否存在
  if (user) {
    // 判断前端传递的用户密码是否与数据库密码一致
    if (bcrypt.compareSync(data.password, user.password)) {
      // 用户token
      const userToken = {
        username: user.username,
        id: user.id
      }
      console.log(userToken)
      const token = jwt.sign(userToken, config.sign, {expiresIn: '1h'})  // 签发token
      ctx.body = {
        message: '成功',
        bean: {
          token
        },
        code: 1
      }
    } else {
      ctx.body = {
        code: -1,
        message: '用户名或密码错误'
      }
    }
  } else {
    ctx.body = {
      code: -1,
      message: '用户名不存在'
    }
  }
}

async function createAdminUser (ctx) {
  const user = ctx.request.body;
  console.log(user)
  if (user.password && user.username) {
    const existUser = await mysql('admin_user').select('*').where('username', user.username);
    console.log(existUser.length)
    if (existUser.length > 0) {
      ctx.body = {
        code: -1,
        message: '用户名已经存在'
      }
    } else {
      // 密码加密
      const salt = bcrypt.genSaltSync();
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
      await  await mysql('admin_user').insert(user);
      const newUser = await mysql('admin_user').select('*').where('username', user.username);

      // 签发token
      const userToken = {
        name: newUser.name,
        id: newUser.id
      };
      const token = jwt.sign(userToken, config.sign, {expiresIn: '1h'})

      ctx.body = {
        code: 1,
        message: '创建成功',
        bean: {
          token
        }
      }
    }
  } else {
    ctx.body = {
      code: -1,
      message: '参数错误'
    }
  }
}

async function getUserInfo (ctx) {
  const user = ctx.user;
  if (user) {
    ctx.body = {
      code: 1,
      message: '成功',
      user
    }
  } else {
    ctx.body = {
      code: -1,
      message: '获取用户信息失败'
    }
  }
}

module.exports = {
  adminLogin,
  createAdminUser,
  getUserInfo
}
