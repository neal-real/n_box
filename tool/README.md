## 常量加密

- secretKey.js 为了解决常量保存在服务器上,服务器被黑加密信息全部直接暴露的风险,在项目初期将高风险信息,进行加密放入数据库中.
- 在文件中仅留下2个 key 的信息. 在使用的文件中留下功能相关的 key , 在加密文件中留下 99 位密码 key.
- 在使用的时候文件调用放入自己的 key 获得信息,然后直接使用.

### 使用

1. 项目最初 通过加密信息一次性写入信息到数据库 -> `encryptedInformation()`

2. 之后使用,初始话, 重启后从服务器读取数据信息保存到内存中-> `decryptionKey()`

示例

```js
const { encryptedInformation } = require("./app/n_box/tool/secretKey.js");

const smsConfig = {
  secretId: "11231231",
  secretKey: "asdfasfa",
  SmsSdkAppId: "asf131321",
};
const setSms = await encryptedInformation(JSON.stringify(smsConfig), "16位长度密钥");

const smtp = {
  host: "smq.com",
  port: 465,
  secure: true,
  user: "map@map.com",
  pass: "2342",
};
const setSmtp = await encryptedInformation(JSON.stringify(smtp), "16位长度密钥");
console.log(setSmtp)

const TXConfig = {
 secretId{string}: 腾讯云账号中获取
 secretKey{string}: 腾讯云账号中获取
 BucketName{string}: 桶名
 cos_path{string}: 在对象存储中的路径;  示例: '/path'
 Region{string}: 地区固定写法
 StorageClass{string}: 存储方式: 默认标准存储'STANDARD'
}
const setSmtp = await encryptedInformation(JSON.stringify(TXConfig), "16位长度密钥");
```





## 随机字符串

### random-string

###  使用

````js
const str = require('./randomString')
const newStr = str({length: 120})

// 一个带有全部选项的例子,正常情况不需要这样写
var x = randomString({
  length: 8,
  numeric: true,
  letters: true,
  special: false,
  exclude: ['a', 'b', '1']
});
````

### options

#### options.length

- number—结果字符串的长度(默认值:8)

#### options.numeric

- boolean - 字符串是否包含数字(从0-9)(默认值:true)

#### options.letters

- boolean - 字符串是否包含字母(从a-z，小写和大写)(默认值:true)

#### options.special

- boolean - 字符串是否包含下列特殊字符`(!$%^&*()_+|~-= '{}[]:;<>?，./)`(默认:false)

#### options.exclude

- array -移除指定字符
  - removes characters from resulting string *Note: Lowercase letters will not remove uppercase letters*
