

## 加密,解密模块

1. 依赖模块

   ```shell
   #crypto node 自带
   #jsonwebtoken
   npm i crypto jsonwebtoken
   ```

   

2. 位置: n_box/crypto



## egg 中使用

1. 挂载

```ts
// 挂载到 app/extend/context.ts
const n_crypto = require('../n_box/crypto/encrypto.js')
module.exports = {
  crypto: n_crypto
};
```

2. 使用

```js
// app/service/user.ts
import { Service } from 'egg';

export default class User extends Service {
  public async signUp(data: any) {
    try {
      // 加密, abc 后可以传入加密字符串 key,可选参数
      const text = this.ctx.crypto.encryptText('abc')
      console.log(text);
    } catch (error) {
      throw new Error(error);
    }
  }
}

```





## 鉴权模块

1. 登录成功生成 token

```js
/* .生成JWT令牌
 第一个参数: 需要保存的数据
 第二个参数: 签名使用的密钥
 注意点: 1. 如果httpOnly: true, 那么前端是无法获取这个cookie
 2. 要在 ctx.body 响应客户端前设置 cookies
*/
const token = ctx.crypto.signByJWT(result.toJSON(), this.config.keys)
ctx.cookies.set('token', token, {
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: false,
  signed: false,
});
ctx.body = ctx.msg(200, "登录成功", result)
```



2. 获取请求,检验 token

- 示例: 在 egg 中

```ts
// app/middleware/auth.ts  中间件获取请求

/*
 ? 中间件说明
 > options: 中间件的配置项，框架会将 app.config[${middlewareName}] 传递进来
 > app: 当前应用 Application 的实例。
*/
module.exports = (options, app) => {
  return async function (ctx, next) {
    // 1.获取需要权限控制的路由地址
    const routes = options.routes;
    // 2.判断当前请求的路由地址是否需要权限控制
    if (ctx.url.match(routes)) {
      // 需要权限控制
      // 3.获取客户端传递过来的JWT令牌
      const token = ctx.cookies.get('token', {
        signed: false,
      });
      // 4.判断客户端有没有传递JWT令牌
      if (token) {
        try {
          // 参数1 token , 参数2 解密 key
          const result = await ctx.crypto.verifyByJWT(token, app.config.keys);
          if (ctx.request.body.user_id) {
            if (result._id !== ctx.request.body.user_id) {
              return ctx.body = ctx.msg(403, 'id失效,请重新登录');
            }
          } else {
            return ctx.body = ctx.msg(403, '登录失效,请重新登录');
          }
          console.log('校验通过');
          await next();
        } catch (e) {
          ctx.body = ctx.msg(400, '没有权限,请重新登录');
        }
      } else {
        ctx.body = ctx.msg(403, '没有T权限,请重新登录');
      }
    } else {
      // 不需要权限控制
      await next();
    }
  }
};

```



