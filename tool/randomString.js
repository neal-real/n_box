const numbers = "0123456789",
  letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
  specials = "!$%^&*()_+|~-=`{}[]:;<>?,./";

function _defaults(opts) {
  opts || (opts = {});
  return {
    length: opts.length || 8,
    numeric: typeof opts.numeric === "boolean" ? opts.numeric : true,
    letters: typeof opts.letters === "boolean" ? opts.letters : true,
    special: typeof opts.special === "boolean" ? opts.special : false,
    exclude: Array.isArray(opts.exclude) ? opts.exclude : [],
  };
}

function _buildChars(opts) {
  let chars = "";
  if (opts.numeric) {
    chars += numbers;
  }
  if (opts.letters) {
    chars += letters;
  }
  if (opts.special) {
    chars += specials;
  }
  for (let i = 0; i <= opts.exclude.length; i++) {
    chars = chars.replace(opts.exclude[i], "");
  }
  return chars;
}
/**
 * > 返回一个随机字符串
 * @param {*} opts {
 * @    length: 8, 字符串长度,默认8个字符串
 * @    numeric: true, 字符串是否包含数字,默认是
 * @    letters: true, 字符串是否包含大小写全部字母,默认是
 * @    special: false,字符串是否包含特殊字符串,默认 否
 * @    exclude: ['a', 'b', '1'] 移除指定字符
 * @ }
 * @returns 随机字符串
 */
module.exports = function randomString(opts) {
  opts = _defaults(opts);
  let i,
    rn,
    rnd = "",
    len = opts.length,
    exclude = opts.exclude,
    randomChars = _buildChars(opts);
  for (i = 1; i <= len; i++) {
    rnd += randomChars.substring((rn = Math.floor(Math.random() * randomChars.length)), rn + 1);
  }
  return rnd;
};
