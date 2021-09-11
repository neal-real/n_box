const n_file = require('./file')
const n_if = require('./if')
const n_array = require('./arrar')
const n_date = require('./date')

module.exports = {

  // > 判断对象的类型
  isType(obj) {
    return n_if.isType(obj);
  },

  /**
   * > 数据流转文件
   * @param {*} stream 数据流
   * @param {*} path 想要保存的位置
   * @returns 成功返回保存路径, 错误给予错误原因
   */
  streamToFile(stream, path) {
    return n_file.streamToFile(stream, path);
  },
  /**
    * 数组元素交换位置
    * @param {array} arr 数组
    * @param {number} index1 添加项目的位置
    * @param {number} index2 删除项目的位置
    * index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
    */
  swapArray(arr, index1, index2) {
    return n_array.swapArray(arr, index1, index2)
  },
  /**
   * 格式化时间
   * @param {*} date 时间
   * @returns 返回时间格式: 2021/09/11 13:29:01
   */
  formatTime(date) {
    return n_date.formatTime(date)
  }
}