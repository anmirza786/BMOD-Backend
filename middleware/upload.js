const path = require("path");
const multer = require("multer");
var storate = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    let ext = path.extname(file.originalname);
    cb(null, Date.now() + ext);
  },
});

var upload = multer({
  storage: storate,
  // fileFilter: function (req, file, callback) {
  //   if (
  //     file.mimetype == "image/png" ||
  //     file.mimetype == "image/jpg" ||
  //     file.mimetype == "application/pdf" ||
  //     file.mimetype == "video/mp4" ||
  //     file.mimetype == "video/mpeg"
  //   ) {
  //     callback(null, true);
  //   } else {
  //     console.log("png and jpg are supported!");
  //     callback(null, false);
  //   }
  // },
  // limits: {
  //   fileSize: 1024 * 1024 * 2,
  // },
});

module.exports = upload;
