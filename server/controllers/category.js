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
  let category = await mysql('category').where('id', id).first()
  if(category) {
    category .update({
      name, desc
    });
    ctx.state.data = {
      name: name,
      msg: 'success'
    }
  } else {
    ctx.state = {
      code: -1,
      error: '没有该分类'
    }
  }
}

async function calcNums(category_id) {
  let products = await mysql('products').select('*').where('category_id', category_id);
  await mysql('category').where('id', category_id).first().update({
    nums: products.length
  })
  return products.length
}

async function get(ctx) {
  const {id} = ctx.params;
  if (id) {
    let categories = await mysql('category').select('*').where('id', id).first();
    if (categories) {
      let nums = await calcNums(id)
      ctx.state.data = categories.map(v => {
        return Object.assign({}, {
          id: v.id,
          name: v.name,
          desc: v.desc,
          nums: nums
        })
      })
    } else {
      ctx.state.data = {
        code: -1,
        msg: '无记录'
      }
    }
  } else {
    let categories = await mysql('category').select('*');
    console.log(categories);
    let nums = [];
    for( let index in categories) {
      if (categories.hasOwnProperty(index)) {
        nums[categories[index].id] = await calcNums(categories[index].id)
      }
    }

    ctx.state.data = {
      list: categories.map(v => {
        return Object.assign({}, {
          id: v.id,
          name: v.name,
          desc: v.desc,
          nums: nums[v.id]
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
