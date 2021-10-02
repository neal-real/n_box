// 处理模型相关
const mongoose = require("mongoose");
mongoose.set("useFindAndModify", false); // 此句是避免弃用警告
const fs = require("fs");
//> 存放集合对象,避免重复获取
var models = {};

/**
 * > 懒加载 模型对象集合
 * @ 参数: modelName : 根据模型名称,返回对应模型
 */
function getModel(modelName) {
  return new Promise(async function (resolve, reject) {
    try {
      // 从模型库中查找是否有对象
      let model = models[modelName];
      // 模型为undefined,则创建模型,否则模型有值
      if (!model) {
        // 创建模型
        model = await createCourse(modelName);
        models[modelName] = model;
      }
      resolve(model);
    } catch (error) {
      reject(error);
    }
  });
}
// 判断指定路径下是否存在某个文件
function isExists(name) {
  return new Promise(async function (resolve, reject) {
    try {
      const reg = new RegExp("/n_box/db/CURD", "g");
      const path = __dirname.replace(reg, "/n_box/db/schema/") + name + ".js";
      const path2 = __dirname.replace(reg, "/schema/") + name + ".js";
      if (fs.existsSync(path)) {
        const { schema } = require(path);
        return resolve(schema);
      } else {
        if (fs.existsSync(path2)) {
          const { schema } = require(path2);
          return resolve(schema);
        } else {
          reject("即没有在 db 下的 schema 目录找到集合文件也没有找到和 n_box 同级的 schema 目录或此目录没有对应的集合的文件");
        }
      }
    } catch (error) {
      reject(error);
    }
  });
}
//> 根据名称,创建对应集合对象
function createCourse(name) {
  return new Promise(async function (resolve, reject) {
    try {
      const schema = await isExists(name);
      const option = { collection: name };
      const courseSchema = new mongoose.Schema(schema, option);
      const course = mongoose.model(name, courseSchema);
      resolve(course);
    } catch (error) {
      reject(error);
    }
  });
}
module.exports = {
  getModel,
};
