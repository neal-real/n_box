

```js
module.exports = {
  schema: {
    email: {
      type: String,
      required: true,   // 必填项
      unique:true,       // 唯一索引
      default: new Date().now     // 默认值
    },
     // 首页分类板块
    home_item: {
      type: Object,
      properties: {
        Renew: { type: String },  // 续费
        recommend: { type: String }, //推荐
        share: { type: String },// 分享
        download: { type: String }, // 下载连接
        help: { type: String } // 技术支持
      }
    },
    '变化时间': {
      type: Date,
      default: new Date().now
    },
  }
}

```

