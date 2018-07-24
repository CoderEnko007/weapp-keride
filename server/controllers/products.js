const {mysql} = require('../qcloud');

async function post(ctx) {
  const {name, image, desc, category_id} = ctx.request.body;
  let findRes = await mysql('products').select('*').where('name',name);
  if (findRes.length) {
    ctx.state = {
      code: -1,
      data: {
        error: '该名称已存在'
      }
    };
    return
  }
  findRes = await mysql('category').select('parent_category').where('id', category_id).first()
  let params = {name, image, desc, category_id}
  if (findRes) {
    params = {name, image, desc, category_id, parent_category_id: findRes.parent_category}
  }
  try {
    let product_id = await mysql('products').insert(params);
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

  const origName = await mysql('products').select('name').where('id', id).first();
  if (origName.name !== name) {
    const findRes = await mysql('products').where('name',name);
    if (findRes.length) {
      ctx.state = {
        code: -1,
        data: {
          error: '该名称已存在'
        }
      };
      return
    }
  }

  let findRes = await mysql('category').select('parent_category').where('id', category_id).first()
  let params = {name, image, desc, category_id}
  if (findRes) {
    params = {name, image, desc, category_id, parent_category_id: findRes.parent_category}
  }
  try {
    await mysql('products').where('id', id).first().update(params);
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

async function getDetail(ctx) {
  const {id} = ctx.params;
  let product = await mysql('products').where('id', id).first();
  let category = {};
  let click_nums = product.click_nums;

  if (product) {
    category = await mysql('category').where('id', product.category_id).first();
    if (!ctx.header.authorization) {
      await mysql('products').where('id', id).update({
        click_nums: click_nums+1
      })
    }
  }
  ctx.state.data = Object.assign({}, product, {
    category: {
      id: category.id,
      name: category.name,
      parent_category_id: category.parent_category
    }
  })
}

async function get(ctx) {
  const {name, category_id, parent_category_id, sort='asc', page=1, pageSize = 6} = ctx.request.query;
  let count = mysql('products')

  let list = mysql('products')
    .join('category', 'products.category_id', 'category.id')
    .select('products.*', 'category.name as category')
    .limit(pageSize)
    .offset(Number(page-1) * pageSize);

  if (parent_category_id) {
    list = list.where('products.parent_category_id', parent_category_id)
    count = count.where('parent_category_id', parent_category_id)
  } else if (category_id) {
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
  await mysql('banner').where('product_id', id).del();
  await mysql('products').where('id', id).del();
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
