// 对敏感信息进行加密和解密,避免明文存储
const n_db = require("../db");
const n_crypto = require("../crypto/index");

const StrongKey = "8Ds3+3A0Z:-)9.3=";

module.exports = {
  /**
   * > 加密信息
   * @param {String|Object} text 需要加密的信息,文本或对象
   * @param {string} key : 16位
   * @returns 成功返回 true ,失败 false
   */
  encryptedInformation(text, key) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!text || !key) {
          reject("text 和 key 必须有值");
        }
        if (typeof text === "object" && Object.keys(abc).length) {
          text = JSON.stringify(text);
        }
        // 给一个信息, 给一个 key + 文件提供一个 key 两个 key 加密信息
        const keyText1 = n_crypto.cipherTextByAES16(text, key);
        const keyText2 = n_crypto.cipherTextByAES16(keyText1, StrongKey);

        // 在用传入的 key 做键值对,保存加密信息
        // 保存至服务器
        const obj = {
          key: key,
          value: keyText2,
        };
        const res = await n_db.addData("secret", obj);
        if (res) {
          return resolve(true);
        } else {
          return reject("创建后没有返回值");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 解密信息
   * @param {string} key : 16位
   * @returns 解密信息
   */
  decryptionKey(key) {
    return new Promise(async (resolve, reject) => {
      try {
        if (!key) {
          reject("key 必须有值");
        }
        // 1. 通过 key 获取加密信息
        const rule = { key: key };
        const text = await n_db.findOne("secret", rule);
        if (!text.value) return reject('没有找到对应的信息')
        // 2. 在通过 key + key 解密信息
        const keyText2 = n_crypto.clearTextByAES16(text.value, StrongKey);
        let keyText1 = n_crypto.clearTextByAES16(keyText2, key);
        // 报错即不能转为对象,跳过代码
        try {
          keyText1 = JSON.parse(keyText1);
        } catch (error) {
          // 放弃错误处理,相当于扔掉错误
        }
        return resolve(keyText1);
      } catch (error) {
        reject(error);
      }
    });
  },
};
