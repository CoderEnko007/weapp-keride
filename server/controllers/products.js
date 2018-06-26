const {mysql} = require('../qcloud');

async function post(ctx) {
  const {name, image, desc, category_id} = ctx.request.body;
  const findRes = await mysql('products').select('*').where('name',name);
  if (findRes.length) {
    ctx.state = {
      code: -1,
      data: {
        error: '该商品已存在'
      }
    };
    return
  }
  try {
    let product_id = await mysql('products').insert({
      name, image, desc, category_id
    });
    ctx.state.data = {
      id: product_id,
      msg: 'success'
    }
  } catch (e) {
    if (e.code === 'ER_DATA_TOO_LONG') {
      ctx.state = {
        code: -1,
        data: {
          error: '内容过长'
        }
      }
    } else {
      ctx.state = {
        code: -1,
        data: {
          error: e.sqlMessage
        }
      }
    }
  }
}

async function patch(ctx) {
  const {id, name, image, desc, category_id} = ctx.request.body;
  try {
    await mysql('products').select('*').where('id', id).first().update({
      name, image, desc, category_id
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
        data: {
          error: '内容过长'
        }
      }
    }
  }
}

async function getDetail(ctx) {
  const {id} = ctx.params;
  let product = await mysql('products').where('id', id).first();
  let category = {};
  let click_nums = product.click_nums;

  if (product) {
    category = await mysql('category').select('*').where('id', product.category_id).first();
    if (!ctx.header.authorization) {
      await mysql('products').select('*').where('id', id).update({
        click_nums: click_nums+1
      })
    }
  }
  ctx.state.data = Object.assign({}, product, {
    category: {
      id: category.id,
      name: category.name
    }
  })
}

async function get(ctx) {
  const {name, category_id, sort, page=1, pageSize = 6} = ctx.request.query;
  let count = mysql('products')

  let list = mysql('products')
    .join('category', 'products.category_id', 'category.id')
    .select('products.*', 'category.name as category')
    .limit(pageSize)
    .offset(Number(page-1) * pageSize);

  if (category_id) {
    list = list.where('products.category_id', category_id)
    count = count.where('category_id', category_id)
  }
  if (name) {
    list = list.where('products.name', 'like', `%${name}%`)
    count = count.where('products.name', 'like', `%${name}%`)
  }

  count = await count.count('* as count').first()
  list = await list.orderBy('id', sort)

  list.map(v => {
    const category_name = v.category
    const category_id = v.category_id
    delete v.category
    delete v.category_id
    v.category = {
      id: category_id,
      name: category_name
    }
    return v
  })
  ctx.state = {
    code: 0,
    data: {
      count: count.count,
      list: list
    }
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
  getDetail,
  del,
  patch
};
