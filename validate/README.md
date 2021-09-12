# 数据校验模块

## 说明

- 本模块是 GitHub 上  `parameter` 的中文学抄版本， 是在学习 `eggjs` 了解到数据校验的 `egg`版本，然后其中讲到使用了 `parameter` 但是因为种种原因都不符合本人的使用习惯，然后就重新整理给予自己使用。在自己使用的过程中也秉承前人栽树后人乘凉的想法分享出来。
- 好用你笑纳，无用你见笑。
- 本人不对后续更新，持续维护，使用后果做任何形式的承诺。

## 安装
```shell
$ npm install neal-parameter --save
```

#### 

## 用法

### API

`Parameter` Class

- `constructor([options])` - new Class `Parameter` instance
  - `options.translate` - translate function
  - `options.validateRoot` - config whether to validate the passed in value must be a object, default to `false`.
  - `options.convert` - convert primitive params to specific type, default to `false`.
  - `options.widelyUndefined` - convert empty string(`''`), NaN, Null to undefined, this option can make `rule.required` more powerful, default to `false`.__This may change the original input params__.
- `validate(rule, value)` - validate the `value` conforms to `rule`. return an array of errors if break rule.
- `addRule(type, check)` - add custom rules.
  - `type` - rule type, required and must be string type.
  - `check` - check handler. can be a `function` or a `RegExp`.



__Note:当”选项。convert ' enabled，所有内置规则检查原始输入参数并将其转换为规则的默认' convertType '(定义如下)，你也可以在每个规则定义中通过' convertType '选项为特定规则启用该特性



### 例子

```js
var Parameter = require('parameter');

var parameter = new Parameter({
  translate: function() {
    var args = Array.prototype.slice.call(arguments);
    // Assume there have I18n.t method for convert language.
    return I18n.t.apply(I18n, args);
  },
  validateRoot: true, // restrict the being validate value must be a object
});

var data = {
  name: 'foo',
  age: 24,
  gender: 'male'
};

var rule = {
  name: 'string',
  age: 'int',
  gender: ['male', 'female', 'unknown']
};

var errors = parameter.validate(rule, data);
```

#### [复杂例子](example.js)



### 规则

#### 通用规则

- `type` - 属性的类型，每种类型都有自己的验证规则.
- `convertType` - 将输入参数转换为特定类型，支持`int`、`number`、`string`和`boolean`，还支持自定义转换方法的函数
- `required` - 必填项，默认是 true。如果某个字段是可选项需要主动设置为：false
- `default` - 属性的默认值，如果该属性被手动设置为：`required: false` 此参数的值，将作为默认值。
  - 这可能会更改原始输入参数。
- `widelyUndefined` - 覆盖 选项 `options.widelyUndefined`

__注意：您可以将 require 和 type 以符号`?` 结尾，例如：`int?` 或 `string?` 来指定类型和非必需。__



### type：可选值

#### int

type 是 `int`，有两个可选规则

- `max` - 最大值: 值必须小于或等于 `max` 设置的值,  `value`  <= `max`.
- `min` - 最小值: 值必须大于或等于 `min` 设置的值, , `value`  >= `min`.

默认 `convertType` 是 `int`

__注意：默认的 `convertType` 只会在 `options.convert` 在参数的构造函数中设置为 true 时起作用。__

#### integer

 `int`的别名

#### number

type 是 `number`，有两个可选规则， 同`int`

- `max` - 最大值: 值必须小于或等于 `max` 设置的值,  `value`  <= `max`.
- `min` - 最小值: 值必须大于或等于 `min` 设置的值, , `value`  >= `min`.

默认 `convertType` 是 `number`.

#### date

`date` 类型要匹配 `YYYY-MM-DD` 类型的日期字符串

默认 `convertType` 是 `string`。

#### dateTime

`dateTime` 类型要匹配 `YYYY-MM-DD HH:mm:ss` 类型的日期字符串。

默认 `convertType` 是 `string`。

#### datetime

 `dateTime`的别名

#### id

'id'类型要与`/^\d+$/`类型日期字符串匹配。

默认 `convertType` 是 `string`。

#### boolean

匹配 `boolean` 类型值。

默认 `convertType` 是 `boolean`。

#### bool

 `boolean`的别名

#### string

类型为“string”，有四条可选规则

- `allowEmpty`(alias to `empty`) - 允许空字符串，默认为false。 如果 `required` 设置为 false，默认情况下 `allowEmpty` 将设置为 `true`。
- `format` -用于检查字符串格式的`RegExp`（正则表达式）. 
- `max` - 字符串的最大长度
- `min` - 字符串的最小长度
- `trim` - 检查前修剪字符串前后的空格，默认为`false`。

默认 `convertType` 是 `string`。

#### email

要匹配的`email`类型[[RFC 5322]](https://datatracker.ietf.org/doc/html/rfc5322#section-3.4) 电子邮件地址。

- `allowEmpty` -允许空字符串，默认为false。

默认 `convertType` 是 `string`。

#### password

`password` 类型要匹配 `/^$/` 类型的字符串

- `compare` - Compare field to check equal, default null, not check.
- `max` - 密码的最大长度
- `min` - 密码的最小长度，默认为6

默认 `convertType` 是 `string`。

#### url

`url` 类型要匹配 [web url](https://gist.github.com/dperini/729294).

默认 `convertType` 是 `string`。

#### enum

type为' enum '，则需要一个附加规则

- `values` - 值是数组，' value '必须为其中之一。此规则是必填项

#### object

type 是 `object`，则有一个可选规则：

- `rule` - 验证对象属性的对象

#### array

type 是 `array`，则有四个可选规则

- `itemType` - 可声明数组中每个 item 的类型
- `rule` - 验证数组项的对象。 仅适用于`itemType`
- `max` - 数组的最大长度
- `min` - 数组的最小长度

#### 简写的

> 示例：type:int

- `'int'` => `{type: 'int', required: true}`
- `'int?'` => `{type: 'int', required: false }`
- `'integer'` => `{type: 'integer', required: true}`
- `'number'` => `{type: 'number', required: true}`
- `'date'` => `{type: 'date', required: true}`
- `'dateTime'` => `{type: 'dateTime', required: true}`
- `'id'` => `{type: 'id', required: true}`
- `'boolean'` => `{type: 'boolean', required: true}`
- `'bool'` => `{type: 'bool', required: true}`
- `'string'` => `{type: 'string', required: true, allowEmpty: false}`
- `'string?'` => `{type: 'string', required: false, allowEmpty: true}`
- `'email'` => `{type: 'email', required: true, allowEmpty: false, format: EMAIL_RE}`
- `'password'` => `{type: 'password', required: true, allowEmpty: false, format: PASSWORD_RE, min: 6}`
- `'object'` => `{type: 'object', required: true}`
- `'array'` => `{type: 'array', required: true}`
- `[1, 2]` => `{type: 'enum', values: [1, 2]}`
- `/\d+/` => `{type: 'string', required: true, allowEmpty: false, format: /\d+/}`







### `错误` 示例

#### `code: 遗漏字段`

```js
{
  code: 'missing_field',
  field: 'name',
  message: 'required'
}
```

#### `code: invalid`

```js
{
  code: 'invalid',
  field: 'age',
  message: 'should be an integer'
}
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

