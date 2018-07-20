const {mysql} = require('../qcloud');

const CATEGORY_TYPE = {
  level1: 1,
  level2: 2
}

async function post(ctx) {
  const {name, desc, parent_category} = ctx.request.body;
  let findRes = await mysql('category').where('name',name);
  if (findRes.length) {
    ctx.state = {
      code: -1,
      data: {
        error: '该分类已存在'
      }
    };
    return
  }
  // 判断分类级别
  let category_type = CATEGORY_TYPE.level1
  if (parent_category) {
    let findRes = await mysql('category').where('id', parent_category)
    if (findRes.length) {
      category_type = CATEGORY_TYPE.level2
    } else {
      ctx.state = {
        code: -1,
        data: {
          error: '该父类不存在'
        }
      };
    }
  }
  let category_id = await mysql('category').insert({
    name, desc, category_type, parent_category
  });
  ctx.state.data = {
    id: category_id,
    name: name,
    msg: 'success'
  }
}

async function patch(ctx) {
  const {id, name, desc, parent_category} = ctx.request.body;
  // 判断分类级别
  let category_type = CATEGORY_TYPE.level1
  if (parent_category) {
    let findRes = await mysql('category').where('id', parent_category)
    if (findRes.length) {
      category_type = CATEGORY_TYPE.level2
    } else {
      ctx.state = {
        code: -1,
        data: {
          error: '该父类不存在'
        }
      };
    }
  }
  let category = mysql('category').where('id', id).first()
  if(category) {
    await category.update({
      name, desc, category_type, parent_category
    });
    ctx.state.data = {
      name: name,
      msg: 'success'
    }
  } else {
    ctx.state = {
      code: -1,
      data: {
        error: '没有该分类'
      }
    }
  }
}

async function calcNums(category_id) {
  let total = await mysql('products')
    .where('category_id', category_id)
    .count('* as counts')
    .first();
  await mysql('category').where('id', category_id).first().update({
    nums: total.counts
  })
  return total.counts
}

async function get(ctx) {
  const {id} = ctx.params;
  if (id) {
    let categories = mysql('category').where('id', id).first();
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
      ctx.state = {
        code: -1,
        data: {
          error: '无记录'
        }
      }
    }
  } else {
    let categories = await mysql('category').select('*');
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
  let findRes = await mysql('products').where('category_id', id)
  if (findRes.length) {
    ctx.state = {
      code: -1,
      data: {
        error: '该分类下还有产品，不能删除'
      }
    }
  } else {
    await mysql('category').where('id', id).del();
    ctx.state.data = {
      msg: '删除成功'
    }
  }
}

module.exports = {
  post,
  patch,
  get,
  del
};
