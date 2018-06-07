async function get (ctx, next) {
  console.log(ctx)
  ctx.state.data = {
    msg: "hello koa2 demo"
  }
}

module.exports = {
  get
}
