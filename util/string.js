const { randomString } = require("../tool/index");
/**
 * > 返回 url 中最后一个 / 之后的字符串
 * @param {path} thePath
 */
const getLastItem = (thePath) => {
  if (typeof(thePath) == 'string') {
    return thePath.substring(thePath.lastIndexOf("/") + 1);
  }else{
    throw "截取字符串的参数类型不正确"
  }
};
/**
 * > 截取文件扩展名,并返回保留扩展名的随机名称
 * @param {path} path :需要截取文件的扩展名
 * @param {path} fileNamePrefix : 可选|指定新文件名的前缀
 * @返回 新的随机名称
 */
const getRandomName = (path, fileNamePrefix = "") => {
  const date = new Date().toLocaleDateString();
  let name = fileNamePrefix + date + randomString({ length: 6 }) + "." + path.split(".").pop();
  // 如果名字中有/ 或\ 替换成-
  return name.replace(/\/|\\/g, "-");
};

module.exports = {
  getLastItem,
  getRandomName,
};
