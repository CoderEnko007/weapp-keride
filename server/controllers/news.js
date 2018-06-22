const {mysql} = require('../qcloud');

async function post(ctx) {
  const {title, desc, image} = ctx.request.body;

  try {
    let news_id = await mysql('news').insert({
      title, desc, image
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
  const {id, title, desc, image} = ctx.request.body;
  try {
    await mysql('news').select('*').where('id', id).first().update({
      title, desc, image
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
    } else {
      ctx.state = {
        code: -1,
        error: e.sqlMessage
      }
    }
  }
}

async function get(ctx) {
  const {page=0} = ctx.request.query;
  const pageSize = 6;

  let newsList = await mysql('news').select('*')
    .orderBy('create_time', 'desc')
    .limit(pageSize)
    .offset(Number(page) * pageSize);
  console.log(newsList);
  ctx.state.data = newsList;
}

async function getDetail(ctx) {
  const {id} = ctx.params;
  let news = await mysql('news').select('*')
    .where('id', id)
    .first();
  console.log(news);
  ctx.state.data = news
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
  getDetail,
  del,
  patch
};
