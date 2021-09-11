/**
* & 数据库事件监听
*/ 
// 数据库框架
const mongoose = require("mongoose")

// mongoose.connection 返回一个数据库模型对象,就是返回链接好的那个数据库对象

/** * 事件:数据库连接 */
var connected = function (callBack) {
  mongoose.connection.on("connected", function () {
    callBack("DB数据链接事件监听以触发")
  })
}

/** * 事件:连接异常 */
var error = function (callBack) {
  mongoose.connection.on("error", function (err) {
    callBack("数据库抛出错误: " + err)
  })
}

/** * 事件:连接断开 */
var disconnected = function (callBack) {
  mongoose.connection.on("disconnected", function () {
    callBack("DB数据链接断开链接")
  })
}

/**
*  导出:
*  1. 数据库连接
*  2. 连接异常
*  3. 连接断开
*/
module.exports = {
  connected,
  error,
  disconnected
}
