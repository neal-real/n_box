/*
 ^ 提供邮箱验证功能
 #1. 向指定邮箱发送验证码
 #2. 拿到验证码,验证指定邮箱
*/
const nodemailer = require("nodemailer");
let transporter;

/**
   * > 创建邮件对象
   * @param {*} emailConfig {
   * @    host: "smtp.exmail.qq.com", 
   * @    port: 465,    
   * @    secure: true, 
   * @    user: "map@map.com", 
   * @    pass: "密码" 
   * @ }
   * @returns 
   */
function initTransporterInstance(emailConfig) {
  // 存在不创建
  if (transporter) {
    return transporter;
  }
  // 不存在创建
  transporter = nodemailer.createTransport({
    host: emailConfig.host,       // 邮件服务器
    port: emailConfig.port,       // 端口号, 看推荐或者网上搜 没有推荐默认可能是 465
    secure: parseInt(emailConfig.port) == 465 ? true : false,   // 端口是465写 true, 其他写 false
    auth: {
      user: emailConfig.user,     // 发送邮件的邮箱
      pass: emailConfig.pass,     // 邮箱对应的授权码, 没有授权码写密码
    },
  });
  return transporter;
}
module.exports =  {
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
    const transporter = initTransporterInstance(emailConfig);
    // 1.生成发送内容
    let info = {
      from: emailConfig.user, // 谁发的
      to: content.to, // 发给谁
      subject: content.subject, // 邮件标题
    }
    if (content.text) {
      // 发送单纯的文字
      info['text'] = content.text
    } else if (content.html) {
      // html 格式模板
      info['html'] = content.html
    }
    return new Promise((resolve, reject) => {
      // 发送邮件
      transporter.sendMail(info, (err, data) => {
        // 返回结果
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      })
    });
  },
}
