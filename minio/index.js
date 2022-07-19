const n_minio = require("./minIo_bucket");
const n_minio_obj = require("./minIo_object");
module.exports = {
  // ---  存储桶 操作
  /**
   * > 创建一个新的存储桶
   * @param {string} bucketName: 存储桶名
   * @param {string}(enum) region 创建时设置地区，默认是us-east-1(美国东一区)
   * @param {object} （可选）makeOpts 创建存储桶的选项。 例如 {ObjectLocking:true}
   * @returns 成功返回 存储桶创建成功,失败从 reject 返回
   */
  makeBucket(bucketName, makeOpts) {
    return n_minio.makeBucket(bucketName, makeOpts);
  },
  // > 列出所有存储桶
  listBuckets() {
    return n_minio.listBuckets();
  },
  /**
   * > 存储桶是否存在
   * @param {string} bucketName: 存储桶名
   * @returns  成功 true 不存在,通过 reject('存储桶不存在')
   */
  bucketExists(bucketName) {
    return n_minio.bucketExists(bucketName);
  },
  /**
   * > 获取存储桶的复制配置
   * @param {string} bucketName: 存储桶名
   * @returns  成功{object}    错误从 reject 返回
   */
  getBucketReplication(bucketName) {
    return n_minio.getBucketReplication(bucketName);
  },
  /**
   * > 获取存储桶的版本控制状态
   * @param {string} bucketName: 存储桶名
   * @returns  成功    错误从 reject 返回
   */
  getBucketVersioning(bucketName) {
    return n_minio.getBucketVersioning(bucketName);
  },
  /**
   * > 列出存储桶中所有对象
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
  listObjects(bucketName, prefix, recursive, listOpts) {
    return n_minio.listObjects(bucketName, prefix, recursive, listOpts);
  },

  // ---- 对象操作
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
  getObject(bucketName, objectName, getOpts) {
    return n_minio_obj.getObject(bucketName, objectName, getOpts);
  },

  /**
   * > 下载对象中指定区间的字节数组，并返回流。
   * @param {string} bucketName:  存储桶名称
   * @param {string} objectName :对象名称 例如: photo.jpg
   * @param {*} offset : 从第几个字节开始 例如: 10
   * @param {*} length : 截取字节的长度是多少 例如: 30
   * @param {object} getOpts :对象的版本，格式为{versionId:“my versionId”}。默认值为{}。（可选）
   * @returns
   */
  getPartialObject(bucketName, objectName, offset, length, getOpts) {
    return n_minio_obj.getPartialObject(bucketName, objectName, offset, length, getOpts);
  },
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
  fGetObject(bucketName, objectName, filePath, getOpts) {
    return n_minio_obj.fGetObject(bucketName, objectName, filePath, getOpts);
  },

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
  putObject(bucketName, objectName, dataObj, metaData) {
    return n_minio_obj.putObject(bucketName, objectName, dataObj, metaData);
  },
  /**
   * > 复制一个对象
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {string} sourceObject :新的路径,包含名称
   * @returns 返回结果,错误从 reject 中返回
   */
  copyObject(bucketName, objectName, sourceObject) {
    return n_minio_obj.copyObject(bucketName, objectName, sourceObject);
  },
  /**
   * 从指定路径上传文件。
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {path} filePath{path} : 可以读取的本地路径,包含文件名和扩展名 (优先级高)
   * @param {object} metaData 元数据; 貌似可以随便写
   * @returns
   */
  fPutObject(bucketName, objectName, filePath, metaData) {
    return n_minio_obj.fPutObject(bucketName, objectName, filePath, metaData);
  },
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
  statObject(bucketName, objectName, statOpts) {
    return n_minio_obj.statObject(bucketName, objectName, statOpts);
  },

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
  removeObject(bucketName, objectName, removeOpts) {
    return n_minio_obj.removeObject(bucketName, objectName, removeOpts);
  },
  /**
   * > 批量删除对象
   * @param {string} bucketName 存储桶名称。
   * @param {object} objectsList 要删除的桶中的对象列表。
   * @任意一种格式:
   * @1.['objectname1'，'objectname2']
   * @2.对象名和版本ID作为对象的列表：[{name:“我的对象名”，VersionId:“我的版本ID”}
   * @returns
   */
  removeObjects(bucketName, objectsList) {
    return n_minio_obj.removeObjects(bucketName, objectsList);
  },
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
  putObjectRetention(bucketName, objectName, retentionOpts) {
    return n_minio_obj.putObjectRetention(bucketName, objectName, retentionOpts);
  },

  /**
   * > 获取对象的保存信息
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {object} getOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
   * @returns
   */
  getObjectRetention(bucketName, objectName, getOpts) {
    return n_minio_obj.getObjectRetention(bucketName, objectName, getOpts);
  },

  /**
   * > 对象设置标签
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {object} tags : 设置标签 示例: {<tag-key-1>:<tag-value-1>} 可能是可以是 [{tag-key1:tag-value1}...]
   * @param {object} putOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
   * @returns
   */
  setObjectTagging(bucketName, objectName, tags, putOpts) {
    return n_minio_obj.setObjectTagging(bucketName, objectName, tags, putOpts);
  },
  /**
   * > 删除对象上的标签
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {object} removeOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
   * @returns
   */
  removeObjectTagging(bucketName, objectName, removeOpts) {
    return n_minio_obj.removeObjectTagging(bucketName, objectName, removeOpts);
  },
  /**
   * > 获取对象的标签
   * @param {string} bucketName 存储桶名称。
   * @param {string} objectName 对象名称。
   * @param {object} getOpts: 默认值{}, 参数格式类似去 { versionId:"my-versionId" }
   * @returns
   */
  getObjectTagging(bucketName, objectName, getOpts) {
    return n_minio_obj.getObjectTagging(bucketName, objectName, getOpts);
  },
};
