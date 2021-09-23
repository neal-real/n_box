const n_cos = require('./tx_cos')


module.exports = {
  /**
   * > 初始化
   * @param {object} TXConfig {
   * @  SecretId{string}: TX云 密钥 id
   * @  SecretKey{string}: TX云 密钥 key
   * @  cos_imageDir{string}: 临时存放目录
   * @  picturePrefix{string}: 文件名的前缀
   * @  BucketName{string}: 桶名
   * @  root_path{string}: 桶内的路径
   * @  Region{string}: 地区固定写法
   * @ }
   * @returns 
   */
  init(TXConfig) {
    return n_cos.init(TXConfig)
  },
  /** 
  * > 1. 将指定路径的文件上传到腾讯云对象中
  * @fileNamePrefix: 设置一个文件名的前缀 例如: 用户数据
  * @path: 需要上传的文件路径,包含文件名及扩展名
  * @dirPath: 可选; 存储后的目录路径, 如不填统一放在 unclassified 目录下
  * @返回: url:string
  */
  uploadToTXCos(path, fileNamePrefix, dirPath) {
    return n_cos.uploadToTXCos(path, fileNamePrefix, dirPath)
  },
  /**
   *  > 删除指定 url
   * @param {*} urlPath 完整的 URL 路径
   */
  delByUrl(urlPath) {
    return n_cos.delByUrl(urlPath)
  }

}