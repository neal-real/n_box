// 对错误对象进行解析,并返回合理的数据给客户端
module.exports = {
  newError(error) {
    if (Array.isArray(error)) {
      let errorString = "";
      error.forEach((item) => {
        if (item.message && item.field) {
          errorString += `字段:${item.field}: ${item.message} 错误类型:${item.code}`;
        }
      });
      return errorString;
    }
    if (error.message) {
      return error.message;
    }
    if (error == undefined) {
      return error.message;
    }
    return error;
  },
};
