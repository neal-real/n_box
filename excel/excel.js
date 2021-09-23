const xlsx = require('node-xlsx');
const fs = require('fs');

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
    return new Promise(async (resolve, reject) => {
      try {
        // 解析 xlsx 文件 返回一个数组, 参数: 时间转换取消
        const workSheets = xlsx.parse(fs.readFileSync(path), { cellDates: true });
        if (!workSheets.length) { throw new Error('表格没有数据') }
        // 1.获取每个子表格的名称和值
        const itemsName = []
        const values = []
        for (let i = 0; i < workSheets.length; i++) {
          const sheetName = workSheets[i].name;
          itemsName.push(sheetName) // 保存名称
          const sheetValues = workSheets[i].data;
          const data = []
          for (let i = 1; i < sheetValues.length; i++) {
            const dataKeys = sheetValues[0];
            const dataValue = sheetValues[i];
            const obj = {}
            for (let k = 0; k < dataKeys.length; k++) {
              const keyText = dataKeys[k];
              const itemValue = dataValue[k];
              // 去除数据中的__V 字段 和_id 字段,引入导入时会生成新的_id
              if (keyText !== '_id' && keyText !== '__v') {
                obj[keyText] = itemValue;
              }
            }
            data.push(obj)
          }
          values.push(data) // 保存值
        }
        const newObj = {}
        for (let i = 0; i < itemsName.length; i++) {
          const key = itemsName[i];
          newObj[key] = values[i]
        }
        resolve(newObj)
      } catch (error) {
        reject(error)
      }
    })
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
    return new Promise(async (resolve, reject) => {
      try {
        // 获得
        const dataKeys = Object.keys(data)
        const xlsxData = []
        // 每个子表循环一次
        for (let i = 0; i < dataKeys.length; i++) {
          // 获取单个子表的名字
          const dataKey = dataKeys[i]
          // 单个子表中对应的数据
          const dataValue = data[dataKey]
          // mongodb 和 普通数据不同,数据在下一级的_doc 中
          const dataValueKeys = dataValue[0]['_doc'] ? dataValue[0]['_doc'] : dataValue[0]
          const itemKeys = Object.keys(dataValueKeys)
          const itemValues = []
          // 表格第一行
          itemValues.push(itemKeys)
          // 第一个循环
          dataValue.forEach(item => {
            item = item['_doc'] ? item['_doc'] : item
            const temp = []
            // 第二个循环
            itemKeys.forEach(key => {
              temp.push(item[key])
            });
            itemValues.push(temp)
          });
          xlsxData.push({
            name: dataKey,
            data: itemValues,
          })
        }
        const xlsxBuffer = xlsx.build(xlsxData)
        fs.writeFileSync(path, xlsxBuffer)
        resolve(null)
      } catch (error) {
        reject(error)
      }
    })
  }
}
