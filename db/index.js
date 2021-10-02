const i = require("./init");
const r = require("./CURD/retrieve");
const u = require("./CURD/updata");
const c = require("./CURD/create");
const d = require("./CURD/delete");

module.exports = {
  // - 初始化
  initDatabase(url, options) {
    return i.initDatabase(url, options);
  },
  // -------- 创建--------------
  /**
   * > 添加一条数据
   * > 说明: 集合对应的文件会在 n_box 的同级目录 schema 中寻找或在 n_box>db>schema 下寻找
   * @param {string} name : 集合名字;
   * @param {Object} rule :数据
   * @返回值: 创建成功的数据, 或者错误信息
   */
  addData(modelName, rule) {
    return c.addData(modelName, rule);
  },
  // -------- 删除--------------
  /**
   * @根据指定id删除对应数据
   * @param {string} name : 集合名字
   * @param {Object} rule :数据
   * @returns 成功返回全部数据
   */
  delData(name, rule) {
    return c.delData(name, rule);
  },

  // -------- 查询--------------
  /**
   * > 根据条件判断这条数据是否存在
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @rule{Object}:需要的数据 {查询字段:'查询字段的值'} 例如:{_id:id}|{email:email}|{phone:phone}
   * @返回: resolve:true 表示存在; reject 返回错误原因
   */
  isThisDataExist(modelName, rule) {
    return r.isThisDataExist(modelName, rule);
  },
  /**
   * > 根据条件判断这条数据是否不存在;不存在
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @data{Object}:需要的数据 {查询字段:'查询字段的值'} 例如:{_id:id}|{email:email}|{phone:phone}
   * @返回: resolve:true 表示不存在; reject 返回错误原因
   */
  isThisDataNotExist(modelName, rule) {
    return r.isThisDataNotExist(modelName, rule);
  },
  /**
   * > 此用户的密码是否和传入密码一致
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @id: 用户id
   * @password: 用户密码(请提前加密哦)
   * @返回: true 表示一致; false 表示不同
   */
  comparePasswordSameById(modelName, id, password) {
    return r.comparePasswordSameById(modelName, id, password);
  },
  /**
   * >  获取指定信息,并置空敏感字段
   * @param {string} modelName 数据库中保存用户信息的集合名称
   * @param {object} rule
   * @param {Array} 可选,field 需要置空的其他字段名,默认必有 password 字段
   * @returns 返回的用户信息中置空 password 字段
   */
  getUserInfoByRule(modelName, rule, field) {
    return r.getUserInfoByRule(modelName, rule, field);
  },
  /**
   * > 查询指定集合的数据
   * @param {string} modelName :集合名字
   * @param {Object} rule :查询数据的条件 {_id:id}|{email:email}
   * @returns 成功返回全部数据
   */
  find(modelName, rule) {
    return r.find(modelName, rule);
  },
  /**
   * > 查询一条数据数据
   * @param {string} modelName  :集合名字
   * @param {Object} rule  :查询数据的条件 {_id:id}|{email:email}
   * @returns 成功返回一条数据
   */
  findOne(modelName, rule) {
    return r.findOne(modelName, rule);
  },
  /**
   * > 查询指定集合的指定的字段数据
   * @param {string} modelName
   * @param {string} select
   * @param {Boolean} isShow_id : true显示 false 不显示,默认不显示
   * @returns 仅返回指定字段的数据
   */
  findSelect(modelName, select, isShow_id) {
    return r.findSelect(modelName, select, isShow_id);
  },
  /**
   * > 设置分页条件,查询信息
   * @param {string} modelName : 集合名字
   * @param {Object} rule : 查询数据的条件
   * @param {Object} options : 查询选项: {
   * @   find_size: 50; 一次查询50条数据;默认 20条
   * @   last_id{String}: 当前页的最后一个数据 id, 优先级高于 page_No
   * @   page_No{Number}: 查看第几页: 必须传最小值 1,
   * @ }
   * @returns _id 降序的数据
   */
  findByOptions(modelName, rule, options) {
    return r.findByOptions(modelName, rule, options);
  },
  /**
   * > 设置分页条件,查询信息并按照指定字段排序
   * @param {string} modelName : 集合名字
   * @param {Object} rule : 查询数据的条件
   * @param {Object} options {
   * @   find_size{number}: 一次查询指定条数据
   * @   page_No{number}: 指定查询页数,最小值 1
   * @ }
   * @param {Object} sort :指定字段排序 {'字段名':-1} -1 降序, 1升序
   * @returns
   */
  findAndOptionsToSort(modelName, rule, options, sort) {
    return r.findAndOptionsToSort(modelName, rule, options, sort);
  },

  // -------- 更新--------------
  /**
   * > 根据 数据_id 属性 更新指定集合的数据
   * @param {string} model_name  :集合名称
   * @param {string} id :指定集合的_id字段值
   * @param {Object} newData :需要更新的数据
   * @returns 成功返回新的数据
   */
  updateById(model_name, id, newData) {
    return u.updateById(model_name, id, newData);
  },
  /**
   * > 根据 _id 属性 更新指定集合的数据,并在返回数据隐藏指定字段的值
   * @param {string} model_name :集合名称
   * @param {string} id :指定集合的_id字段值
   * @param {Object} newData {字段名:字段值,字段名:字段值,}
   * @param {Array} IgnoreField 需要置空的字段 ['email','password'...]
   * @returns
   */
  updataByIdAndIgnoreField(model_name, id, newData, IgnoreField) {
    return u.updataByIdAndIgnoreField(model_name, id, newData, IgnoreField);
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
   * @ 返回:
   */
  updateOne(model_name, condition, newData) {
    return u.updateOne(model_name, condition, newData);
  },
};
