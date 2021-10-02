const n_file = require("./file");
const n_is = require("./is");
const n_array = require("./arrar");
const n_date = require("./date");
const n_string = require("./string");

module.exports = {
  // > 是否是手机号
  isPhone(string) {
    return n_is.isPhone(string);
  },
  // > 是否是邮箱
  isEmail(string) {
    return n_is.isEmail(string);
  },
  /**
   * > 查看对象的真实类型
   * @param {*} obj
   * @returns 对象字符串
   */
  isType(obj) {
    return n_is.isType(obj);
  },
  /**
   * > 判断对象是否是空值
   * > undefined,null,length是 0 均是 false
   * @value :需要判断的值
   * @返回值: null 返回 false ,有值返回 true
   */
  isNothing(value) {
    return n_is.isNothing(value);
  },

  /**
   * > 数据流转文件(处理过 excel )
   * @param {*} stream 数据流
   * @param {*} path 想要保存的位置
   * @returns 成功返回保存路径, 错误给予错误原因
   */
  streamToFile(stream, path) {
    return n_file.streamToFile(stream, path);
  },
  /**
   * > 解析文件,并保存在指定的临时目录中(处理过图片文件)
   * @param {Object} req 请求对象
   * @param {string} path 临时存放路径 例如:/www/images
   * @param {number} size 限制文件大小默认有 1M|2M|3M|5M 写1|2|3|5 或写字节数
   * @returns {
   * @    path{string}: 保存的路径,包含文件名和扩展名
   * @    type{string}: 文件类型; 例如: 'image/jpeg'
   * @    fields{object}: 上传附带的其他信息{key:value,key1:value....}
   * @ }
   */
  parseFileToPath(req, path, size) {
    return n_file.parseFileToPath(req, path, size);
  },
  /**
   * 数组元素交换位置
   * @param {array} arr 数组
   * @param {number} index1 添加项目的位置
   * @param {number} index2 删除项目的位置
   * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
   */
  swapArray(arr, index1, index2) {
    return n_array.swapArray(arr, index1, index2);
  },
  /**
   * > 返回特定格式的时间
   * @param {Date} date : 时间对象
   * @param {string} DateFormat :年月日的分割字符,默认 /
   * @param {string} timeFormat :时秒分的分割字符, 默认 :
   * @returns 2021/09/11 13:29:01
   */
  formatTime(date, dateFormat, timeFormat) {
    return n_date.formatTime(date, dateFormat, timeFormat);
  },
  /**
   * > 返回路径的最后一段字符
   * @param {string} String
   * @returns
   */
  getLastItem(string) {
    return n_string.getLastItem(string);
  },
  /**
   * > 截取文件扩展名,并返回保留扩展名的随机名称
   * @param {path} path :需要截取文件的扩展名
   * @param {path} fileNamePrefix : 可选|指定新文件名的前缀
   * @返回 新的随机名称
   */
  getRandomName(path, fileNamePrefix) {
    return n_string.getRandomName(path, fileNamePrefix);
  },
};
