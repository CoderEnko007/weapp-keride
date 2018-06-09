const {mysql} = require('../qcloud')

async function get(ctx) {
  try {
    const intro = await mysql('introduction').select('*').first();
    console.log(intro)
    if (intro) {
      ctx.state.data = Object.assign({}, {
        image: intro.image,
        text: intro.text
      })
    } else {
      let default_text = '';
      let default_image = `http://${ctx.req.headers.host}/images/background/background.jpg`;
      await mysql('introduction').insert({
        text: default_text,
        image: default_image
      });
      ctx.state.data = Object.assign({}, {
        image: default_image,
        text: default_text
      })
    }
  }catch (e) {
    ctx.state = {
      code: -1,
      data: e
    }
  }
}

async function patch(ctx) {
  const {image, text} = ctx.request.body;
  try {
    await mysql('introduction').select('*').first().update({
      image: image,
      text: text
    });
    ctx.state.data = Object.assign({}, {
      image: image,
      text: text
    })
  }catch (e) {
    ctx.state = {
      code: -1,
      data: e
    }
  }
}

module.exports = {
  get,
  patch
}
