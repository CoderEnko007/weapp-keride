const {mysql} = require('../qcloud');

async function post(ctx) {
  const {name, desc} = ctx.request.body;
  let findRes = await mysql('category').select().where('name',name);
  if (findRes.length) {
    ctx.state = {
      code: -1,
      error: '该分类已存在'
    };
    return
  }

  let category_id = await mysql('category').insert({
    name, desc
  });
  console.log('aaa',category_id)
  ctx.state.data = {
    id: category_id,
    name: name,
    msg: 'success'
  }
}

async function patch(ctx) {
  const {id, name, desc} = ctx.request.body;
  let category_id = await mysql('category').where('id', id).first().update({
    name, desc
  });
  console.log('aaa',category_id)
  ctx.state.data = {
    id: category_id,
    name: name,
    msg: 'success'
  }
}

async function get(ctx) {
  const {id} = ctx.params;
  if (id) {
    let categorys = await mysql('category').select('*').where('id', id).first();
    if (categorys) {
      ctx.state.data = categorys
    } else {
      ctx.state.data = {
        code: -1,
        msg: '无记录'
      }
    }
  } else {
    let categorys = await mysql('category').select('*');
    console.log(categorys);
    ctx.state.data = {
      list: categorys.map(v => {
        return Object.assign({}, {
          id: v.id,
          name: v.name
        })
      })
    };
  }
}

async function del(ctx) {
  const {id} = ctx.params;
  await mysql('category').select('*').where('id', id).del();
  ctx.state.data = {
    msg: '删除成功'
  }
}

module.exports = {
  post,
  patch,
  get,
  del
};
