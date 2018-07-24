const {mysql} = require('../qcloud')

async function get(ctx) {
  const {page=1, pageSize=20} = ctx.request.query;
  const list = await mysql('partner')
    .select('*').limit(pageSize)
    .offset(Number(page-1) * pageSize)
    .orderBy('create_time', 'desc');
  ctx.state.data = list;
}

async function post(ctx) {
  let {image, name} = ctx.request.body;
  try {
    await mysql('partner').insert({
      image, name
    });
    ctx.state.data = {
      msg: 'success',
      image: image
    }
  } catch(e){
    ctx.state = {
      code: -1,
      data: {
        error: '上传失败:'+e.sqlMessage
      }
    }
  }
}

async function patch(ctx) {
  let {id, image, name} = ctx.request.body;
  try {
    await mysql('partner').select('*').where('id', id).first().update({
      image, name
    });
    ctx.state.data = {
      msg: 'success',
      image: image
    }
  } catch(e){
    ctx.state = {
      code: -1,
      data: {
        error: '上传失败:'+e.sqlMessage
      }
    }
  }
}

async function del(ctx) {
  const {id} = ctx.params;
  try {
    await mysql('partner').select('*').where('id', id).del();
    ctx.state.data = {
      msg: '删除成功'
    }
  } catch (e) {
    ctx.state = {
      code: -1,
      data: {
        error: '删除失败:' + e
      }
    };
  }
}

module.exports = {
  get,
  post,
  patch,
  del
};
