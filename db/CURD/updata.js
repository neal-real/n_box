/**
 * ^ 查询数据库的信息
 * # 1.根据 user_id 属性 更新指定集合的数据
 * # 2.比较新旧密码是否一致
 */


/**
* &文件说明  更新数据库的相关操作
*/
const mongo = require('./model.js')
module.exports = {
  /**
  * > 根据 user_id 属性 更新指定集合的数据
  * @ 参数: model_name : 数据库名称
  * @ 参数: data : 需要更新的数据,包含user_id 字段
  * @ 成功返回新的数据,  错误:返回null
  */
  updataByUser_Id(model_name, data) {
    return new Promise(async function (resolve, reject) {
      try {
        let model = await mongo.getModel(model_name)
        if (!data.user_id) { return reject('缺少 user_id 字段') }
        let id = data.user_id
        delete data.user_id;
        const options = { new: true, runValidators: true }
        const result = await model.findOneAndUpdate(id, data, options)
        return resolve(result)
        // return reject('更新失败,数据没有发生改变');
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
  * > 根据 数据_id 属性 更新指定集合的数据
  * @ 参数: model_name : 数据库名称
  * @ 参数: data : 需要更新的数据,包含user_id 字段
  * @ 成功返回新的数据,  错误:返回null
  */
  updateById(model_name, id, newData) {
    return new Promise(async function (resolve, reject) {
      try {
        if (!id) return reject('缺少 id 字段')
        let model = await mongo.getModel(model_name)
        // new: true, runValidators: true 验证集合规则
        const options = { new: true, runValidators: true }
        const result = await model.updateOne({ _id: id }, newData, options)
        if (result) {
          return resolve(result)
        } else {
          reject('更新失败,数据库没有返回数据' + result)
        }
      } catch (error) {
        if (error.code == 11000) {
          reject('更新失败: 不能重复的字段的值,出现重复,请检查参数')
        } else {
          reject(error)
        }
      }
    })
  },


  /**
  * > 根据条件更新符合条件的全部数据
  * @ 参数: model_name : 集合的名称
  * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
  * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
  */
  update(model_name, condition, newData) {
    return new Promise(async function (resolve, reject) {
      try {
        let model = await mongo.getModel(model_name)
        const result = await model.update(condition, newData)
        if (result.n != 0) { return resolve(`删除成功,删除数据:${result.n}条`) }
        else if (result.ok == 1) { return resolve('操作成功,但数据没有变化') }
        else { return reject(reuslt) }
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
  * > 更新符合条件的一条数据
  * @ 参数: model_name : 集合的名称
  * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
  * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
  */
  updateOne(model_name, condition, newData) {
    return new Promise(async function (resolve, reject) {
      try {
        let model = await mongo.getModel(model_name)
        const options = { new: true, runValidators: true }
        const result = await model.updateOne(condition, newData, options)
        return resolve(result);
      } catch (error) {
        reject(error)
      }
    })
  }
}