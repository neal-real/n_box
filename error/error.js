// 对错误对象进行解析,并返回合理的数据给客户端
module.exports = {
  newError(error) {
    if (error.message) {
      return error.message
    }
    if (error == undefined) {
      return error.message
    }
    return error;
  },
}