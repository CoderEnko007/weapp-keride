const {mysql} = require('../qcloud')

//获取轮播图列表
async function get(ctx) {
  const {id} = ctx.params;
  if (id) {
    const banner = await mysql('banner').select('*').where('id', id).first();
    let result = {};
    if (banner) {
      let product = await mysql('products').select('*').where('id', banner.product_id).first();
      result = Object.assign({}, {
        id: banner.id || '',
        image: banner.image || '',
        index: banner.index || '',
        product: {
          id: product.id,
          name: product.name
        } || ''
      })
    }
    ctx.state.data = result
  } else {
    const list = await mysql('banner').select('*').orderBy('index', 'desc');
    const result = await Promise.all(list.map(async v => {
      let product = await mysql('products').select('*').where('id', v.product_id).first();
      return Object.assign({}, {
        id: v.id || '',
        image: v.image || '',
        index: v.index || '',
        product: {
          id: product.id,
          name: product.name
        } || ''
      })
    }));

    ctx.state.data = result
  }
}

// 上传轮播图
async function post(ctx) {
  const {image, product_id, index} = ctx.request.body;
  try {
    await mysql('banner').insert({
      image, product_id, index
    });
    ctx.state.data = {
      msg: "success"
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
  let {id, image, product_id, index} = ctx.request.body;
  try {
    await mysql('banner').select('*').where('id', id).first().update({
      image, product_id, index
    });
    ctx.state.data = Object.assign({}, {
      image: image,
      msg: 'success'
    })
  }catch (e) {
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

//删除轮播图
async function del(ctx) {
  const {id} = ctx.params;
  try {
    await mysql('banner').select('*').where('id', id).del();
    ctx.state.data = {
      msg: '删除成功'
    }
  } catch (e) {
    ctx.state = {
      code: -1,
      error: '删除失败:'+e
    };
  }
}

module.exports = {
  get,
  post,
  patch,
  del
};
