/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/api'
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态）
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中
// router.post('/upload', controllers.upload)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)

router.get('/demo', controllers.demo.get)

router.post('/upload', controllers.adminUpload.upload.single('file'), controllers.adminUpload.post)

router.get('/bannerlist', controllers.banner.get)
router.get('/banner/:id', controllers.banner.get)
router.post('/banner', controllers.banner.upload.single('file'), controllers.banner.post)
router.delete('/banner/:id', controllers.banner.del)

router.get('/intro', controllers.introduction.get)
router.patch('/intro', controllers.introduction.patch)

router.get('/categorys', controllers.category.get)
router.post('/categorys', controllers.category.post)
router.delete('/categorys/:id', controllers.category.del)

router.get('/products', controllers.products.get)
router.post('/products', controllers.products.post)
router.patch('/products', controllers.products.patch)
router.delete('/products/:id', controllers.products.del)

router.get('/news', controllers.news.get)
router.post('/news', controllers.news.post)
router.patch('/news', controllers.news.patch)
router.delete('/news/:id', controllers.news.del)

router.get('/contacts', controllers.contacts.get)
router.post('/contacts', controllers.contacts.post)
router.patch('/contacts', controllers.contacts.patch)
router.delete('/contacts/:id', controllers.contacts.del)

module.exports = router
