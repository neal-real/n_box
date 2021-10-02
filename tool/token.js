const n_crypto = require("../crypto");
module.exports = {
  /**
   * > 生成 token
   * @param {JSON} token 需要被加密的 JSON 数据
   * @param {string} key 加密用的 key
   * @returns 成功返回 token,否则返回 reject
   */
  createToken(token, key) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. 解密 token
        const res_token = await n_crypto.signByJWT(token, key);
        if (res_token) {
          resolve(res_token);
        } else {
          reject("token 创建失败");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 校验 token
   * @param {string} token 被加密的密文
   * @param {string} key 解密用的 key
   * @param {object} checkValue 需要校对的值 {key:value}
   * @returns
   */
  checkToken(token, key, checkValue) {
    return new Promise(async (resolve, reject) => {
      try {
        // 1. 解密 token
        const res_token = await n_crypto.verifyByJWT(token, key);
        if (!res_token) return reject("没有获得 token 对应的文本");
        // 获取校验对象的 keys
        const checkValueKeys = checkValue ? Object.keys(checkValue) : [];
        // 对比校验的值
        if (checkValueKeys.length == 0) return reject("没有需要校验的值");
        for (let i = 0; i < checkValueKeys.length; i++) {
          const checkKey = checkValueKeys[i];
          if (res_token[checkKey] !== checkValue[checkKey]) {
            return reject(checkKey + "的值不匹配");
          }
        }
        resolve(true);
      } catch (error) {
        reject(error);
      }
    });
  },
};
