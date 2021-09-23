const n_email = require('./emailCode')
const n_secretKey = require('./secretKey')


module.exports = {
  /**
   * > 发送邮件
   * @param {object} emailConfig {
   * @    host: "smtp.exmail.qq.com", 
   * @    port: 465,    
   * @    secure: true, 
   * @    user: "map@map.com", 
   * @    pass: "密码" 
   * @ }
   * @param {object} content {
   * @    to{string}: 发送目的地的邮箱
   * @    subject{string}: 邮件的标题
   * @    text{string}: 文字内容
   * @    html{string}: html 格式的文字(模板)
   * @  }
   * @returns 
   */
  sendEmail(emailConfig, content) {
    return n_email.sendEmail(emailConfig, content)
  },

  // ---- 加密解密常量工具类
  /**
   * > 加密信息
   * @param {String|Object} text 需要加密的信息,文本或对象
   * @param {string} key : 16位
   * @returns 成功返回 true ,失败 false
   */
  encryptedInformation(text, key) {
    return n_secretKey.encryptedInformation(text, key)
  },

  /**
   * > 解密信息
   * @param {string} key : 16位
   * @returns 解密信息
   */
  decryptionKey(key) {
    return n_secretKey.decryptionKey(key)
  },

}