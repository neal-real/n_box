/**
 * ^ 提供字符串加密和解密功能
 * # 1.单向文本加密
 * # 2.jwt 加密返回 token
 * # 3.jwt 解密 token 返回 json 对象
 * # 4.aes 加密
 * # 5.aes 解密
 */

 const N_crypto = require("crypto");
 const N_jwt = require("jsonwebtoken");
 const n_key = "OiLFWVbFZdrhdtHm";
 const n_iv = "DOWX6XgQPKt4X9FW";
 
 module.exports = {
   /**
    * ^ 单向文本加密
    * # Hmac 加密(这个不能解密)
    * # 密钥固定写好,主要用来进行密码的单向加密
    */
   encryptText(text, key) {
     key = key ? key : "Good_weather_and_good_moodRealIsBest";
     const hmac = N_crypto.createHmac("sha256", key);
     hmac.update(text);
     return hmac.digest("hex");
   },
   /**
    * ^ jwt 加密返回 token
    * @ JSON: json 类型的对象
    * @ key: 加密字符串
    * # 有效期 7天
    */
   signByJWT(json, key) {
     // 生成JWT令牌
     // 第一个参数: 需要保存的数据
     // 第二个参数: 签名使用的密钥
     // 第三个参数: 额外配置
     return N_jwt.sign(json, key, { expiresIn: "7 days" });
   },
   /**
    * ^ jwt 解密 token 返回 json 对象
    * @ token: 经过 cipherTextByJWT 加密过的密文
    * @ key: 加密字符串
    * # 有效期 7天
    */
   verifyByJWT(token, key) {
     // 生成JWT令牌
     // 第一个参数: 需要保存的数据
     // 第二个参数: 签名使用的密钥
     // 第三个参数: 额外配置
     return N_jwt.verify(token, key);
   },
   /**
    * ^ aes 加密
    * # aes 加密和解密用的是同一套 key,且长度是16位
    */
   cipherTextByAES16(text, key) {
     if (!key) {
       key = n_key;
     }
     const cipher = N_crypto.createCipheriv("aes-128-cbc", key, n_iv);
     return cipher.update(text, "binary", "base64") + cipher.final("base64");
   },
 
   /**
    * ^ aes 解密
    * @param {string} encrypted :需要解密的信息
    * @param {*} key :解密用的 key: 长度16位
    * @returns  返回解密后的信息
    */
   clearTextByAES16(encrypted, key) {
     try {
       if (!key) {
         key = n_key;
       }
       encrypted = Buffer.from(encrypted, "base64").toString("binary");
       const decipher = N_crypto.createDecipheriv("aes-128-cbc", key, n_iv);
       return decipher.update(encrypted, "binary", "utf8") + decipher.final("utf8");
     } catch (error) {
       throw error;
     }
   },
 
   /**
    * sha1和md5的加密通用函数
    * @param {string} algorithm: 加密的方式
    * @param {any} content :需要加密的信息
    *  @return {string} 返回加密后的信息
   */
   encrypt(algorithm, content) {
     let hash = N_crypto.createHash(algorithm);
     hash.update(content);
     return hash.digest('hex');
   },
 
   /**
     * ^ sha1 加密
     * @param {string} content :需要加密的信息
     * @returns  返回加密后的信息
    */
   cipherTextBySHA1(content) {
     return this.encrypt('sha1', content);
   },
   /**
     * ^ md5 加密
     * @param {string} content :需要加密的信息
     * @returns  返回加密后的信息
    */
   cipherTextByMD5(content) {
     return this.encrypt('md5', content);
   },
   /**
      * > 小程序敏感信息解密
      * @param {*} appId 小程序 id
      * @param {*} sessionKey 临时钥匙
      * @param {*} encryptedData 被加密的数据
      * @param {*} iv 初始向量
      * @returns 
      */
   wechat_decryptData(appId, sessionKey, encryptedData, iv) {
     var sessionKey2 = new Buffer(sessionKey, 'base64');
     encryptedData = new Buffer(encryptedData, 'base64');
     iv = new Buffer(iv, 'base64');
     try {
       // 解密
       var decipher = N_crypto.createDecipheriv('aes-128-cbc', sessionKey2, iv);
       // 设置自动 padding 为 true，删除填充补位
       decipher.setAutoPadding(true);
       var decoded = decipher.update(encryptedData, 'binary', 'utf8');
       decoded += decipher.final('utf8');
 
       decoded = JSON.parse(decoded);
 
     } catch (err) {
       throw ('非法的 Buffer');
     }
     if (decoded.watermark.appid !== appId) {
       throw ('非法的 Buffer');
     }
 
     return decoded;
   }
 };
 