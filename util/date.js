/**
 * > 返回特定格式的时间
 * @param {Date} date : 时间对象
 * @param {string} DateFormat :年月日的分割字符,默认 /
 * @param {string} timeFormat :时秒分的分割字符, 默认 :
 * @returns 2021/09/11 13:29:01
 */
function formatTime(date, dateFormat, timeFormat) {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  dateFormat = dateFormat ? dateFormat : '/'
  timeFormat = timeFormat ? timeFormat : ':'
  return `${[year, month, day].map(formatNumber).join(dateFormat)} ${[hour, minute, second].map(formatNumber).join(timeFormat)}`
}
// > formatTime 依赖的方法
const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
}

/**
  * > 获得时区名和值
  * @param {*} dateObj 
  * @returns { name: 'GMT', value: '+0800' }
  */
function getZoneNameValue(dateObj) {
  var date = new Date(dateObj);
  date = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  var arr = date.toString().match(/([A-Z]+)([-+]\d+:?\d+)/);
  var obj = {
    'name': arr[1],
    'value': arr[2]
  };
  return obj;
}
/**
 * > 是否闰年
 * @param {number|string} year 
 * @returns 是: true 否: false
 * dayOfTheYear|getDaysOfMonth 依赖此方法
 */
function isLeapYear(year) {
  return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0);
}

/**
 * > 计算一个日期是当年的第几天
 * @param {object|string} date 
 * @returns 数字天数: 200
 */
function dayOfTheYear(date) {
  var obj = new Date(date);
  var year = obj.getFullYear();
  var month = obj.getMonth(); //从0开始
  var days = obj.getDate();
  var daysArr = [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  for (var i = 0; i < month; i++) {
    days += daysArr[i];
  }
  return days;
}

/**
 * > get 某个月的总天数，从1开始 
 * @param {number|string} year 
 * @param {number|string} month 
 * @returns 返回28-31之间的数字
 */
function getDaysOfMonth(year, month) {
  return [31, (isLeapYear(year) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month - 1];
}

/**
 * > 比较时间大小
 * @param {object |string} time1 
 * @param {object |string} time2 
 * @return 1  time1>time2 time1 大: time2 小
 * @return -1 time1<time2  time1 小: time2 大
 * @return 0  time1==time2 
 */
function compareTime(time1, time2) {
  var d1 = time1;
  var d2 = time2;
  if ((typeof d1) === "string") {
    d1 = new Date(Date.parse(d1.replace(/-/g, "/")));
  }
  if ((typeof d2) === "string") {
    d2 = new Date(Date.parse(d2.replace(/-/g, "/")));
  }
  var t1 = d1.getTime();
  var t2 = d2.getTime();
  if (t1 === t2) {
    return 0;
  } else if (t1 > t2) {
    return 1;
  }
  return -1;
}
/**
 * > 获取当前时间 
 * @returns 2021-9-11 15:48:18
 */
function getCurrentTime() {
  var today = new Date();
  var year = today.getFullYear();
  var month = today.getMonth() + 1;
  var day = today.getDate();
  var hours = today.getHours();
  var minutes = today.getMinutes();
  var seconds = today.getSeconds();
  var timeString = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds;
  return timeString;
}


module.exports = {
  formatTime,
  getZoneNameValue,
  isLeapYear,
  dayOfTheYear,
  getDaysOfMonth,
  compareTime,
  getCurrentTime,
}
