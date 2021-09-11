/**
 * ^ 查询数据库的信息
 * # 1.根据指定规则删除符合条件的数据
 * # 2.根据数据的_id 值,删除对应数据
 */

// 删除
const mongo = require('./model.js')
module.exports = {
  /**
  * > 根据指定规则删除符合条件的数据
  * @name : 集合名称
  * @rule : 约束的条件 {'字段名': 值}
  */
  delData(name, rule) {
    return new Promise(async (resolve, reject) => {
      try {
        let model = await mongo.getModel(name)
        const result = await model.remove(rule)
        if (result.deletedCount != 0) { return resolve(`删除成功,删除数据:${result.deletedCount}条`) }
        else if (result.ok == 1) { return resolve('操作成功,但数据没有变化') }
        else { return reject(result) }
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
  * > 根据数据的_id 值,删除对应数据
  * @name : 集合名称
  * @_id :  对应数据的_id 的值
  */
  delDataById(name, id) {
    return new Promise(async (resolve, reject) => {
      try {
        let model = await mongo.getModel(name)
        if (id.length != 0 && id) {
          const result = await model.remove({ _id: { $in: id } })
          if (result.deletedCount != 0) { return resolve(`删除成功,删除数据:${result.deletedCount}条`) }
          else if (result.ok == 1) { return resolve('操作成功,但数据没有变化') }
          else { return reject(result) }
        } else {
          reject('请填写 ID 值')
        }
      } catch (error) {
        reject(error)
      }
    })
  }

}