const fs = require('fs')

// 关于文件的处理
module.exports = {
  /**
   * > 数据流转成文件
   * @param {*} stream  文件的数据流
   * @param {*} saveFilePath 存放的位置; 完整写法: path/文件名.扩展名
   * @returns 成功返回保存路径, 错误给予错误原因
   */
  streamToFile(stream, saveFilePath) {
    return new Promise((res, rej) => {
      const ws = fs.createWriteStream(saveFilePath);
      stream.pipe(ws).on('finish', () => {
        res(saveFilePath);
      });
      ws.on('error', err => {
        rej(err);
      });
    });
  }
}