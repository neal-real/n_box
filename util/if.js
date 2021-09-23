
/**
* > 判断对象是否是空值
* > undefined,null,length是 0 均是 false
* @value :需要判断的值
* @返回值: null 返回 false ,有值返回 true
*/
function isNothing(value) {
  if (value === undefined) return false
  if (value === null) return false
  if (value.length === 0) return false
  return true
}
/**
 * > 查看对象的真实类型
 * @param {*} obj 
 * @returns 对象字符串
 */
function isType(obj) {
  return Object.prototype.toString.call(obj);
}
// 各种判断
module.exports = {
  isType,
  isNothing
}