## egg 中使用

使用

```js
import err = require('../n_box/error/error.js');
module.exports = {
  // 默认成功返回码 200 ,消息为 成功
  msg(status = 200, msg, data = null) {
    if (status !== 200) { msg = err.newError(msg); }
    this.body = { code: status, msg, data };
  },
};

```

