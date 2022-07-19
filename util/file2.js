/**
* & 本文件处理目录相关事项
*/
const fs = require('fs')
const mkdirp = require('mkdirp')

/**
* > 异步创建目录
* @ 参数 path : 指定路径
* @ 参数 dirName : 目录名称
* @ 返回值 true 创建成功
*/
function mkdir(path, dirName) {
  return new Promise(async (resolve, reject) => {
    try {
      fs.mkdir(path + dirName, function (error) {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      })
    } catch (error) {
      reject(NL_result(205, null, error))
    }
  })
}
/**
* > 同步创建目录
* @ 参数 path : 指定路径
* @ 参数 dirName : 目录名称
*/
function mkdirSync(path, dirName) {
  return fs.mkdirSync(path + dirName, { recursive: true })
}
/**
* > 变更目录名
* @ 参数 path : 指定路径;根目录/  非根目录 /内容/
* @ 参数 oldName : 原来目录名称
* @ 参数 newName : 新目录名称
* @ 返回值: 成功返回 null 否则返回错误
*/
function upDirName(path, oldName, newName) {
  return new Promise(async (resolve, reject) => {
    let lodPath = path + oldName
    let newPath = path + newName
    const ifTrue = await ifThisFileOrDirIsExist(newPath)
    // >存在进行删除操作
    if (ifTrue) {
      reject('同级目录, 文件名不可以重复')
    } else {
      fs.rename(lodPath, newPath, err => {
        if (err) {
          reject(err)
        } else {
          resolve(null)
        }
      })
    }
  })
}
/**
* > 变更目录或文件名
* @ 参数 fullPath : 路径包含原文件名
* @ 参数 oldName : 原来目录或文件名称
* @ 参数 newName : 新目录或文件名称
* @ 返回值: 成功返回 null 否则返回错误
*/
function upDirOrFileNameByFullPath(fullPath, oldName, newName) {
  fullPath = fullPath.replace(new RegExp(oldName + '$'), '')
  return upDirName (fullPath, oldName, newName)
}
/**
* > 删除指定文件或目录
* @ 参数 path : 指定路径
* @ 参数 name : 目录或文件名称
* @ 返回值: 成功返回 null ,否则返回错误原因
*/
function delDirByName(path, name) {
  return new Promise(async (resolve, reject) => {
    let path2 = path + name
    // > 判断文件或目录是否存在
    const ifTrue = await ifThisFileOrDirIsExist(path2)
    // >存在进行删除操作
    if (ifTrue) {
      // >是否文件还是目录
      const result = await isDirOrFile(path, name)
      if (result == 'isDir') {
        // fs.rmdir删除目录
        fs.rmdir(path2, { recursive: true }, function (error) {
          if (error) {
            reject(error)
          } else {
            // null 成功
            resolve(null)
          }
        })
      } else if (result == 'isFile') {
        //fs.unlink删除文件
        fs.unlink(path2, function (error) {
          if (error) {
            reject(error)
          } else {
            // null 成功
            resolve(null)
          }
        })
      } else {
        reject('删除失败')
      }
    } else {
      reject('目录不存在')
    }
  })
}
function delDirByFullPath(fullPath, fileName) {
  fullPath = fullPath.replace(new RegExp(fileName + '$'), '')
  return delDirByName(fullPath, fileName)
}
// > 判断是文件还是文件夹
function isDirOrFile(path, name) {
  return new Promise((resolve, reject) => {
    try {
      const newPath = path + name
      fs.stat(newPath, function (error, stats) {
        if (error) {
          reject(error);
        }
        if (stats.isFile()) {
          resolve('isFile')
        } else if (stats.isDirectory()) {
          resolve('isDir')
        } else {
          resolve(stats)
        }
      })
    } catch (error) {
      reject(NL_result(205, null, error))
    }
  })
}
// >判断文件或文件夹是否存在
/**
* @参数 paht  : 包含文件名或目录的完整路径
* @返回值: 存在为 true, 否则为 false
*/
function ifThisFileOrDirIsExist(path) {
  return new Promise((resolve, reject) => {
    try {
      fs.access(path, (err) => {
        resolve(err ? false : true)
      })
    } catch (error) {
      reject(NL_result(205, null, error))
    }
  })
}

