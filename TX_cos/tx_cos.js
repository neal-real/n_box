/**
 * ^ $上传文件到腾讯云对象
 * # 1.说明
 */
// 随机字符
const { getRandomName, getLastItem } = require("../util");
const fs = require("fs");

// 腾讯云对象存储和 配置信息
const COS = require("cos-nodejs-sdk-v5");

/**
 * > 腾讯存储对象配置信息
 * @param {object} TXConfig {
 * @    BucketName{string}: 桶名
 * @    cos_path{string}: 在对象存储中的路径
 * @    Region{string}: 地区固定写法
 * @    StorageClass{string}: 存储方式: 默认标准存储'STANDARD'
 * @  }
 * @param {string} fileName : 上传后的名称
 * @param {*} localFilesPath :本地读取的路径
 * @returns
 */
function TXCosInfo(TXConfig, fileName, localFilesPath) {
  return {
    Bucket: TXConfig.BucketName, // 桶名
    Region: TXConfig.Region, // 地区:固定写法
    Key: TXConfig.cos_path + "/" + fileName, // 路径+文件名
    StorageClass: TXConfig.StorageClass, // 存储类型
    Body: fs.createReadStream(localFilesPath), // 上传文件对象
    onProgress: function () {
      // console.log(JSON.stringify(progressData)); // 打印解析信息
    },
  };
}

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
    return new Promise((resolve, reject) => {
      try {
        // 1. TX配置信息
        const cos = new COS({
          SecretId: TXConfig.secretId,
          SecretKey: TXConfig.secretKey,
        });
        // 新文件随机名称
        const randomName = getRandomName(LocalConfig.path, LocalConfig.fileNamePrefix);
        // 2 本地配置信息
        const cosInfo = TXCosInfo(TXConfig, randomName, LocalConfig.path);
        // 发送到腾讯对象存储中
        cos.putObject(cosInfo, async (error, data) => {
          // 获得返回信息,将访问路径返回
          if (data) {
            return resolve({ url: "https://" + data.Location });
          } else {
            return reject(error);
          }
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   *  删除指定 url
   * @param {*} urlPath
   */
  /**
   * 删除 TX 对象存储中指定路径的资源
   * @param {*} TXConfig {
   * @    secretId{string}: 腾讯云账号中获取
   * @    secretKey{string}: 腾讯云账号中获取
   * @    BucketName{string}: 桶名
   * @    cos_path{string}: 在对象存储中的路径
   * @    Region{string}: 地区固定写法
   * @  }
   * @param {url|string} urlPath :完整的 URL 路径或者仅仅是文件名(含扩展名)
   * @returns
   */
  delByUrl(TXConfig, urlPath) {
    return new Promise((resolve, reject) => {
      try {
        if (!TXConfig||!urlPath) { return reject('删除 url 缺少必要参数') }
        // 获取路径中最后一段的文件名,
        const fileName = getLastItem(urlPath);
        // 1. TX配置信息
        const cos = new COS({
          SecretId: TXConfig.secretId,
          SecretKey: TXConfig.secretKey,
        });
        cos.deleteObject(
          {
            Bucket: TXConfig.BucketName,
            Region: TXConfig.Region,
            Key: TXConfig.cos_path + "/" + fileName,
          },
          function (err, data) {
            if (err) {
              reject(err);
            } else {
              resolve(data);
            }
          }
        );
      } catch (error) {
        reject(error);
      }
    });
  },
};
