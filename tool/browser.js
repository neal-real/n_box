/**
* & 浏览器
* 
*/

/**
* 判断是否为IE
* @param {int} version（6，7，8，9，10，11） 当指定此参数时，返回判断指定的IE版本结果，否则，则返回是否为IE
* @returns {bool} 判断结果
*/
function IsIE(version) {
  var ie = (!-[1,]);
  if (!version) {
    if (ie) {
      return true;
    }
    return /msie/i.test(g.userAgent) || (g.doc.all && g.doc.addEventListener && window.atob) || (!!g.userAgent.match(/Trident\/7\./));
  }
  var result = false;
  switch (version) {
    case 6:
      result = /msie 6/i.test(g.userAgent);
      break;
    case 7:
      result = /msie 7/i.test(g.userAgent);
      break;
    case 8:
      result = /msie 8/i.test(g.userAgent);
      break;
    case 9:
      result = /msie 9/i.test(g.userAgent);
      break;
    case 10:
      result = (!!g.doc.all && !!g.doc.addEventListener && !!window.atob);
      break;
    case 11:
      result = !!g.userAgent.match(/Trident\/7\./);
      break;
  }
  return result;
}

/**
 * 判断是否为Firefox
 * @returns {bool} 判断结果
 */
function IsFirefox() {
  return g.userAgent.indexOf("Firefox") >= 0;
}

/**
 * 判断是否为Chrome
 * @returns {bool} 判断结果
 */
function IsChrome() {
  return g.userAgent.indexOf("Chrome") >= 0;
}
/**
* 判断是否为Safari
* @returns {bool} 判断结果
*/
function IsSafari() {
  return g.userAgent.indexOf("Safari") >= 0;
}
/**
 * 判断是否为Edge
 * @returns {bool} 判断结果
 */
function IsEdge() {
  return g.userAgent.indexOf("Edge/") >= 0;
}
/**
 * 判断浏览器是否支持html5
 * @returns {bool} 判断结果
 */
function IsSupportHTML5() {
  return !!navigator.geolocation;
}
/**
 * 判断浏览器是否安装了flash
 * @returns {bool} 判断结果
 */
function HasFlash() {
  var obj = null;
  try {
    obj = this.IsIE() ? new ActiveXObject('ShockwaveFlash.ShockwaveFlash') : navigator.plugins['Shockwave Flash'];
  } catch (e) { }
  return !!obj;
}
module.exports = {
  IsIE,
  IsFirefox,
  IsChrome,
  IsSafari,
  IsEdge,
  IsSupportHTML5,
  HasFlash
}
