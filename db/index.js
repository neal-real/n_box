const i = require('./init');
const r = require('./CURD/retrieve');
const u = require('./CURD/updata');
const c = require('./CURD/create');
const d = require('./CURD/delete');

// 模型的根目录
var schemaPath = "";

module.exports = {
  // 数据模块的根目录
  setSchemaPath(path) {
    schemaPath = path;
  },
  getSchemaPath() {
    return schemaPath;
  },
  // - 初始化
  async initDatabase(url, options) {
    return await i.initDatabase(url, options);
  },

  // -------- 查询--------------
  /**
   * > 判断是否有符合条件的信息
   * @data:需要的数据 {查询字段:'查询字段的值'}
   * @返回 true 表示存在; false 表示不存在
   */
  async isThisInfoExistNotByError(modelName, rule) {
    return await r.isThisInfoExistNotByError(modelName, rule);
  },
  /**
   * > 判断是否有符合条件的信息
   * @data:需要的数据 {查询字段:'查询字段的值'}
   * @返回: true 表示存在; reject('信息不存在')
   */
  async isThisInfoExist(modelName, rule) {
    return await r.isThisInfoExist(modelName, rule);
  },
  /**
   * > 此用户的密码是否和传入密码一致
   * @user_id: 用户id
   * @password: 用户密码(请提前加密哦)
   * @返回: true 表示一致; false 表示不同
   */
  async comparePasswordSameById(user_id, password) {
    return await r.comparePasswordSameById(user_id, password);
  },
  /**
   * > 通过 id 获取用户信息
   * @返回: { result: true, data: result } 有结果
   * @返回: { result: false, data: null|error } 没有结果
   */
  async getUserInfoById(user_id) {
    return await r.getUserInfoById(user_id);
  },
  /**
   * > 查询指定集合的数据
   * @modelName : 集合名字
   * @rule: 查询数据的条件: rule
   */
  async find(modelName, rule) {
    return await r.find(modelName, rule);
  },
  /**
   * > 查询指定集合的数据
   * @modelName : 集合名字
   * @rule: 查询数据的条件: rule
   * @options: 查询选项: {
   * @   find_size: 50; 一次查询50条数据;默认 20条
   * @   page_No: 4; 查看第几页: 必须传最小值 1
   * @   last_id: 4; 当前页的最后一个数据 id
   * @ }
   */
  async findAndOptions(modelName, rule, options) {
    return await r.findAndOptions(modelName, rule, options);
  },
  /**
   * > 查询集合内的数据,并将指定字段降序或升序
   * @modelName : 集合名字
   * @rule: 查询数据的条件: rule
   * @options: 查询选项: {
   * @   find_size: 50; 一次查询50条数据;默认 20条
   * @   page_No: 4; 查看第几页: 必须传最小值 1
   * @ }
   * @sort: {'字段名':-1} -1 降序, 1升序
   */
  async findAndOptionsToSort(modelName, rule, options, sort) {
    return await r.findAndOptionsToSort(modelName, rule, options, sort);
  },

  /**
  * > 查询指定集合的指定字段中的数据
  * @ modelName : 模型名字
  * @ rule 查询条件
  * @ select 指定字段形式 {'字段1':1, "字段2":1}
  * @ isShow_id 是否显示id字段,默认不显示 布尔值
  */
  async findSelect(modelName, rule, select, isShow_id) {
    return await r.findSelect(modelName, rule, select, isShow_id);
  },

  /**
  * > 查询一条指定集合的指定字段中的数据
  * @ modelName : 模型名字
  * @ rule 查询条件
  * @ select 指定字段形式 {'字段1':1, "字段2":1}
  * @ isShow_id 是否显示id字段,默认不显示 布尔值
  */
  async findOneSelect(modelName, rule, select, isShow_id) {
    return await r.findOneSelect(modelName, rule, select, isShow_id);
  },
  /**
   * > 查询一条数据
     * @ modelName : 模型名字
  * @ 查询数据
   */
  async findOne(modelName, rule) {
    return await r.findOne(modelName, rule);
  },
  /**
    * > 查询指定集合的数据, 分页增加可选项
    * @modelName : 集合名字
    * @rule: 查询数据的条件
    * @sort: {'字段名':-1} -1 降序, 1升序
    */
  async findBySort(modelName, rule, sort) {
    return await r.findBySort(modelName, rule, sort);
  },
  /**
   * > 查询一条数据数据,空信息不通过错误返回
   * @param {string} modelName  :集合名字
   * @param {Object} rule  :查询数据的条件 {_id:id}|{email:email}
   * @returns 成功返回一条数据, null 返回 false
   */
  findOneNullNotError(modelName, rule) {
    return r.findOneNullNotError(modelName, rule);
  },
  // -------- 更新--------------
  /**
    * > 根据 user_id 属性 更新指定集合的数据
    * @ 参数: model_name : 数据库名称
    * @ 参数: data : 需要更新的数据,包含user_id 字段
    * @ 成功返回新的数据,  错误:返回null
    */
  updataByUser_Id(modelName, rule) {
    return u.updataByUser_Id(modelName, rule);
  },
  /**
    * > 根据数据的 _id 属性 更新指定集合的对应数据
    * @ 参数: model_name : 数据库名称
    * @ 参数: id : 集合中一条数据的 _id 字段的值
    * @ 参数: newData : 需要更新的新数据
    * @ 成功返回新的数据
    */
  updateById(modelName, id, newData) {
    return u.updateById(modelName, id, newData);
  },
  /**
    * > 根据条件更新一条指定集合的数据
    * @ 参数: model_name : 集合的名称
    * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
    * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
    */
  async findOneAndUpdate(modelName, rule) {
    return await u.findOneAndUpdate(modelName, rule);
  },

  /**
     * > 根据条件更新符合条件的全部数据
     * @ 参数: model_name : 集合的名称
     * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
     * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
     */
  update(model_name, condition, newData) {
    return u.update(model_name, condition, newData);
  },

  /**
 * > 更新符合条件的一条数据
 * @ 参数: model_name : 集合的名称
 * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
 * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
 */
  updateOne(model_name, condition, newData) {
    return u.updateOne(model_name, condition, newData);
  },
  /**
    * > 追加数据到数组类型的字段,
    * @ 参数: model_name : 集合的名称
    * @ 参数: condition : 查询的条件 例子: {字段名:某个值}
    * @ 参数: newData : 需要更新数据 例子:{字段名:新的值}
    */
  updateOneUsePush(model_name, condition, newData) {
    return u.updateOneUsePush(model_name, condition, newData);
  },

  /**
 * > 删除指定字段中数组内的某个元素
 * @ 参数: model_name : 集合的名称
 * @ 参数: rule : 进行一次条件查询
 * @ 参数: delData : 在查询的结果内删除符合 delData 条件的数据 例子:
 * @ 数组内存字符串: {applist: 'appid123131'} 或
 * @ 数组内存对象: {applist: {id:"2"}}
 */
  updateOneUsePull(model_name, rule, delData) {
    return u.updateOneUsePull(model_name, rule, delData);
  },

  // -------- 创建--------------

  /**
   * > 添加一条数据
   * @name : 集合名称
   * @data : 要添加的数据
   * @返回值: 创建成功的数据, 或者错误信息
   */
  async addData(modelName, rule) {
    return await c.addData(modelName, rule);
  },
  // -------- 删除--------------
  /**
    * @根据指定条件删除对应数据
    * @name : 集合名称
    * @data : 要删除的数据条件
    */
  async delData(name, rule) {
    return await d.delData(name, rule);
  },
  /**
  * @根据数据的_id 值,删除对应数据
  * @name : 集合名称
  * @_id :  对应数据的_id 的值
  */
  delDataById(name, id) {
    return d.delDataById(name, id);
  },
};