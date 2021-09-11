const i = require('./init')
const r = require('./CURD/retrieve')
const u = require('./CURD/updata')
const c = require('./CURD/create')
const d = require('./CURD/delete')


module.exports = {

  // - 初始化
  async initDatabase(url, options) {
    return await i.initDatabase(url, options);
  },

  // -------- 查询--------------
  /**
   * > 判断是否有此用户
   * @返回: true 表示存在; false 表示不存在
   */
  async isThisUserExist(rule) {
    return await r.isThisUserExist(rule);
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
   * @rule: 查询数据的条件
   */
  async find(modelName, rule) {
    return await r.find(modelName, rule);
  },
  /**
   * > 查询指定集合的指定字段中的数据
   * @ modelName : 模型名字
  * @ select 查询字段名,字符串形式
  * @ isShow_id 是否显示id字段,默认不显示 布尔值
   */
  async findSelect(modelName, select, isShow_id) {
    return await r.findSelect(modelName, select, isShow_id);
  },
  /**
   * > 查询一条数据数据
     * @ modelName : 模型名字
  * @ 查询数据
   */
  async findOne(modelName, rule) {
    return await r.findOne(modelName, rule);
  },
  // -------- 更新--------------
  /**
    * > 根据 user_id 属性 更新指定集合的数据
    * @ 参数: model_name : 数据库名称
    * @ 参数: data : 需要更新的数据,包含user_id 字段
    * @ 成功返回新的数据,  错误:返回null
    */
  async updataById(modelName, rule) {
    return await u.updataById(modelName, rule);
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
   * > 通过邮箱或手机号,强制更新密码
   * @model: 数据库模型对象
   * @data: {account :{email:值,...}|{phone:值,...},password:密码}
   * @返回: 用户信息(取出密码后的)
   */
  async updatePasswordByPhoneOrEmail(modelName, rule) {
    return await u.updatePasswordByPhoneOrEmail(modelName, rule);
  },

  // > 更新用户信息
  async updateUserInfo(modelName, rule) {
    return await u.updateUserInfo(modelName, rule);
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
* @根据指定id删除对应数据
* @name : 集合名称
* @data : 要删除的数据条件
*/
  async delData(name, rule) {
    return await c.delData(name, rule);
  },
}