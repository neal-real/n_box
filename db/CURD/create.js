/**
 * ^ 查询数据库的信息
 * # 1.添加一条数据
 */

// 数据的创建
const mongo = require('./model.js')

module.exports = {
  /**
  * > 添加一条数据
  * > 说明: 集合对应的文件会在 n_box 的同级目录 schema 中寻找或在 n_box>db>schema 下寻找
  * @name : 集合名称
  * @data : 要添加的数据
  * @返回值: 创建成功的数据, 或者错误信息
  */
  addData(name, rule) {
    return new Promise(async (resolve, reject) => {
      try {
        const model = await mongo.getModel(name)
        const result = await model.create(rule)
        if (result) {
          resolve(result)
        } else {
          reject('创建失败')
        }
      } catch (error) {
        if (error.code == 11000) {
          reject('字段值重复' + error.keyValues)
        } else {
          reject(error)
        }
      }
    })
  }
}