/**
 * ^ $上传文件到腾讯云对象
 * # 1.说明
*/
// 随机字符
const stringRandom = require('string-random')
const fs = require("fs");

// 腾讯云对象存储和 配置信息
const COS = require('cos-nodejs-sdk-v5');
let cos

const config = {
  SecretId: '',               // 腾讯云账号中获取
  SecretKey: '',              // 腾讯云账号中获取
  cos_imageDir: "",           // 临时存放目录
  BucketName: '',             // 桶名
  Region: '',                 // 地区固定写法
  root_path: '/',             // 桶下的目录路径
  StorageClass: 'STANDARD',   // 存储方式固定写法:标准存储
}

/**
 * ^ 腾讯存储对象配置信息
 * @image_cosPath:string : 文件在对象存储中的位置
 * @timeStr:string: 文件名称
 * @localFilesPath: 本地文件的读取地址 
 * #
 */
function TXCosInfo(root_path, timeStr, localFilesPath) {
  return {
    Bucket: config.BucketName,                  // 桶名
    Region: config.Region,                      // 地区:固定写法
    Key: root_path + '/' + timeStr,             // 路径+文件名
    StorageClass: config.StorageClass,          // 存储类型
    Body: fs.createReadStream(localFilesPath),      // 上传文件对象
    onProgress: function () {
      // console.log(JSON.stringify(progressData)); // 打印解析信息
    }
  }
}

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
    if (
      !TXConfig.SecretId ||
      !TXConfig.SecretKey ||
      !TXConfig.cos_imageDir ||
      !TXConfig.picturePrefix ||
      !TXConfig.BucketName ||
      !TXConfig.root_path ||
      !TXConfig.Region
    ) {
      throw '初始化参数不齐'
    }
    for (const key in TXConfig) {
      if (Object.hasOwnProperty.call(TXConfig, key)) {
        config[key] = TXConfig[key];
      }
    }
    // 初始化 COS 对象
    cos = new COS({
      SecretId: TXConfig.SecretId,
      SecretKey: TXConfig.SecretKey
    })
  },
  /** 
   * > 1. 将指定路径的文件上传到腾讯云对象中
   * @fileNamePrefix: 设置一个文件名的前缀 例如: 用户数据
   * @path: 需要上传的文件路径,包含文件名及扩展名
   * @dirPath: 可选; 存储后的目录路径, 如不填统一放在 unclassified 目录下
   * @返回: url:string
   */
  uploadToTXCos(path, fileNamePrefix, dirPath) {
    return new Promise((resolve, reject) => {
      try {
        // 创建一个随机名称 Temporary name
        const date = new Date().toLocaleDateString()
        let randomName = fileNamePrefix + date + stringRandom(12) + '.' + path.split('/').pop()
        randomName = randomName.replace(/\//g, '-')
        // 存储桶的配置信息
        const root_path = dirPath ? dirPath : config.root_path
        const cosInfo = TXCosInfo(root_path, randomName, path)
        // 发送到腾讯对象存储中
        cos.putObject(cosInfo, async (error, data) => {
          // 获得返回信息,将访问路径返回
          if (data) { return resolve({ "url": 'https://' + data.Location }) }
          else { return reject(error); }
        })

      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   *  删除指定 url
   * @param {*} urlPath 完整的 URL 路径
   */
  delByUrl(urlPath) {
    return new Promise((resolve, reject) => {
      try {
        // 截取   url
        const index = urlPath.lastIndexOf("\/")
        if (index == -1) {
          return reject('url 路径可能不正确,请检查后重试')
        }
        const fileName = urlPath.substring(index + 1, urlPath.length)
        cos.deleteObject({
          Bucket: config.BucketName,
          Region: config.Region,
          Key: config.avatar_path + '/' + fileName,
        }, function (err, data) {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        });
      } catch (error) {
        reject(error)
      }
    })
  }
}
