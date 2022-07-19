/**
* & 初始化数据库连接
*/ 
const mongoose = require("mongoose")

// 连接数据库
function initDatabase(url,options) {
  mongoose.connect(url, options)
    .then(() => {
      console.log("数据库连接成功")
    })
    .catch(err => {
      console.log("数据库连接失败" + err)
    })
}
// 数据模型文件读取路径
var schemaPath = "./schema/";

module.exports = {
  initDatabase,
  schemaPath
}
