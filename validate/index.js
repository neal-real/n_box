/**
 * ^ 用于数据校验
 * # 1. 本模块不是异步模式
 * # 2. 时间格式需要增加一些
*/
const n_validate = require('./middleware.js')

module.exports = {

  /**
   * > 数据格式校验 : 不能添加规则文件中没有的字段
   * @参数1 : 规则对象||规则文件,路径+文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
  validateDataFormat(rule, data) {
    return n_validate.validateDataFormat(rule, data)
  },
  /**
   * > 数据格式校验 : 可以添加规则文件中没有的字段,没有添加的字段不做校验
   * @参数1 : 规则对象||规则文件,路径+文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
   validateDataFormatSimpleMode(rule, data) {
    return n_validate.validateDataFormatSimpleMode(rule, data)
  }

}