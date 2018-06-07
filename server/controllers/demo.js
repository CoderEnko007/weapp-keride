async function get (ctx, next) {
  ctx.state.data = {
    msg: "hello koa2 demo"
  }
}

module.exports = {
  get
}