/**
* > 根据指定路径,写入指定数据, 内容是追加模式
* @参数: path 完整路径,不包括文件名
* @参数: fileName 文件名.扩展名
* @参数: data 数据 
* @返回值: 成功为 true
*/
function writeFile(path, fileName, data) {
  return new Promise((resolve, reject) => {
    try {
      // 写入文件,如果文件存在,则追加文件内容
      fs.writeFile(path + fileName, data, { flag: 'a' }, (err) => {
        if (err) {
          // 如果目录不存,创建目录
          if (err.errno == -2) {
            mkdirp(path).then((made) => {
              // made 有值返回的是从哪个目录开始递归创建,则说明创建成功
              if (made) {
                // 回调方法,重新写入文件
                writeFile(path, fileName, data)
              } else {
                reject(err)
              }
            })
          } else {
            reject(false)
          }
        } else {
          resolve(true)
        }
      })
    } catch (error) {
      reject(NL_result(205, null, error))
    }
  })
}
// > 完整路径,包含文件名
function writeFileFullPath(fullPath, fileName, data) {
  fullPath = fullPath.replace(new RegExp(fileName + '$'), '')
  return new Promise((resolve, reject) => {
    try {
      // 写入文件,如果文件存在,则追加文件内容
      fs.writeFile(fullPath + fileName, data, { flag: 'a' }, (err) => {
        if (err) {
          // 如果目录不存,创建目录
          if (err.errno == -2) {
            mkdirp(fullPath).then((made) => {
              // made 有值返回的是从哪个目录开始递归创建,则说明创建成功
              if (made) {
                // 回调方法,重新写入文件
                writeFile(fullPath, fileName, data)
              } else {
                reject(err)
              }
            })
          } else {
            reject(false)
          }
        } else {
          resolve(true)
        }
      })
    } catch (error) {
      reject(error)
    }
  })
}
/**
* > 根据指定路径,写入指定数据, 内容是覆盖模式
* @参数: path 完整路径,不包括文件名
* @参数: fileName 文件名.扩展名
* @参数: data 数据 
* @返回值: 成功为 true
*/
function writeFileNOa(path, fileName, data) {
  return new Promise((resolve, reject) => {
    try {
      // 写入文件,如果文件存在,则追加文件内容
      fs.writeFile(path + fileName, data, (err) => {
        if (err) {
          // 如果目录不存,创建目录
          if (err.errno == -2) {
            mkdirp(path).then((made) => {
              // made 有值返回的是从哪个目录开始递归创建,则说明创建成功
              if (made) {
                // 回调方法,重新写入文件
                writeFile(path, fileName, data)
              } else {
                reject(err)
              }
            })
          } else {
            reject(false)
          }
        } else {
          resolve(true)
        }
      })
    } catch (error) {
      reject(NL_result(205, null, error))
    }
  })
}

/**
* > 根据指定路径,读取 图标文件夹 的文件内容
* @参数: path 完整路径,包括文件名和扩展名
* @返回值: 返回文件数据
*/
function readFileIconInfoObj(path) {
  return new Promise((resolve, reject) => {
    try {
      // 写入文件,如果文件存在,则追加文件内容
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          // 返回图标文字的数组对象
          resolve(data.slice(0, -1))
        }
      })
    } catch (error) {
      console.log(err)
      reject(NL_result(205, null, error))
    }
  })
}
/**
* > 根据指定路径,读取文件内容
* @参数: path 完整路径,包括文件名和扩展名
* @返回值: 返回文件数据
*/
function readFileByPath(path) {
  return new Promise((resolve, reject) => {
    try {
      // 写入文件,如果文件存在,则追加文件内容
      fs.readFile(path, 'utf8', function (err, data) {
        if (err) {
          console.log(err)
          reject(err)
        } else {
          // 返回图标文字的数组对象
          resolve(data)
        }
      })
    } catch (error) {
      console.log(err)
      reject(error)
    }
  })
}

module.exports = {
  mkdir,
  mkdirSync,
  upDirName,
  upDirOrFileNameByFullPath,
  delDirByName,
  delDirByFullPath,
  writeFile,
  writeFileFullPath,
  ifThisFileOrDirIsExist,
  readFileIconInfoObj,
  readFileByPath,
  writeFileNOa
}