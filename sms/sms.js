/*
 ^ 提供手机短信验证功能
 #1. 向指定手机号码发送验证码
 #2. 拿到验证码,验证指定手机号码
*/

const tencentcloud = require("tencentcloud-sdk-nodejs");

const SmsClient = tencentcloud.sms.v20210111.Client;
// 发送短信的对象
let client;

// 创建发送短信对象
function initTransporterInstance(smsConfig) {
  if (client) { return client }
  const clientConfig = {
    credential: {
      secretId: smsConfig.secretId,
      secretKey: smsConfig.secretKey,
    },
    region: smsConfig.region, // 地区固定写法 "ap-beijing",
    // 发送服务器配置
    profile: { httpProfile: { endpoint: "sms.tencentcloudapi.com" } },
  };
  // 创建对象
  client = new SmsClient(clientConfig);
  return client;
}

module.exports =  {
  /**
    * > 发送短信
    * @param {object} smsConfig {
    * @    secretId: "",  TX 密钥 id
    * @    secretKey: "", TX 密钥
    * @    SmsSdkAppId: true,  TX 短信注册的 app id :1400549975
    * @    SignName: "知识地图", 注册的项目名称
    * @    TemplateId: 短信模板 ID 
    * @ }
    * @param {object} content {
    * @    to{string}: 发送到哪个手机号,不需要加86
    * @    text{string}: 文字内容
    * @  }
    * @returns 
    */
  async sendSms(smsConfig, content) {

    if (!content.to) throw new Error("手机号码不能为空");
    if (!smsConfig.type) throw new Error("验证码类型不能为空");
    if (!/^1[3456789]\d{9}$/.test(content.to)) throw new Error("请检查手机号码是否正确");

    // 创建发送对象
    const client = initTransporterInstance(smsConfig);
    // 生成发送内容 to是手机号需要加 +86
    const params = {
      PhoneNumberSet: [
        '+86' + content.to
      ],
      SmsSdkAppId: smsConfig.SmsSdkAppId,
      SignName: smsConfig.SignName,
      TemplateId: smsConfig.TemplateId,
      TemplateParamSet: [content.text]
    };

    return new Promise((resolve, reject) => {
      try {
        client.SendSms(params).then(
          (result) => {
            resolve(result);
          },
          (err) => {
            reject(err);
          }
        )
      } catch (error) {
        reject(error)
      }
    });
  },
}
