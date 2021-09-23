/**
* & 文件说明: 通过 Node 对文件进行各种管理
*/
const fs = require('fs')
const node_path = require('path')

/**
 * - < **************************************************************** >-
 * ------------------- 查询文件状态集合 -----------------------
 * - < **************************************************************** >-
*/
/**
* > 获取文件类型
* @path: 必填参数: 完整路径,包含文件名
* @name: 可选参数: 完整路径中有文件名可以省略.
* @返回值: 
        文件夹返回 (string)dir;
        文件返回 (string)file
        都不是返回文件状态
* @注意点: path 的结尾需要有路径分隔符 例如: /
*/
function whatCanBeFoundInThisPath(path, name) {
  return new Promise(async (resolve, reject) => {
    try {
      if (name) path = path + name
      // 判断文件类型
      fs.stat(path, (error, stats) => {
        if (error) return reject(NL_result(209, null, error))
        if (stats.isFile()) return resolve(NL_result(200, 'file', null))
        else if (stats.isDirectory()) return resolve(NL_result(200, 'dir', null))
        else resolve(NL_result(202, stats, null))
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}
/**
* > 是否是文件
* @path: 必填参数: 完整路径,包含文件名
* @name: 可选参数: 完整路径中有文件名可以省略.
* @返回值: 是返回 true ,否则 false
*/
function isFile(path, name) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await whatCanBeFoundInThisPath(name ? path + name : path)
      if ('file' == result.msg) return resolve(true)
      return reject(false)
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}
/**
* > 是否是文件夹
* @path: 必填参数: 完整路径,包含文件名
* @name: 可选参数: 完整路径中有文件名可以省略.
* @返回值: 是返回 true ,否则 false
*/
function isDir(path, name) {
  return new Promise(async (resolve, reject) => {
    try {
      let result = await whatCanBeFoundInThisPath(name ? path + name : path)
      if ('dir' == result.msg) return resolve(true)
      return reject(false)
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}
// >判断文件或文件夹是否存在
/**
* @path: 必填参数: 完整路径,包含文件名
* @name: 可选参数: 完整路径中有文件名可以省略.
* @返回值: 存在为 true, 否则为 false
*/
function ifDoesThisFileExist(path, name) {
  return new Promise((resolve, reject) => {
    try {
      if (name) path = path + name
      fs.access(path, (err) => {
        return resolve(err ? NL_result(200, false, null) : NL_result(200, true, null))
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}


/**
 * - < **************************************************************** >-
 * ------------------- 读取文件状态集合 -----------------------
 * - < **************************************************************** >-
*/

/**
* > 根据指定路径,读取文件内容
* @path: 必填参数: 完整路径,包含文件名和扩展名
* @name: 可选参数: 完整路径中有文件名可以省略.
* @返回值: 返回文件数据
* @注意点: path 的结尾需要有路径分隔符 例如: /
*/
function readFileByPath(path, name) {
  return new Promise((resolve, reject) => {
    try {
      if (name) path = path + name
      fs.readFile(path, 'utf8', function (error, data) {
        if (error) {
          if (error.errno == -21) return reject(NL_result(209, null, '对目录非法操作,请检查参数是否正确'))
          if (error.errno == -2) return reject(NL_result(209, null, '没有这样的文件或目录. 可能未添加扩展名'))
          return reject(NL_result(209, null, '文件读取失败,请检查参数是否正确'))
        }
        else return resolve(NL_result(200, data, null))
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}

/**
* > 根据指定路径,读取文件内容
* @path: 必填参数: 完整路径
* @返回值(array): 返回目录下全部的文件和目录名
*/
// /根据指定路径,读取文件内容
function readDirByPath(path) {
  return new Promise((resolve, reject) => {
    try {
      fs.readdir(path, function (error, data) {
        if (error) {
          if (error.errno == -21) return reject(NL_result(209, null, '对目录非法操作, 请检查参数是否正确'))
          if (error.errno == -2) return reject(NL_result(209, null, '没有这样的目录, 请检查参数是否正确'))
          return reject(NL_result(209, null, '文件读取失败,请检查参数是否正确'))
        }
        else return resolve(NL_result(200, data, null))
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}


/**
 * - < **************************************************************** >-
 * ------------------- 目录相关 -----------------------
 * - < **************************************************************** >-
*/
/**
* > 异步创建目录
* @path: 必填参数: 完整路径,包含目录名称
* @dirName: 可选参数: 目录名称
* @ 返回值 true 创建成功
* @注意点: 目录名和路径分开写的情况下, path 的结尾需要有路径分隔符 例如: /
*/
function mkdir(path, dirName) {
  return new Promise(async (resolve, reject) => {
    try {
      let fullPath = dirName ? path + dirName : path
      fs.mkdir(fullPath, { recursive: true }, function (error) {
        if (error) {
          if (error.errno = -17) return reject(NL_result(209, null, '目录已经存在'));
          return reject(NL_result(209, null, '目录创建失败'));
        } else {
          return resolve(NL_result(200, true, null));
        }
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}

/**
* > 删除指定文件或目录
* @ 参数 path : 指定路径
* @ 参数 name : 目录或文件名称
* @ 返回值: 成功返回 true ,否则返回错误原因
*/
function delDirOrFileByName(path, name) {
  return new Promise(async (resolve, reject) => {
    try {
      name ? path + name : path
      // > 判断文件或目录是否存在
      const ifTrue = await ifDoesThisFileExist(path)
      // > 不存在直接报错
      if (!ifTrue.msg) return reject(NL_result(209, null, '你要删除的资源, 不存在.'))
      // > 判断文件还是目录
      const result = await whatCanBeFoundInThisPath(path)
      if (result.msg == 'dir') {
        // fs.rmdir删除目录
        fs.rmdir(path, { recursive: true }, function (error) {
          if (error) {
            if (error.errno == -2) return reject(NL_result(209, null, '删除的目录不存在'))
            return reject(NL_result(209, null, error))
          }
          return resolve(NL_result(200, true, null))
        })
      } else if (result.msg == 'file') {
        fs.unlink(path, function (error) {
          if (error) {
            if (error.errno == -2) return reject(NL_result(209, null, '删除的文件不存在'))
            return reject(NL_result(209, null, error))
          }
          return resolve(NL_result(200, true, null))
        })
      } else {
        return reject(NL_result(209, null, '删除失败'))
      }
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}

/**
 * - < **************************************************************** >-
 * ------------------- 写入文件 -----------------------
 * - < **************************************************************** >-
*/

/**
* > 根据指定路径,写入指定数据,目录不存在则自动创建目录
* @data: 必填参数(string|Buffer): 需要写入的数据
* @path: 必填参数: 完整路径,包含文件名和扩展名
* @fileName: 可选参数: 完整路径中有文件名可以省略.
* @isAdditional: 可选参数: 默认是追加内容,覆盖模式(传入 false)
* @返回值: 成功为 true
*/
function writeFile(data, path, fileName, isAdditional = true) {
  return new Promise(async (resolve, reject) => {
    try {
      let options = isAdditional ? { encoding: 'utf-8', flag: 'a' } : { encoding: 'utf-8' }
      // 写入文件,如果文件存在,则追加文件内容
      let fullPath = fileName ? path + fileName : path
      fs.writeFile(fullPath, data, options, async (error) => {
        if (error) {
          // 如果目录不存,则创建目录
          if (error.errno == -2) {
            // 判断是否文件名,有的情况去除文件名
            let fullPath = fileName ? path : node_path.dirname(path)
            let result = await mkdir(fullPath)
            // 目录创建成功,重新写入
            if (result.msg == true) writeFile(path, fileName, data)
            else return reject(NL_result(209, null, '写入失败,原因是目录创建失败'));
          }
          else if (error.errno == -30) return reject(NL_result(209, null, '写入失败, 没有写入权限'));
          else { return reject(NL_result(209, null, '写入失败')) }
        }
        else { return resolve(NL_result(200, true, null)) }
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}



/**
 * - < **************************************************************** >-
 * ------------------- 大文件操作 -----------------------
 * - < **************************************************************** >-
*/

/**
* > 拷贝数据
* @ readPath: 读取文件的位置
* @ writePath: 写入文件的目标位置
* @ 返回值: 开始复制,返回 true 否则返回错误
*/
function copyData(readPath, writePath) {
  return new Promise(async (resolve, reject) => {
    try {
      // 创建一个读取流
      let readStream = fs.createReadStream(readPath);
      // 创建一个写入流
      let writeStream = fs.createWriteStream(writePath);
      // 利用读取流的管道方法来快速的实现文件拷贝
      await readStream.pipe(writeStream);
      return resolve(NL_result(200, true, null))
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}
/**
 * - < **************************************************************** >-
 * ------------------- 变更目录名 -----------------------
 * - < **************************************************************** >-
*/


/**
* > 变更目录名
* @ 参数 lodPath : 原始目录名
* @ 参数 newPath : 新的目录名和新的位置
* @ 返回值: 成功返回 true 否则返回错误
*/
function upDirOrFileName(lodPath, newPath) {
  return new Promise(async (resolve, reject) => {
    try {
      // 排查在同级目录已经有同名文件夹或文件名
      const ifTrue = await ifDoesThisFileExist(newPath)
      if (ifTrue.msg) return reject(NL_result(209, null, '文件名不可以重复'))
      // 没有同名的情况,进行名称变更
      fs.rename(lodPath, newPath, error => {
        if (error) return reject(NL_result(209, null, error))
        return resolve(NL_result(200, true, null))
      })
    } catch (error) { return reject(NL_result(205, null, error)) }
  })
}








module.exports = {
  whatCanBeFoundInThisPath,
  isFile,
  isDir,
  ifDoesThisFileExist,
  readFileByPath,
  readDirByPath,
  mkdir,
  writeFile,
  upDirOrFileName,
  delDirOrFileByName,
  copyData
}