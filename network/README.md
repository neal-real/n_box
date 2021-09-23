## 

## 依赖 

```shell
npm i axios
```



## 使用

1. 在index.js 文件中创建连接即可, 其中有示例写法

2. 在 config.js 中写入根路径

3. 在引用处写法

   ```js
   import {signIn} from 'path/api'
   // 或
   import {signIn} from 'path/api/index.js'
   
   const res = await sigin({
     user_name:'abc',
     password: 'password'
   })
   ```

   

