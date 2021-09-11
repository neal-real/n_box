
/*
 ? 使用腾讯云保存图片功能具体实现
*/
// 腾讯云对象存储和 配置信息
const COS = require('cos-nodejs-sdk-v5');
const config = {
  cos: {
    cos_imageDir: "/Volumes/", // 图片临时存放目录
    max_ImageSize1M: 1 * 1024 * 1024,
    max_ImageSize2M: 2 * 1024 * 1024,
    max_ImageSize3M: 3 * 1024 * 1024,
    max_ImageSize5M: 5 * 1024 * 1024,
    picturePrefix: '',  // 文件名前缀
    BucketName: '',  // 桶名
    Region: 'ap-shnghai',          // 固定写法
    avatar_path: '/images',
    StorageClass: 'STANDARD', // 标准写法

  }
}
const cos = new COS({
  SecretId: '',   // 腾讯云账号中获取
  SecretKey: ''    /// 腾讯云账号中获取
})
// 解析图片
const { IncomingForm } = require('formidable');
// 随机字符粗
const stringRandom = require('string-random')
const pathRoot = require("path");
const fs = require("fs");

/**
 * ^ 腾讯存储对象配置信息
 * @image_cosPath:string : 图片存放指定的路径, 对象存储中指定
 * @timeStr:string: 图片名称
 * @localFilesPath: 本地图片的读取地址 
 * #
 */
function TXCosInfo(image_cosPath, timeStr, localFilesPath) {
  return {
    Bucket: config.cos.BucketName,                     /* 桶名*/
    Region: config.cos.Region,                            /* 地区:固定写法 */
    Key: image_cosPath + '/' + timeStr,          /* 路径+文件名 */
    StorageClass: config.cos.StorageClass,     //存储类型
    Body: fs.createReadStream(localFilesPath),     // 上传文件对象
    onProgress: function () {
      // console.log(JSON.stringify(progressData));   // 打印解析信息
    }
  }
}
/**
 * ^ 解析图片的对象
 * @image_cosPath:string : 图片存放指定的路径, 对象存储中指定
 * @timeStr:string: 图片名称
 * @localFilesPath: 本地图片的读取地址 
 * #
 */
function IncomingFormObj(imageSize) {
  const form = new IncomingForm;
  // 从网站临时保存目录获取图片文件
  form.uploadDir = pathRoot.join(config.cos.cos_imageDir);   // 图片临时存放目录
  form.keepExtensions = true;                                //保留文件名后缀
  form.maxFieldsSize = imageSize;           // 最大 5M  限制
  return form
}

module.exports = {

  /**
 * > 1. 解析图片并传入腾讯云对象存储中
 * # 给我图片,返回一个 url
 * @返回: url:string
 */
  parseImageToCos(req) {
    return new Promise((resolve, reject) => {
      try {
        // 处理数据,网站发来的图片
        const form = IncomingFormObj(config.cos.max_ImageSize2M)
        // 解析发送的图片数据
        form.parse(req, async (error, fields, files) => {
          if (fields) { }  // 无用,防 ts 报错
          if (!files.img) {
            if (!files.file) {
              return reject('数据解析异常, 请查看资源是否是图片')
            }else {
              files.img = files.file
            }
          }
          if (error) { return reject(error); }
          // 获取图片类型和本地存放的临时路径
          const { type, path } = files.img
          // 创建一个随机图片名称
          let timeStr = config.cos.picturePrefix + new Date().getTime() + stringRandom(16) + '.' + type.split('/').pop()
          // 存储桶的配置信息
          const cosInfo = TXCosInfo(config.cos.avatar_path, timeStr, path)
          // 发送到腾讯对象存储中
          cos.putObject(cosInfo, async (error, data) => {
            // 获得返回信息,将访问路径返回
            if (data) { return resolve({ "url": 'https://' + data.Location, fields: fields }) }
            else { return reject(error); }
          })
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
  delImageUrl(urlPath) {
    return new Promise((resolve, reject) => {
      try {
        // 截取   url
        const index = urlPath.lastIndexOf("\/")
        if (index == -1) {
          return reject('url 路径可能不正确,请检查后重试')
        }
        const fileName = urlPath.substring(index + 1, urlPath.length)
        cos.deleteObject({
          Bucket: config.cos.BucketName,
          Region: config.cos.Region,
          Key: config.cos.avatar_path + '/' + fileName,
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
