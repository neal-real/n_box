## 数据库 mongoose

## 安装依赖

```shell
npm i mongoose
```



## egg 中使用

1. 设置 schema 的目录路径, 使用绝对路径
1. 在 app.js 引入并初始化

```js
// 引入
const db = require( './app/n_box/db/init')
class AppBootHook {
  async didLoad() {
    // > 初始化数据结构的目录: 使用绝对路径
    db.setSchemaPath(`${__dirname}/app/schema/`);
    //>连接数据库
    const conf = {
      url: "mongodb://数据库用户名:数据库用户密码@127.0.0.1:27017/knowmap",
      options: { useNewUrlParser: true, useUnifiedTopology: true }
    }
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

