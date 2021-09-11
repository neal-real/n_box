const n_cos = require('./tx_cos')


module.exports = {

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
   *  删除指定 url
   * @param {*} urlPath 完整的 URL 路径
   */
  delImageUrl(urlPath) {
    return n_cos.delImageUrl(urlPath)
  }

}