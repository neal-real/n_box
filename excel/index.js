const n_excel = require('./excel')


module.exports = {
  /**
  * > 解析 Excel 表格转为 JSON 格式的数据
  * @path: 获取表格的位置
  * @返回 {
  * @ 第一个子表名字: 第一个子表的数据,
  * @ 第二个子表名字: 第二个子表的数据,
  * @ ......
  * @ }
  */
  parseExcel(path) {
    if (!path) {
      throw new Error('路径参数不能为 null')
    }
    return n_excel.parseExcel(path)
  },
  /**
   * > 导出数据到 Excel 表格 
   * @param {Object} data {
   * @ key:value,
   * @ 子表格名:子表数据,
   * @ ....
   * @ }
   * @path: 表格存放位置
   * @returns 
   */
  exportExcel(data, path) {
    if (!data || !path) {
      throw new Error('生成文件时,数据和保存路径不能为 null')
    }
    return n_excel.exportExcel(data, path)
  },
}