# n_box
仅仅初始化, 可以使用时,会标注版本:(暂时无法使用Ï)

个人的工具库,提高开发效率
(暂时无法使用Ï)

(暂时无法使用Ï)

(暂时无法使用Ï)





## 发布方法

```shell
# 创建入口文件 index.js
在入口方法导入关键方法或属性
module.exports = consoleFunc
# 查看发布地址是否正确
npm config list  #查看现在下载源是否是"https://registry.npmjs.org/"
# 不是的话，修改发布地址为官方
npm set registry https://registry.npmjs.org/
# 添加 npm 账号信息： 没有的话去 npm 官方注册
npm adduser
用户名：
密码：
邮箱：邮箱必须经过验证，使用注册时的邮箱
# 查询是否登录成功
npm whoami  #返回用户名
# 发布 npm 包
npm publish  
# 在个人信息中的 packages 中可以查看当前包
```

