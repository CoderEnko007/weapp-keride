const {mysql} = require('../qcloud')

//获取轮播图列表或者某一个实例
async function get(ctx) {
  const {id} = ctx.params;
  if (id) {
    try {
      let banner = await mysql('banner').select('*').where('id', id).first();
      ctx.state.data = Object.assign({}, {
        id: banner.id,
        image: banner.image,
        product: banner.product_id
      })
    }catch (e) {
      ctx.state = {
        code: -1,
        data: {
          msg: '文件不存在'
        }
      }
    }
  } else {
    let bannerList = await mysql('banner').select('*').orderBy('create_time', 'desc')
    ctx.state.data = {
      list: bannerList.map(v => {
        return Object.assign({}, {
          id: v.id,
          image: v.image,
          product: v.product_id
        })
      })
    }
  }
}

// 上传轮播图
const multer = require('koa-multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'asserts/images/banners')
  },
  filename: (req, file, cb) => {
    let fileFormat = (file.originalname).split(".");
    cb(null,Date.now() + "." + fileFormat[fileFormat.length - 1]);
  }
});
async function post(ctx) {
  let path = ctx.req.file.path;
  path = path.substr(path.indexOf('\\')+1).replace(/\\/g,"/");
  path = `http://${ctx.req.headers.host}/${path}`;
  try {
    await mysql('banner').insert({
      image: path
    });
    ctx.state.data = {
      file: path
    }
  } catch(e){
    ctx.state = {
      code: -1,
      error: '上传失败:'+e.sqlMessage
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
  upload: multer({ storage: storage }),
  get,
  post,
  del
};
