/**
 * ^ 提供数据格式的校验功能 rule
 * #1.数据校验
*/

const Parameter = require('parameter');
const ruleReal = new Parameter({
  validateRoot: true,
  required: true
});
module.exports = {
  /**
   * > 数据格式校验 : 不能添加规则文件中没有的字段
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
  validateDataFormat(rule, data) {
    try {
      if (!data) return '无任何校验数据进入'
      const objRule = require(`./validateDir/${rule}`)
      if (objRule) {
        const error = ruleReal.validate(objRule, data)
        if (error) {
          return error
        } else {
          const array = Object.keys(data)
          for (let i = 0; i < array.length; i++) {
            const key = array[i];
            if (objRule[key] == undefined) {
              return [{ field: '字段越界', message: '不能添加规则之外的字段' }]
            }
          }
        }
      } else {
        return '读取不到规则文件,请检查后在试'
      }
    } catch (error) {
      return error.message
    }
  },
  /**
   * > 数据格式校验 : 可以添加规则文件中没有的字段,没有添加的字段不做校验
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
  validateDataFormatSimpleMode(rule, data) {
    try {
      if (!data) return '无任何校验数据进入'
      const objRule = require(`./validateDir/${rule}`)
      if (objRule) {
        const error = ruleReal.validate(objRule, data)
        return error
      } else {
        return '读取不到规则文件,请检查后在试'
      }
    } catch (error) {
      return error.message
    }
  }
}