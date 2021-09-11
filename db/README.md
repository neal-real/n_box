## 数据库 mongoose

## 安装依赖

```shell
npm i mongoose
```



## egg 中使用

1. 在 app.js 引入并初始化

```js
// 引入
const db = require( './app/n_box/db/init')
class AppBootHook {
  async didLoad() {
    // 可以用来加载应用自定义的文件，启动自定义的服务
    const conf = this.app.config.mongoose
    // >连接数据库
    db.initDatabase(conf.url, conf.options)
  }
}

module.exports = AppBootHook;
```

2. 挂载数据库对象到 app 中

```ts
// app/extend/context.ts
const n_db = require('../n_box/db')
module.exports = {
  // 挂载数据库框架
  db: n_db
};


```

3. 使用

```js
// app/service/user.ts
import { Service } from 'egg';
export default class User extends Service {
  public async signUp(ctx: any) {
    try {
      const realData = {
        email: ctx.request.body.email,
        password: ctx.request.body.password
      }
      // 通过 ctx 调用
      const result = await ctx.db.addData('admin', realData);
    } catch (error) {
      throw new Error(error);
    }
  }
}

```

