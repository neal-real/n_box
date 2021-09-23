module.exports = {
  schema: {
    key: {
      type: String,
      required: true,   // 必填项
      unique: true,       // 唯一索引
    },
    // 首页分类板块
    value: {
      type: String,
      required: true,   // 必填项
    },
  }
}