/**
 * ^ 提供字符串加密和解密功能
 * # 1.单向文本加密
 * # 2.jwt 加密返回 token
 * # 3.jwt 解密 token 返回 json 对象
 * # 4.aes 加密 
 * # 5.aes 解密
*/

const N_crypto = require('crypto');
const N_jwt = require('jsonwebtoken');
const n_key = 'OiLFWVbFZdrhdtHm'
const n_iv = 'DOWX6XgQPKt4X9FW'

module.exports = {
    /**
     * ^ 单向文本加密
     * # Hmac 加密(这个不能解密)
     * # 密钥固定写好,主要用来进行密码的单向加密
     */
    encryptText(text) {
        const hmac = N_crypto.createHmac('sha256', 'Good_weather_and_good_moodRealIsBest');
        hmac.update(text);
        return hmac.digest('hex')
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
        return N_jwt.sign(json, key, { expiresIn: '7 days' })
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
     * # aes 加密和解密用的是同一套 key
     */
    cipherTextByAES(text, key) {
        if (key && key.length != 16) {
            throw 'key 的长度需要是16位'
        } else {
            key = n_key
        }
        const cipher = N_crypto.createCipheriv('aes-128-cbc', key, n_iv);
        return cipher.update(text, 'binary', 'base64') + cipher.final('base64');
    },
    /**
     * ^ aes 解密 
     * # aes 加密和解密用的是同一套 key
     */
    clearTextByAES(encrypted, key) {
        try {
            if (key && key.length != 16) {
                throw 'key 的长度需要是16位'
            } else {
                key = n_key
            }
            encrypted = Buffer.from(encrypted, 'base64').toString('binary');
            const decipher = N_crypto.createDecipheriv('aes-128-cbc', key, n_iv);
            return decipher.update(encrypted, 'binary', 'utf8') + decipher.final('utf8');
        } catch (error) {
            throw error
        }
    }
}
