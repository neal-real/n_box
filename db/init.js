/**
 * & 初始化数据库连接
 */
const mongoose = require("mongoose");
/*
默认情况下，Mongoose 5.x调用MongoDB驱动程序的ensureIndex()函数。
MongoDB驱动程序不赞成使用此函数createIndex()。设置useCreateIndex全局选项以选择使用Mongoose createIndex()。
*/
mongoose.set("useCreateIndex", true);

function initDatabase(url, options) {
  mongoose
    .connect(url, options)
    .then(() => {
      console.log("数据库连接成功");
    })
    .catch((err) => {
      console.log("数据库连接失败" + err);
    });
}
module.exports = {
  initDatabase,
};
