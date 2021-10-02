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
   * > 根据 _id 属性 更新指定集合的数据,并在返回数据隐藏指定字段的值
   * @param {string} model_name :集合名称
   * @param {string} id :指定集合的_id字段值
   * @param {Object} newData {字段名:字段值,字段名:字段值,}
   * @param {Array} IgnoreField 需要置空的字段 ['email','password'...]
   * @returns 更新后的值?
   */
  updataByIdAndIgnoreField(model_name, id, newData, IgnoreField) {
    return new Promise(async function (resolve, reject) {
      try {
        if (!id) return reject('缺少 id 字段')
        let model = await mongo.getModel(model_name)
        // new: true, runValidators: true 验证集合规则
        const options = { new: true, runValidators: true }
        const result = await model.updateOne({ _id: id }, newData, options)
        if (result) {
          // 其他字段有要求,一并置空
          if (!IgnoreField && Array.isArray(IgnoreField) && IgnoreField.length != 0) {
            for (let i = 0; i < IgnoreField.length; i++) {
              const key = IgnoreField[i];
              const value = result[key]
              if (value) { value = null }
            }
          }
          return resolve(result)
        }
        else { reject('更新失败,数据库没有返回数据') }
      } catch (error) {
        reject(error)
      }
    })
  },
  /**
   * > 根据 数据_id 属性 更新指定集合的数据
   * @param {string} model_name :集合名称
   * @param {string} id :指定集合的_id字段值
   * @param {Object} newData :需要更新的数据
   * @returns 成功返回新的数据
   */
  updateById(model_name, id, newData) {
    return new Promise(async function (resolve, reject) {
      try {
        if (!id) return reject('缺少 id 字段')
        let model = await mongo.getModel(model_name)
        // new: true, runValidators: true 验证集合规则
        const options = { new: true, runValidators: true }
        const result = await model.updateOne({ _id: id }, newData, options)
        if (result) { return resolve(result) }
        else { reject('更新失败,数据库没有返回数据') }
      } catch (error) {
        if (error.code == 11000) { reject('更新失败: 不能重复的字段的值,出现重复,请检查参数') }
        else { reject(error) }
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
        if (result.n != 0) { return resolve(`更新成功,变化数据:${result.n}条`) }
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
        if (result.n != 0) { return resolve(`更新成功,变化数据:${result.n}条`) }
        else if (result.ok == 1) { return resolve('操作成功,但数据没有变化') }
        else { return reject(reuslt) }
      } catch (error) {
        reject(error)
      }
    })
  }
}