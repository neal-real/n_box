const n_sms = require('./sms')

const SMSType = {
  logIn: '1046029', // 登录模板号
  registered: '1045236',  // 注册模板号
  changeNumber: '1045237',  // 变更手机号模板号
  resetPass: '1048917'  // 重置密码模板号
}

module.exports = {
  /**
  * > 发送短信
  * @param {object} smsConfig {
  * @    secretId: "",  TX 密钥 id
  * @    secretKey: "", TX 密钥
  * @    SmsSdkAppId: ,  TX 短信注册的 app id :1400549975
  * @    SignName: "知识地图", 注册的项目名称
  * @    region: 发送短信的地区 ap-beijing(默认) |ap-nanjing | ap-guangzhou
  * @    TemplateId: 短信模板 ID 
  * @ }
  * @param {object} content {
  * @    to{string}: 发送到哪个手机号,不需要加86
  * @    text{string}: 文字内容
  * @  }
  * @returns 
  */
  async sendSms(config, content) {
    return n_sms.sendSms(config, content)
  },
}