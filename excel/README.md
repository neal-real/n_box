## 说明

1. node-xlsx 模块 相对简单,功能性够用
   1. `npm i node-xlsx`
2. ExcelJS 模块 功能丰富,使用相对复杂



## node-xlsx

1. 安装

```shell
npm i node-xlsx
```



2. 引入

```js
const xlsx = require('node-xlsx');
const fs = require('fs');

```

3. 解析

```js
//去 path 路径 解析 Excel 表格
parseExcel(path)

/* 表格解析后的数据样式 示例
每个{} 是表格底部的一个单元,name 是单元名 data 是数据
[
  {
    name: 'Adobe02',
    data: [ [Array], [Array], [Array], [Array], [Array], [Array] ]
  },
  {
    name: 'Sheet1',
    data: [ [Array], [Array], [Array], [Array], [Array], [Array] ]
  }
]
*/
// 然后分析成为 JSON 数据
```



4. JSON 数据转 Excel 表格

```js
// 要求 JSON 数据格式为
// userInfo 是第一个子表的名称, 内部为第一个子表的数据
// userInfo2 是第二个子表的名称, 内部为第二个子表的数据
{
  userInfo:[
    {name:'a', age:12,number:1111},
    {name:'a', age:12,number:1111},
    {name:'a', age:12,number:1111},
    {name:'a', age:12,number:1111},
    2000个条
  ],
    userinfo2:[
      {name:'a', age:12,number:1111},
      {name:'a', age:12,number:1111},
      {name:'a', age:12,number:1111},
      {name:'a', age:12,number:1111},
      2000个条
    ]
}
```



