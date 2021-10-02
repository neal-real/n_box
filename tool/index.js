const n_secretKey = require("./secretKey");
const n_token = require("./token");
const n_randomString = require("./randomString");

module.exports = {
  // ---- 加密解密常量工具类
  /**
   * > 加密信息
   * @param {String|Object} text 需要加密的信息,文本或对象
   * @param {string} key : 16位
   * @returns 成功返回 true ,失败 false
   */
  encryptedInformation(text, key) {
    return n_secretKey.encryptedInformation(text, key);
  },

  /**
   * > 解密信息
   * @param {string} key : 16位
   * @returns 解密信息
   */
  decryptionKey(key) {
    return n_secretKey.decryptionKey(key);
  },
  /**
   * > 生成 token
   * @param {JSON} token 需要被加密的 JSON 数据
   * @param {string} key 加密用的 key
   * @returns
   */
  createToken(token, key) {
    return n_token.createToken(token, key);
  },
  /**
   * > 校验 token
   * @param {string} token 被加密的密文
   * @param {string} key 解密用的 key
   * @param {object} checkValue 需要校对的值 {key:value}
   * @returns
   */
  checkToken(token, key, checkValue) {
    return n_token.checkToken(token, key, checkValue);
  },
  /**
   * > 返回一个随机字符串
   * @param {*} opts {
   * @    length: 8, 字符串长度,默认8个字符串
   * @    numeric: true, 字符串是否包含数字,默认是
   * @    letters: true, 字符串是否包含大小写全部字母,默认是
   * @    special: false,字符串是否包含特殊字符串,默认 否
   * @    exclude: ['a', 'b', '1'] 移除指定字符
   * @ }
   * @returns 随机字符串
   */
  randomString(options) {
    return n_randomString(options);
  },
};
