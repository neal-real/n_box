/**
* & 初始化数据库连接
*/ 
const mongoose = require("mongoose")
function initDatabase(url,options) {
  mongoose.connect(url, options)
    .then(() => {
      console.log("数据库连接成功")
    })
    .catch(err => {
      console.log("数据库连接失败" + err)
    })
}
module.exports = {
  initDatabase
}
