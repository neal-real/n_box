## 数据校验模块



## 使用前提

#### 依赖

```shell
npm i parameter
```

#### 提供校验文件

1. `/n_box/validate/validateDir` 目录下写入校验文件
2. 在使用时写入文件名(不包含扩展名), 文件自动到 指定目录搜寻规则文件

```js
/*
 ^ 提供图片上传是数据校验
 文件名: image.js
*/

module.exports = {
  user_id: {
    type: 'string',
    trim: true,
    message: '用户 ID 不能为空'
  },
  type: {
    type: 'enum',
    values: ['position', 'home_item'],
    message: '值类型必须二选一'
  },
  home_item: {
    required: false,
    type: 'enum',
    values: ['Renew', 'recommend','share','download','help'],
  },
  position: {
    required: false,
    type: 'enum',
    values: ['home_carousel', 'QRcode','advert_carousel','personal_cover'],
  }
}
```



## 使用

```js
const n_validate = require('../n_box/validate')
// 校验数据, 没有错误则得到 null
const isError = n_validate.validateDataFormat('image', urlObj.fields)
if (isError) throw new Error(`字段: ${isError[0].field}, 错误信息: ${isError[0].message}`);
```



## 提供方法2个

```js
//  本模块不是异步模式
const n_validate = require('./validate.js')

module.exports = {
  /**
   * > 数据格式校验 : 不能添加规则文件中没有的字段
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
  validateDataFormat(rule, data) {
    return n_validate.validateDataFormat(rule, data)
  },
  /**
   * > 数据格式校验 : 可以添加规则文件中没有的字段,没有添加的字段不做校验
   * @参数1 : 规则文件名
   * @参数2 : 需要校验的数据
   * @返回: 错误原因, 正确无返回值
   */
   validateDataFormatSimpleMode(rule, data) {
    return n_validate.validateDataFormatSimpleMode(rule, data)
  }
}
```

