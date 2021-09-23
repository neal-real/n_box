const n_crypto = require('./encrypto.js')


module.exports = {

  /**
 * ^ 单向文本加密
 * # Hmac 加密(这个不能解密)
 * # 密钥固定写好,主要用来进行密码的单向加密
 */
  encryptText(text, key) {
    if (!text) {
      throw new Error('加密文本不能为 null')
    }
    return n_crypto.encryptText(text, key)
  },
  /**
   * ^ jwt 加密返回 token
   * @ JSON: json 类型的对象
   * @ key: 加密字符串
   * # 有效期 7天
   */
  signByJWT(json, key) {
    if (!json && !key) {
      throw new Error('json 和 key 均不能为 null 值')
    }
    return n_crypto.signByJWT(json, key)
  },
  /**
   * ^ jwt 解密 token 返回 json 对象
   * @ token: 经过 cipherTextByJWT 加密过的密文
   * @ key: 加密字符串
   * # 有效期 7天
   */
  verifyByJWT(token, key) {
    if (!token && !key) {
      throw new Error('json 和 key 均不能为 null 值')
    }
    return n_crypto.verifyByJWT(token, key)
  },
  /**
   * ^ aes 加密 
   * # aes 加密和解密用的是同一套 key,且长度是16位
   */
  cipherTextByAES16(text, key) {
    if (!text && !key) {
      throw new Error('json 和 key 均不能为 null 值')
    }
    return n_crypto.cipherTextByAES(text, key)
  },
  /**
    * ^ aes 解密 
    * @param {string} encrypted :需要解密的信息
    * @param {*} key :解密用的 key: 长度16位
    * @returns  返回解密后的信息
    */
  clearTextByAES16(encrypted, key) {
    if (!encrypted && !key) {
      throw new Error('json 和 key 均不能为 null 值')
    }
    return n_crypto.clearTextByAES(encrypted, key)
  }
}