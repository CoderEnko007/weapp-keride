const {mysql} = require('../../qcloud')
const jwt = require('jsonwebtoken')
const config = require('../../config')
const bcrypt = require('bcryptjs')

function getRoles(user) {
  let roles = []
  if (user.is_superuser) {
    roles = ['admin']
  } else {
    roles = ['viewer']
  }
  return roles
}

async function adminLogin (ctx) {
  const data = ctx.request.body
  const user = await mysql('admin_user').where('username', data.username).first() // 查询用户
  // 判断用户是否存在
  if (user) {
    // 判断前端传递的用户密码是否与数据库密码一致
    if (bcrypt.compareSync(data.password, user.password)) {
      // 用户token
      let roles = getRoles(user)
      const userToken = {
        username: user.username,
        id: user.id,
        roles: roles
      }
      const token = jwt.sign(userToken, config.sign, {expiresIn: '7d'})  // 签发token
      ctx.body = {
        message: '成功',
        data: {
          token
        },
        code: 1
      }
    } else {
      ctx.body = {
        code: -1,
        data: {
          error: '用户名或密码错误'
        }
      }
    }
  } else {
    ctx.body = {
      code: -1,
      data: {
        error: '用户名不存在'
      }
    }
  }
}

async function createAdminUser (ctx) {
  const user = ctx.request.body;
  if (user.password && user.username) {
    const existUser = await mysql('admin_user').select('*').where('username', user.username);
    if (existUser.length > 0) {
      ctx.body = {
        code: -1,
        data: {
          error: '用户名已经存在'
        }
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
      const token = jwt.sign(userToken, config.sign, {expiresIn: '1h'});

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
      data: {
        error: '参数错误'
      }
    }
  }
}

async function getUserInfo (ctx) {
  const user = await mysql('admin_user').select('*').where('id', ctx.user.id).first();
  if (user) {
    let roles = getRoles(user)
    ctx.body = {
      code: 1,
      message: '成功',
      data: {
        roles: roles,
        name: user.username,
        avatar: user.avatar
      }
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
