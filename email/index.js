const n_email = require('./email')


module.exports = {
  /**
   * > 发送邮件
   * @param {object} emailConfig = {
   * @    host: "smtp.exmail.qq.com",  邮件服务器
   * @    port: 465,    端口号
   * @    secure: true, 465端口为True，对于其他端口为false
   * @    user: "map@map.com",  发出邮箱
   * @    pass: "密码"
   * @ }
   * @param {object} content = {
   * @    from {string}: 发出邮箱
   * @    to {string}: 接收邮件的邮箱
   * @    subject{string}: 邮件标题
   * @    text{string}: 邮件的文字内容; text和 HTML 二选一
   * @    html{string}: html 格式的模板
   * @  }
   * @returns
   */
  sendEmail(emailConfig, content) {
    return n_email.sendEmail(emailConfig, content)
  },
}