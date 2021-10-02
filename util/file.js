const fs = require("fs");
// 解析文件
const { IncomingForm } = require("formidable");
const pathRoot = require("path");
const config = {
  1: 1 * 1024 * 1024,
  2: 2 * 1024 * 1024,
  3: 3 * 1024 * 1024,
  5: 5 * 1024 * 1024,
};

/**
 * > 创建解析文件流的对象
 * @param {string} path 临时存放路径 例如:/www/images
 * @param {number} size 限制文件大小默认有 1M|2M|3M|5M 写1|2|3|5 或写字节数
 * @returns 解析对象
 */
function IncomingFormObj(path, size) {
  const form = new IncomingForm();
  // 从网站临时保存目录获取图片文件
  form.uploadDir = pathRoot.join(path); // 图片临时存放目录
  form.keepExtensions = true; //保留文件名后缀
  form.maxFieldsSize = config[size] ? config[size] : size; // 最大 5M  限制
  return form;
}

// 关于文件的处理
module.exports = {
  /**
   * > 解析文件,并保存在指定的临时目录中(处理过图片资源)
   * @param {Object} req 请求对象
   * @param {string} path 临时存放路径 例如:/www/images
   * @param {number} size 限制文件大小默认有 1M|2M|3M|5M 写1|2|3|5 或写字节数
   * @returns {
   * @    path{string}: 保存的路径,包含文件名和扩展名
   * @    fields{object}: 上传附带的其他信息{key:value,key1:value....}
   * @ }
   */
  parseFileToPath(req, path, size) {
    return new Promise((resolve, reject) => {
      try {
        // 处理数据,网站发来的图片
        const form = IncomingFormObj(path, size);
        // 解析发送的图片数据
        form.parse(req, async (error, fields, files) => {
          // 这个是 elementUI 的上传字段
          if (!files.file) {
            return reject("数据解析异常, 请查看资源是否存在");
          }
          // 有错报错
          if (error) {
            return reject(error);
          }
          // 获取图片类型和本地存放的临时路径
          const { type, path } = files.file;
          // 创建一个随机文件名称
          return resolve({ path: path, type: type, fields: fields });
        });
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 数据流转成文件(处理过 Excel 类型文件)
   * @param {*} stream  文件的数据流
   * @param {*} saveFilePath 存放的位置; 完整写法: path/文件名.扩展名
   * @returns 成功返回保存路径, 错误给予错误原因
   */
  streamToFile(stream, saveFilePath) {
    return new Promise((res, rej) => {
      const ws = fs.createWriteStream(saveFilePath);
      stream.pipe(ws).on("finish", () => {
        res(saveFilePath);
      });
      ws.on("error", (err) => {
        rej(err);
      });
    });
  },
};
