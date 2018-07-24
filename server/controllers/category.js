const {mysql} = require('../qcloud');

const CATEGORY_TYPE = {
  level1: {id: 1, text: "一级分类"},
  level2: {id: 2, text: "二级分类"},
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
  let category_type = CATEGORY_TYPE.level1.id
  if (parent_category) {
    let findRes = await mysql('category').where('id', parent_category)
    if (findRes.length) {
      category_type = CATEGORY_TYPE.level2.id
    } else {
      ctx.state = {
        code: -1,
        data: {
          error: '该父类不存在'
        }
      };
      return
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
  let category_type = CATEGORY_TYPE.level1.id
  if (parent_category) {
    let findRes = await mysql('category').where('id', parent_category)
    if (findRes.length) {
      category_type = CATEGORY_TYPE.level2.id
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
    let params = {name, desc, category_type, parent_category}
    if (parent_category === null || parent_category === '') {
      params = {name, desc, category_type}
    }
    await category.update(params);
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
  const {category_type, parent_category} = ctx.request.query;
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
    let condition = {}
    if (category_type) {
      condition.category_type = category_type
    }
    if (parent_category) {
      condition.parent_category = parent_category
    }
    let categories = await mysql('category').where(condition);
    let nums = [];
    for( let index in categories) {
      if (categories.hasOwnProperty(index)) {
        nums[categories[index].id] = await calcNums(categories[index].id)
      }
    }

    ctx.state.data = {
      list: await Promise.all(categories.map(async v => {
        let text = null
        for(let item in CATEGORY_TYPE) {
          if (CATEGORY_TYPE[item].id === v.category_type) {
            text = CATEGORY_TYPE[item].text
          }
        }
        let parent_category = {}
        if (v.parent_category) {
          parent_category.id = v.parent_category
          let findRes = await mysql('category').select('name').where('id', v.parent_category).first()
          if (findRes) {
            parent_category.name = findRes.name
          } else {
            parent_category.name = '父类不存在'
          }
        }

        return Object.assign({}, {
          id: v.id,
          name: v.name,
          desc: v.desc,
          nums: nums[v.id],
          category_type: {
            id: v.category_type,
            text: text
          },
          parent_category: parent_category
        })
      }))
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
    findRes = await mysql('category').where('parent_category', id)
    if (findRes.length) {
      ctx.state = {
        code: -1,
        data: {
          error: '该分类下还有子分类，不能删除'
        }
      }
    } else {
      await mysql('category').where('id', id).del();
      ctx.state.data = {
        msg: '删除成功'
      }
    }
  }
}

module.exports = {
  post,
  patch,
  get,
  del
};
