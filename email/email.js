/*
 ^ 提供邮箱验证功能
 #1. 向指定邮箱发送验证码
 #2. 拿到验证码,验证指定邮箱
*/
const nodemailer = require("nodemailer");
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
    return new Promise((resolve, reject) => {
      const sendObj = nodemailer.createTransport({
        host: emailConfig.host,
        port: emailConfig.port,
        secure: emailConfig.secure, // 对于465端口为True，对于其他端口为false
        auth: {
          user: emailConfig.user, // 发送邮件的邮箱
          pass: emailConfig.pass, // 邮箱对应的授权码
        },
      });
      // 5. 发送内容
      sendObj.sendMail(content, (err, data) => {
        // 返回结果
        if (err) {
          reject(err);
        } else {
          resolve(data.envelope.to[0] + '的邮件发送成功');
        }
      });
    });
  },
};
