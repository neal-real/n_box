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

// 解析 xlsx 文件 返回一个数组
const workSheets = xlsx.parse(fs.readFileSync(`${__dirname}/myFile.xlsx`));

/*
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
```

