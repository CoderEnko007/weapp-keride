const {mysql} = require('../qcloud');

async function post(ctx) {
  const {title, description, image} = ctx.request.body;

  try {
    let news_id = await mysql('news').insert({
      title, description, image
    });
    ctx.state.data = {
      id: news_id,
      msg: 'success'
    }
  } catch (e) {
    console.log(e)
    if (e.code === 'ER_DATA_TOO_LONG') {
      ctx.state = {
        code: -1,
        error: '内容过长'
      }
    } else {
      ctx.state = {
        code: -1,
        error: e.sqlMessage
      }
    }
  }
}

async function patch(ctx) {
  const {id, title, description, image} = ctx.request.body;
  try {
    await mysql('news').select('*').where('id', id).first().update({
      title, description, image
    });
    ctx.state.data = Object.assign({}, {
      title: title,
      msg: 'success'
    })
  }catch (e) {
    console.log(e.code, e.sqlMessage)
    if (e.code === 'ER_DATA_TOO_LONG') {
      ctx.state = {
        code: -1,
        error: '内容过长'
      }
    }
  }
}

async function get(ctx) {
  const {id, page=0} = ctx.request.query;
  const pageSize = 6;
  if (id) {
    // 获取某条新闻详情
    let news = await mysql('news').select('*')
      .where('id', id)
      .limit(pageSize)
      .first();
    ctx.state.data = {
      title: news.title,
      image: news.image,
      description : news.description,
      create_time: news.create_time
    }
  } else {
    let newsList = await mysql('news').select('*')
      .orderBy('create_time', 'desc')
      .limit(pageSize)
      .offset(Number(page) * pageSize);
    ctx.state.data = newsList;
  }
}

async function del(ctx) {
  const {id} = ctx.params;
  await mysql('news').select('*').where('id', id).del();
  ctx.state.data = {
    msg: '删除成功'
  }
}

module.exports = {
  post,
  get,
  del,
  patch
};
