const n_email = require('./email')


module.exports = {
  /**
   * > 发送邮件
   * @param {object} emailConfig {
   * @    host: "smtp.exmail.qq.com",  邮件服务器
   * @    port: 465,    端口号
   * @    user: "map@map.com",  发出邮箱
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
}