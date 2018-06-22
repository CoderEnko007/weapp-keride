const {mysql} = require('../qcloud')

async function get(ctx) {
  const list = await mysql('partner').select('*').orderBy('create_time', 'desc');
  ctx.state.data = list;
}

const multer = require('koa-multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'asserts/images/partner')
  },
  filename: (req, file, cb) => {
    // let fileFormat = (file.originalname).split(".");
    // console.log(fileFormat)
    cb(null,file.originalname);
  }
});
async function post(ctx) {
  let path = ctx.req.file.path;
  let {name} = ctx.req.body;
  path = path.substr(path.indexOf('\\')+1).replace(/\\/g,"/");
  // path = `http://${ctx.req.headers.host}/${path}`;
  try {
    await mysql('partner').insert({
      image: path,
      name: name
    });
    ctx.state.data = {
      image: path
    }
  } catch(e){
    ctx.state = {
      code: -1,
      error: '上传失败:'+e.sqlMessage
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
      error: '删除失败:'+e
    };
  }
}

module.exports = {
  upload: multer({ storage: storage }),
  get,
  post,
  del
};
