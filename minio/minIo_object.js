const Fs = require("fs");
const { mc, conds } = require("./minio.js");
const QS = require("qs");
// versionId 版本 ID 要在创建桶的时候设置开启
/**
 * > 下载对象
 * @param {string} bucketName:  存储桶名称
 * @param {string} objectName :对象名称 例如: photo.jpg
 * @param {object} getOpts :对象的版本，格式为{versionId:“my versionId”}。默认值为{}。（可选）
 * @returns 不存在返回 false,
 * @ 成功返回 {
 * @  data: {any},
 * @  size: 19,
 * @  path: "/user/abc.txt",
 * @  type: "text/plain"
 * @  }
 */
function getObject(bucketName, objectName, getOpts) {
  return new Promise(function (resolve, reject) {
    try {
      let size = 0;
      let data = "";
      mc.getObject(bucketName, objectName, getOpts, function (err, dataStream) {
        if (err) {
          // 不存在返回成功, 值为 false
          if (err.code == "NoSuchKey") {
            return resolve(false);
          }
          return reject(err);
        }
        dataStream.on("data", function (chunk) {
          size += chunk.length;
          data += chunk;
        });
        dataStream.on("end", function () {
          const resData = {
            data: data,
            size: size,
            // 汉子进行转码 UTF-8
            path: decodeURIComponent(dataStream.req.path),
            type: dataStream.headers["content-type"],
          };
          // JSON 格式转对象
          if (resData.type === "application/json") {
            resData.data = QS.parse(resData.data);
          }
          // 文字类型, 暂时不做处理
          // if (resData.type === "text/plain") {}
          resolve(resData);
        });
        dataStream.on("error", function (err) {
          reject(err);
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 下载对象中指定区间的字节数组，并返回流。
 * @param {string} bucketName:  存储桶名称
 * @param {string} objectName :对象名称 例如: photo.jpg
 * @param {*} offset : 从第几个字节开始 例如: 10
 * @param {*} length : 截取字节的长度是多少 例如: 30
 * @param {object} getOpts :对象的版本，格式为{versionId:“my versionId”}。默认值为{}。（可选）
 * @returns
 */
function getPartialObject(bucketName, objectName, offset, length, getOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      let versionedObjSize = 0;
      let data;
      // 从偏移量 10 读取 30 个字节。
      mc.getPartialObject(bucketName, objectName, offset, length, getOpts, function (err, dataStream) {
        if (err) return reject(err);
        dataStream.on("data", function (chunk) {
          versionedObjSize += chunk.length;
          data += chunk;
        });
        dataStream.on("end", function () {
          console.log("下载结束 总计大小 = " + size);
        });

        dataStream.on("error", function (err) {
          reject(err);
        });
      });
      resolve({
        data: data,
        size: size,
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 将对象下载到本地路径
 * @param {string} bucketName : 存储桶名称
 * @param {string} objectName : 对象名称 "MyImage.jpg"
 * @param {string} filePath : 要写入的本地文件路径。 "./download/MyImage.jpg"
 * @param {object} getOpts : 保留选项如下:
 * @{
 * @   governanceBypass:true/false ,
 * @   mode:COMPLIANCE/GOVERNANCE,
 * @   retainUntilDate: _date_ ,
 * @   versionId:"my-versionId"
 * @}
 * @    Default is {}
 * @returns
 */
function fGetObject(bucketName, objectName, filePath, getOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.fGetObject(bucketName, objectName, filePath, getOpts, function (e) {
        if (e) return reject(e);
        resolve("下载成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 从一个本地路径中上传一个对象。
 * * 单个对象的最大大小限制为5TB。putObject透明地在多个部分上载大于64MiB的对象。上传的数据使用MD5SUM签名仔细验证。
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} dataObj = { 以下二选一
 * @  filePath{path} : 可以读取的本地路径,包含文件名和扩展名 (优先级高)
 * @  buffer{buffer|string} : buffer类型的值或者字符串都可以
 * @ }
 * @param {number} size 对象的大小（可选）。
 * @param {Object} metaData 对象的元数据
 * @returns
 */
function putObject(bucketName, objectName, dataObj, metaData) {
  return new Promise(async function (resolve, reject) {
    try {
      metaData = metaData ? metaData : {};
      if (dataObj.filePath) {
        const fileStream = Fs.createReadStream(dataObj.filePath);
        Fs.stat(dataObj.filePath, function (err, stats) {
          if (err) return reject(err);
          mc.putObject(bucketName, objectName, fileStream, stats.size, metaData, function (err, objInfo) {
            //err应该为空
            if (err) return reject(err);
            resolve(objInfo);
          });
        });
      } else if (dataObj.buffer) {
        mc.putObject(bucketName, objectName, dataObj.buffer, metaData, function (err, etag) {
          if (err) return reject(err);
          resolve(etag);
        });
      } else {
        reject("数据对象格式不正确");
      }
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * 从指定路径上传文件。
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {path} filePath{path} : 可以读取的本地路径,包含文件名和扩展名 (优先级高)
 * @param {object} metaData 元数据; 貌似可以随便写
 * @returns
 */
function fPutObject(bucketName, objectName, filePath, metaData) {
  return new Promise(async function (resolve, reject) {
    try {
      // 示例
      // var file = "/tmp/40mbfile";
      // var metaData = {
      //   "Content-Type": "text/html",
      //   "Content-Language": 123,
      //   "X-Amz-Meta-Testing": 1234,
      //   example: 5678,
      // };
      mc.fPutObject(bucketName, objectName, filePath, metaData, function (err, objInfo) {
        if (err) return reject(err);
        resolve(objInfo);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 复制一个对象
 * @param {string} bucketName 目标存储桶名称。
 * @param {string} objectName 目标位置+对象名称。
 * @param {string} sourceObject :源存储桶名称+源对象名称示例 "user/abc/a/app.txt"
 * @param {CopyConditions} conditions : 复制对象之前的前提条件,如果有设置的话,需要填写
 * @returns 返回结果,错误从 reject 中返回
 */
function copyObject(bucketName, objectName, sourceObject) {
  return new Promise(async function (resolve, reject) {
    try {
      // console.log(mc);
      // 示例:
      // conds.setMatchETag("deb39151186fe7bc40462b9be2bd7dfd");
      mc.copyObject(bucketName, objectName, sourceObject, conds, function (err, data) {
        if (err) {
          console.log("copyObject ---> error");
          console.log(err);
          return reject(err);
        }
        resolve(data);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获取对象的元数据。
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {*} statOpts
 * @returns {
 * @  size{number}: 对象的大小
 * @  etag{string}: 对象的标签。
 * @  versionId{string}: 对象的版本
 * @  metaData{object}: 对象的元数据
 * @  lastModified(Date): 最后更新的时间
 * @ }
 */
function statObject(bucketName, objectName, statOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      statOpts = statOpts ? statOpts : {};
      mc.statObject(bucketName, objectName, statOpts, function (err, stat) {
        if (err) return reject(err);
        resolve(resolve);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 删除一个对象
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} removeOpts(可选) :对象的版本，。默认是{} ,形式为;
 * @{
 * @  versionId:"my-versionId"， 删除对象的特定版本
 * @  governanceBypass: true或false 使用governanceBypass Remove选项删除使用保留模式管理锁定的对象版本
 * @ }
 * @returns
 */
function removeObject(bucketName, objectName, removeOpts = {}) {
  return new Promise(async function (resolve, reject) {
    try {
      const res = await mc.removeObject(bucketName, objectName,);
      if (res) return reject(err);
      return resolve("删除成功");
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 批量删除对象
 * @param {string} bucketName 存储桶名称。
 * @param {object} objectsList 要删除的桶中的对象列表。
 * @任意一种格式:
 * @1.['objectname1'，'objectname2']
 * @2.对象名和版本ID作为对象的列表：[{name:“我的对象名”，VersionId:“我的版本ID”}
 * @returns
 */
function removeObjects(bucketName, objectsList) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.removeObjects(bucketName, objectsList, function (e) {
        if (e) return reject("无法删除对象", e);
        resolve("已成功删除对象");
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 设置对象的保存时间.
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} retentionOpts(可选) 默认是{}, 保存选项类似于 :{
 * @   governanceBypass:true/false ,
 * @   Mode{string}:COMPLIANCE/GOVERNANCE,
 * @   retainUntilDate{string}: _date_ ,
 * @   versionId:"my-versionId"
 * @ }
 * @ }
 * @returns
 */
function putObjectRetention(bucketName, objectName, retentionOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      // const expirationDate = new Date();
      // expirationDate.setDate(expirationDate.getDate() + 1);
      // expirationDate.setUTCHours(0, 0, 0, 0); //应该是一天的开始.(midnight)
      // const versionId = "e67b4b08-144d-4fc4-ba15-43c3f7f9ba74";
      // 示例retentionOpts = { Mode: "GOVERNANCE", retainUntilDate: expirationDate.toISOString(), versionId: versionId },
      mc.putObjectRetention(bucketName, objectName, retentionOpts, function (err) {
        if (e) return reject(e);
        resolve("设置成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获取对象的保存信息
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} getOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
 * @returns
 */
function getObjectRetention(bucketName, objectName, getOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getObjectRetention(bucketName, objectName, getOpts, function (err, res) {
        if (err) return reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 对象设置标签
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} tags : 设置标签, key 重复会覆盖原有值 示例: {<tag-key>:<tag-value>} 多个值: [{tag-key2:tag-value2}...]
 * @param {object} putOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
 * @returns
 */
function setObjectTagging(bucketName, objectName, tags, putOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      putOpts = putOpts ? putOpts : {};
      mc.setObjectTagging(bucketName, objectName, tags, putOpts, function (err) {
        if (err) return reject(err);
        resolve("标签设置成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 删除对象上的标签
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} removeOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
 * @returns
 */
function removeObjectTagging(bucketName, objectName, removeOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.removeObjectTagging(bucketName, objectName, removeOpts, function (err) {
        if (err) return reject(err);
        resolve("删除设置成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 获取对象的标签
 * @param {string} bucketName 存储桶名称。
 * @param {string} objectName 对象名称。
 * @param {object} getOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
 * @returns
 */
function getObjectTagging(bucketName, objectName, getOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getObjectTagging(bucketName, objectName, getOpts, function (err, tagsList) {
        if (err) return reject(err);
        resolve(tagsList);
      });
    } catch (error) {
      reject(error);
    }
  });
}
// --- 剩余两个对对象的合法持有权的设置

module.exports = {
  getObject,
  getPartialObject,
  fGetObject,
  putObject,
  fPutObject,
  copyObject,
  statObject,
  removeObject,
  removeObjects,
  putObjectRetention,
  getObjectRetention,
  setObjectTagging,
  removeObjectTagging,
  getObjectTagging,
};
