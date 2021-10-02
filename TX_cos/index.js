const n_cos = require("./tx_cos");

module.exports = {
  /**
   * > 1. 将指定路径的文件上传到腾讯云对象中
   * @param {object} TXConfig {
   * @    secretId{string}: 腾讯云账号中获取
   * @    secretKey{string}: 腾讯云账号中获取
   * @    BucketName{string}: 桶名
   * @    cos_path{string}: 在对象存储中的路径
   * @    Region{string}: 地区固定写法
   * @    StorageClass{string}: 存储方式: 默认标准存储'STANDARD'
   * @  }
   * @param {object} LocalConfig {
   * @    path{string}: 本地文件的存放路径
   * @    fileNamePrefix{string}: 文件前缀
   * @  }
   * @returns {url: cos 的存储位置}
   */
  uploadToTXCos(TXConfig, LocalConfig) {
    return n_cos.uploadToTXCos(TXConfig, LocalConfig);
  },
  /**
   *  > 删除指定 url
   * @param {*} urlPath 完整的 URL 路径
   */
  delByUrl(TXConfig, urlPath) {
    return n_cos.delByUrl(TXConfig, urlPath);
  },
};
