/**
* > 数组元素交换位置
* @param {array} arr 数组
* @param {number} index1 添加项目的位置
* @param {number} index2 删除项目的位置
* index1和index2分别是两个数组的索引值，即是两个要交换元素位置的索引值，如1，5就是数组中下标为1和5的两个元素交换位置
*/
function array_swap(arr, index1, index2) {
  arr[index1] = arr.splice(index2, 1, arr[index1])[0];
  return arr;
}
/**
* > 合并多个数组为一个数组
* @param {Array} args 要合并的数组参数，如：arr1,arr2,arr3...
* @returns {Array} 合并后的结果数组
*/
function array_Concat(args) {
  return [].concat.apply([], arguments);
}

/**
 * > 将一个或多个数组合并为一个字符串
 * @param {String} separator 指定分隔符
 * @param {Array} args 要合并的数组参数(arr1,arr2,arr3...)
 * @returns {String} 合并后的字符串
 */
function array_joinStrings(separator, args) {
  var source = [];
  if (arguments.length > 2) {
    for (var i = 1; i < arguments.length; i++) {
      source = source.concat(arguments[i]);
    }
  } else {
    source = arguments[1];
  }
  return source.join(separator);
}
/**
 * > 去掉array中的重复项
 * @param {Array} arr 需要去重的数组
 * @returns {Array} 去重后的新数组
 */
function array_notRepeat(arr) {
  if (!arr || arr.length <= 1) {
    return arr;
  }
  var _arr = arr.sort(), duplicateIdx = [], idxLength = 0;
  for (var i = 1; i < _arr.length; i++) {
    if (_arr[i] === _arr[i - 1]) {
      idxLength = duplicateIdx.push(i);
    }
  }
  if (idxLength > 0) {
    while (idxLength--) {
      _arr.splice(duplicateIdx[idxLength], 1);
    }
    arr = _arr;
  }
  return arr;
}

/**
 * 在指定数组中删除指定的数据
 * @param {Array} sourceArr 待操作的数组
 * @param {Array} removeArr 需要删除的项
 * @returns {Array} 新的数组
 */
function array_remove(sourceArr, removeArr) {
  if (!sourceArr || !removeArr || removeArr.length === 0) {
    return sourceArr;
  }
  removeArr = this.Unique(removeArr);
  var sourceLen = sourceArr.length,
    removeLen = removeArr.length,
    tempIdx = -1;

  for (var i = 0; i < sourceLen; i++) {
    for (var j = 0; j < removeLen; j++) {
      tempIdx = this.InArray(removeArr[j], sourceArr);
      if (tempIdx >= 0) {
        sourceArr.splice(tempIdx, 1);
        sourceLen = sourceArr.length;
      }
    }
  }
  return sourceArr;
}

/**
  * > 判断指定val是否在数组array中
  * @param {Object} val 需要判断的值
  * @param {Array} array 所在的数组
  * @param {Number} idx 从数组array的idx处开始判断，若未指定，则从整个数组array中判断
  * @returns {Number} val在array中的位置，若不在，则返回-1
  */
function isArray_InArray(val, array, idx) {
  if (!array) return -1;
  var arrLen = array.length;
  idx = idx || 0;
  idx = (idx < 0 || idx > array.length - 1) ? 0 : idx;
  for (; idx < arrLen; idx++) {
    if (array[idx] === val) {
      return idx;
    }
  }
  return -1;
}
module.exports = {
  array_swap,
  array_Concat,
  array_joinStrings,
  array_notRepeat,
  array_remove,
  isArray_InArray,
}