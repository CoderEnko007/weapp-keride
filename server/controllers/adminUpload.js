const multer = require('koa-multer');
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(req)
    cb(null, 'asserts/images/')
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
  ctx.state.data = {
    image: path
  }
}

module.exports = {
  upload: multer({ storage: storage }),
  post,
};
