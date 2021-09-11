const n_img = require('./img.js')


module.exports = {

  /**
 * > 1. 解析图片并传入腾讯云对象存储中
 * # 给我图片,返回一个 url
 * @返回: url:string
 */
  parseImageToCos(req) {
    return n_img.parseImageToCos(req)
  },
  /**
   *  删除指定 url
   * @param {*} urlPath 完整的 URL 路径
   */
   delImageUrl(urlPath) {
    return n_img.delImageUrl(urlPath)
  }

}