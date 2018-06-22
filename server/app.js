const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const cors = require('koa2-cors')
const err = require('./middlewares/error')
const jwt = require('koa-jwt')

// 解决跨域问题
app.use(cors());

//鉴权操作
app.use(err());
app.use(jwt({secret: config.sign}).unless({
  path: [/^\/api\/adminLogin/, /^\/api\/createAdminUser/],
  method: 'GET'
}))

// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

//设置静态文件目录
const asserts = require('koa-static')
app.use(asserts(__dirname + '/asserts'))

// 引入路由分发
const router = require('./routes')
app.use(router.routes())


// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
