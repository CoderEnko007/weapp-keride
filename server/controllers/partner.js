const {mysql} = require('../qcloud')

const PARTNER_STYLE = [
  {key: 1, text: '代理品牌'},
  {key: 2, text: '工业客户'}
]

async function get(ctx) {
  const {page=1, pageSize=2000, type} = ctx.request.query;
  let list = []
  if (type) {
    list = await mysql('partner')
      .where('type', type)
      .limit(pageSize)
      .offset(Number(page-1) * pageSize)
      .orderBy('create_time', 'asc');
  } else {
    list = await mysql('partner')
      .limit(pageSize)
      .offset(Number(page-1) * pageSize)
      .orderBy('create_time', 'asc');
  }

  list = list.map(v => {
    let list = {}
    list.id = v.id
    list.image = v.image
    list.name = v.name
    list.create_time = v.create_time
    for (let i in PARTNER_STYLE) {
      if (PARTNER_STYLE[i].key === v.type) {
        list.type = {
          key: PARTNER_STYLE[i].key,
          text: PARTNER_STYLE[i].text
        }
        break
      }
    }
    return list
  })

  ctx.state.data = list
}

async function post(ctx) {
  let {image, name, type} = ctx.request.body;
  try {
    await mysql('partner').insert({
      image, name, type
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
  let {id, image, name, type} = ctx.request.body;
  try {
    await mysql('partner').select('*').where('id', id).first().update({
      image, name, type
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
