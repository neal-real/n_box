const { mc } = require("./minio.js");
const REGION = "cn-north-1";
/**
 * > 创建一个新的存储桶
 * @param {string} bucketName: 存储桶名
 * @param {string}(enum) region 创建时设置地区，默认是us-east-1(美国东一区)
 * @param {object} （可选）makeOpts 创建存储桶的选项。 例如 {ObjectLocking:true}
 * @returns 成功返回 存储桶创建成功,失败从 reject 返回
 */
function makeBucket(bucketName, makeOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      makeOpts = makeOpts ? makeOpts : {};
      mc.makeBucket(bucketName, REGION, makeOpts, function (err) {
        if (err) return reject("存储桶创建错误" + err);
        resolve(bucketName + "存储桶创建成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 列出所有存储桶
 * @returns  错误从 reject 返回
 * @returns 成功 [
		{
			"name": "meilisearch",
			"creationDate": "2021-10-03T14:43:09.123Z"
		},
		{
			"name": "user",
			"creationDate": "2021-10-04T05:43:02.669Z"
		}
 * @	]
 */
function listBuckets() {
  return new Promise(async function (resolve, reject) {
    try {
      mc.listBuckets(function (err, buckets) {
        if (err) return reject(err);
        resolve(buckets);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 存储桶是否存在
 * @param {string} bucketName: 存储桶名
 * @returns  成功 true 不存在,通过 reject('存储桶不存在')
 */
function bucketExists(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.bucketExists(bucketName, function (err, exists) {
        if (err) return reject("存储桶不存在");
        if (exists) return resolve(true);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 删除存储桶
 * @param {string} 桶的名称
 * @returns  成功 '桶删除成功'   错误从 reject 返回
 */
function removeBucket(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      if (err) return reject("无法移除桶");
      resolve("桶删除成功");
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 查询桶内有多少个对象, 返回每个对象的基本信息
 * @param {string} bucketName: 存储桶名
 * @param {string} prefix 要列出的对象的前缀 (可选，默认值是'')。
 * @param {bool} recursive true代表递归查找，false代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是false）
 * @param {object} listOpts 查询参数列表对象可以有{IncludeVersion: _bool_}(可选)
 * @returns {
 * @ name{string} 对象的名称
 * @ prefix{string} 对象前缀的名称
 * @ size{number} 对象的大小
 * @ etag{string}	对象的标签
 * @ versionId{string}对象的versionId
 * @ isDeleteMarker{boolean}如果是删除标记，则为True
 * @ lastModified{Date}最后一次更新时间
 * @ }
 * @ 错误从 reject 返回
 */
function listObjects(bucketName, prefix, recursive, listOpts) {
  return new Promise(async function (resolve, reject) {
    try {
      listOpts = listOpts ? listOpts : {};
      let data = [];
      const stream = await mc.listObjects(bucketName, prefix, recursive, listOpts);
      stream.on("data", function (obj) {
        data.push(obj);
      });
      stream.on("end", function (obj) {
        resolve(data);
      });
      stream.on("error", function (err) {
        console.log("err");
        console.log(err);
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 使用S3 listing objects V2版本API列出所有对象。
 * @param {string} bucketName: 存储桶名
 * @param {string} prefix 要列出的对象的前缀 (可选，默认值是'')。
 * @param {bool} recursive true代表递归查找，false代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是false）
 * @param {object} startAfter 指定在列出桶中的对象时开始的对象名称。(可选,默认”)。
 * @returns {
 * @ name{string} 对象的名称
 * @ prefix{string} 对象前缀的名称
 * @ size{number} 对象的大小
 * @ etag{string}	对象的标签
 * @ lastModified{Date}最后一次更新时间
 * @ }
 * @ 错误从 reject 返回
 */
function listObjectsV2(bucketName, prefix, recursive, startAfter) {
  return new Promise(async function (resolve, reject) {
    try {
      console.log("------------");
      const stream = mc.listObjectsV2(bucketName, prefix, recursive, startAfter);
      stream.on("data", function (obj) {
        resolve(obj);
      });
      stream.on("error", function (err) {
        reject(err);
      });
    } catch (error) {
      reject(error);
    }
  });
}
/**
 * > 列出存储桶中未完整上传的对象。
 * @param {string} bucketName: 存储桶名
 * @param {*} prefix 要列出的对象的前缀 (可选，默认值是'')。
 * @param {*} recursive true代表递归查找，false代表类似文件夹查找，以'/'分隔，不查子文件夹。（可选，默认值是false）
 * @returns  成功    错误从 reject 返回
 */
function listIncompleteUploads(bucketName, prefix, recursive) {
  return new Promise(async function (resolve, reject) {
    try {
      const Stream = mc.listIncompleteUploads(bucketName, prefix, recursive);
      let res = {
        data: {},
        isEnd: false,
      };
      await Stream.on("data", function (obj) {
        res.data += obj;
      });
      await Stream.on("end", function () {
        res.isEnd = true;
      });
      await Stream.on("error", function (err) {
        reject(err);
      });
      resolve(res);
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获取存储桶的版本控制状态
 * @param {string} bucketName: 存储桶名
 * @returns  成功    错误从 reject 返回
 */
function getBucketVersioning(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getBucketVersioning(bucketName, function (err, res) {
        if (err) return reject(err);
        resolve(res);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 设置桶的版本状态
 * @param {string} bucketName: 存储桶名
 * @param {object} versioningConfig 版本控制配置，例如：{Status:“Enabled”}
 * @returns  成功    错误从 reject 返回
 */
function setBucketVersioning(bucketName, versioningConfig) {
  return new Promise(async function (resolve, reject) {
    try {
      // var versioningConfig =  { Status: "Enabled" };
      mc.setBucketVersioning(bucketName, versioningConfig, function (err) {
        if (err) {
          return reject(err);
        }
        resolve("设置成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 在存储桶上设置复制配置
 * @param {string} bucketName: 存储桶名
 * @param {object} replicationConfig 将replicationConfig配置为JSON对象
 * @returns  成功    错误从 reject 返回
 */
function setBucketReplication(bucketName, replicationConfig) {
  return new Promise(async function (resolve, reject) {
    try {
      //  示例配置
      // const arnFromMcCli = "arn:minio:replication::1277fcbe7df0bab76ab0c64cf7c45a0d27e01917ee5f11e913f3478417833660:destination";

      // var replicationConfig = {
      //   role: arnFromMcCli,
      //   rules: [
      //     {
      //       DeleteMarkerReplication: {
      //         Status: "Disabled",
      //       },
      //       DeleteReplication: {
      //         Status: [],
      //       },
      //       Destination: {
      //         Bucket: "arn:aws:s3:::destination",
      //       },
      //       Priority: "1",
      //       Status: "Enabled",
      //     },
      //   ],
      // };

      mc.setBucketReplication(bucketName, replicationConfig, function (err) {
        if (err) {
          return reject(err);
        }
        resolve("设置成功");
      });
      resolve();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获取存储桶的复制配置
 * @param {string} bucketName: 存储桶名
 * @returns  成功{object}    错误从 reject 返回
 */
function getBucketReplication(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getBucketReplication(bucketName, function (err, replicationConfig) {
        if (err) return reject(err);
        resolve(replicationConfig);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 删除存储桶的复制配置
 * @param {string} bucketName: 存储桶名
 * @returns  成功    错误从 reject 返回
 */
function removeBucketReplication(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.removeBucketReplication(bucketName, function (err, replicationConfig) {
        if (err) return reject(err);
        resolve("成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 设置桶上的标签
 * @param {string} bucketName: 存储桶名
 * @param {*} tags 
 
 * @returns  成功    错误从 reject 返回
 */
function setBucketTagging(bucketName, tags) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.setBucketTagging(bucketName, tags, function (err) {
        if (err) return reject(err);
        resolve("成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 删除桶上的标签
 * @param {string} bucketName: 存储桶名
 * @returns  成功    错误从 reject 返回
 */
function removeBucketTagging(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.removeBucketTagging(bucketName, function (err) {
        if (err) return reject(err);
        resolve("成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获得桶上的标签
 * @param {string} bucketName: 存储桶名
 
 * @returns  成功    错误从 reject 返回
 */
function getBucketTagging(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getBucketTagging(bucketName, function (err, tagsList) {
        if (err) return reject(err);
        resolve(tagsList);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 设置桶的生命周期配置
 * @param {string} bucketName: 存储桶名
 * @param {*} lifecycleConfig  有效的生命周期配置或(null或")删除策略配置
 * @returns  成功    错误从 reject 返回
 */
function setBucketLifecycle(bucketName, lifecycleConfig) {
  return new Promise(async function (resolve, reject) {
    try {
      // const lifecycleConfig = {
      //   Rule: [
      //     {
      //       ID: "Transition and Expiration Rule",
      //       Status: "Enabled",
      //       Filter: {
      //         Prefix: "",
      //       },
      //       Expiration: {
      //         Days: "3650",
      //       },
      //     },
      //   ],
      // };

      mc.setBucketLifecycle(bucketName, lifecycleConfig, function (err) {
        if (err) return reject(err);
        resolve("成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 获取桶的生命周期
 * @param {string} bucketName: 存储桶名
 
 * @returns  成功    错误从 reject 返回
 */
function getBucketLifecycle(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.getBucketLifecycle(bucketName, function (err, lifecycleConfig) {
        if (err) return reject(err);
        resolve(lifecycleConfig);
      });
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * > 删除桶的生命周期
 * @param {string} bucketName: 存储桶名
 
 * @returns  成功    错误从 reject 返回
 */
function removeBucketLifecycle(bucketName) {
  return new Promise(async function (resolve, reject) {
    try {
      mc.removeBucketLifecycle(bucketName, function (err) {
        if (err) return reject(err);
        resolve("成功");
      });
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  makeBucket,
  listBuckets,
  bucketExists,
  removeBucket,
  listObjects,
  listObjectsV2,
  listIncompleteUploads,
  getBucketVersioning,
  setBucketVersioning,
  getBucketReplication,
  removeBucketReplication,
  setBucketTagging,
  removeBucketTagging,
  getBucketTagging,
  setBucketLifecycle,
  getBucketLifecycle,
  removeBucketLifecycle,
};
