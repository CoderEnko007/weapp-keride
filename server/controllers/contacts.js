const {mysql} = require("../qcloud");

async function post(ctx) {
  const {name, latitude, longitude, address, phone, email, fax, zipcode} = ctx.request.body;
  console.log(ctx.request.body)
  try {
    let contact_id = await mysql('contact').insert({
      name, latitude, longitude, address, phone, email, fax, zipcode
    });
    console.log('bbb',contact_id)
    ctx.state.data = {
      id: contact_id,
      msg: 'success'
    }
  } catch (e) {
    if (e.code === 'ER_DATA_TOO_LONG') {
      ctx.state = {
        code: -1,
        error: '内容过长'
      }
    } else {
      ctx.state = {
        code: -1,
        error: e.sqlMessage
      }
    }
  }
}

async function patch(ctx) {
  const {id, name, latitude, longitude, address, phone, email, fax, zipcode} = ctx.request.body;
  await mysql('contact').select('*').where('id', id).first().update({
    name, latitude, longitude, address, phone, email, fax, zipcode
  });
  ctx.state.data = {
    msg: '更新成功'
  }
}

async function get(ctx) {
  const {id} = ctx.params;
  let list = [];
  if (id) {
    list = await mysql("contact").select('*').where('id', id).first();
  } else {
    list = await mysql("contact").select('*');
  }
  ctx.state.data = list;
}

async function del(ctx) {
  const {id} = ctx.params;
  await mysql('contact').select('*').where('id', id).del();
  ctx.state.data = {
    msg: '删除成功'
  }
}

module.exports = {
  post,
  get,
  del,
  patch
}
