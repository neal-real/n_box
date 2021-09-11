const n_excel = require('./excel')


module.exports = {

  parseExcel(path) {
    if (!path) {
      throw new Error('路径参数不能为 null')
    }
    return n_excel.parseExcel(path)
  },
  exportExcel(data) {
    if (!data) {
      throw new Error('生成文件时,数据不能为 null')
    }
    return n_excel.exportExcel(data)
  },
}