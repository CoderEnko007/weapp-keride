const {mysql} = require('../qcloud');

async function post(ctx) {
  const {name, image, description, category_id} = ctx.request.body;
  const findRes = await mysql('products').select().where('name',name);
  if (findRes.length) {
    ctx.state = {
      code: -1,
      data: {
        msg: '该商品已存在'
      }
    };
    return
  }

  try {
    let product_id = await mysql('products').insert({
      name, image, description, category_id
    });
    ctx.state.data = {
      id: product_id,
      msg: 'success'
    }
  } catch (e) {
    if (e.code === 'ER_DATA_TOO_LONG') {
      ctx.state = {
        code: -1,
        error: '内容过长'
      }
    }
  }
}

async function patch(ctx) {
  const {id, name, image, description, category_id} = ctx.request.body;
  try {
    await mysql('products').select('*').where('id', id).first().update({
      name, image, description, category_id
    });
    ctx.state.data = Object.assign({}, {
      name: name,
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
  const {id, category_id, page=0} = ctx.request.query;
  const pageSize = 6;
  console.log(ctx.request.query)
  if (id) {
    // 获取某件商品详情
    let product = await mysql('products').select('*').where('id', id).first()
    console.log(product)
    ctx.state.data = {
      name: product.name,
      image: product.image,
      description : product.description.split('\n'),
    }
  } else {
    let list = [];
    if (category_id) {
      // 获取某类商品列表
      list = await mysql('products').select('*')
        .where('category_id', category_id)
        .limit(pageSize)
        .offset(Number(page) * pageSize);
    } else {
      // 获取所有商品列表
      list = await mysql('products').select('*')
        .limit(pageSize)
        .offset(Number(page) * pageSize);
    }
    console.log(list)
    ctx.state.data = list;
  }
}

async function del(ctx) {
  const {id} = ctx.params;
  await mysql('products').select('*').where('id', id).del();
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
