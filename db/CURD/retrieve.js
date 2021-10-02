/**
 * ^ 查询数据库的信息
 * # 1.判断是否有此用户
 * # 2.比较新旧密码是否一致
 * # 3.根据用户名查询用户信息(用户名不区分大小写)
 * # 4.查询指定集合的数据
 * # 5.查询指定集合的指定字段中的数据
 * # 6.查询一条数据数据
 */
const mongo = require("./model.js");

module.exports = {
  /**
   * > 根据条件判断这条数据是否存在
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @data{Object}:需要的数据 {查询字段:'查询字段的值'} 例如:{_id:id}|{email:email}|{phone:phone}
   * @返回: resolve:true 表示存在; reject 返回错误原因
   */
  isThisDataExist(modelName, rule) {
    return new Promise(async (resolve, reject) => {
      try {
        const model = await mongo.getModel(modelName);
        const result = await model.findOne(rule);
        if (result) return resolve(true);
        return reject("没有查询到指定信息");
      } catch (error) {
        return reject(error);
      }
    });
  },
  /**
   * > 根据条件判断这条数据是否不存在;不存在
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @data{Object}:需要的数据 {查询字段:'查询字段的值'} 例如:{_id:id}|{email:email}|{phone:phone}
   * @返回: resolve:true 表示不存在; reject 返回错误原因
   */
  isThisDataNotExist(modelName, rule) {
    return new Promise(async (resolve, reject) => {
      try {
        const model = await mongo.getModel(modelName);
        const result = await model.findOne(rule);
        if (!result) return resolve(true);
        return reject("这条信息存在");
      } catch (error) {
        return reject(error);
      }
    });
  },
  /**
   * > 此用户的密码是否和传入密码一致
   * @modelName{string}: 数据库中保存用户信息的集合名称
   * @id: 用户id
   * @password: 用户密码(请提前加密哦)
   * @返回: true 表示一致; 不一致 通过 reject('新旧密码不一致')
   */
  comparePasswordSameById(modelName, id, password) {
    return new Promise(async (resolve, reject) => {
      try {
        const model = await mongo.getModel(modelName);
        const result = await model.findOne({ _id: id });
        if (result.password === password) return resolve(true);
        return reject("新旧密码不一致");
      } catch (error) {
        reject(error);
      }
    });
  },

  /**
   * >  获取用户信息,并置空敏感字段
   * @param {string} modelName 数据库中保存用户信息的集合名称
   * @param {object} rule
   * @param {Array} 可选,field 需要置空的其他字段名,默认必有 password 字段
   * @returns 返回的用户信息中置空 password 字段
   */
  getUserInfoByRule(modelName, rule, field) {
    return new Promise(async function (resolve, reject) {
      try {
        const model = await mongo.getModel(modelName);
        const result = await model.findOne(rule);
        if (result) {
          // 用户密码过滤
          if (result.password) {
            result.password = null;
          }
          // 其他字段有要求,一并置空
          if (!field && Array.isArray(field) && field.length != 0) {
            for (let i = 0; i < field.length; i++) {
              const key = field[i];
              const value = result[key];
              if (value) {
                value = null;
              }
            }
          }
          resolve(result);
        } else {
          reject("没有查询到对应的用户信息");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 查询指定集合的数据
   * @param {string} modelName :集合名字
   * @param {Object} rule :查询数据的条件 {_id:id}|{email:email}
   * @returns 成功返回全部数据
   */
  find(modelName, rule) {
    return new Promise(async function (resolve, reject) {
      try {
        // 从模型库中查找是否有对象
        let model = await mongo.getModel(modelName);
        const result = await model.find(rule);
        if (result) {
          resolve(result);
        } else {
          reject("没有查询到任何结果");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 查询一条数据数据
   * @param {string} modelName  :集合名字
   * @param {Object} rule  :查询数据的条件 {_id:id}|{email:email}
   * @returns 成功返回一条数据
   */
  findOne(modelName, rule) {
    return new Promise(async function (resolve, reject) {
      // 从模型库中查找是否有对象
      try {
        let model = await mongo.getModel(modelName);
        const result = await model.findOne(rule);
        if (result) return resolve(result);
        reject("没有查询到指定信息");
      } catch (error) {
        reject(error);
      }
    });
  },
  /**
   * > 查询指定集合的指定的字段数据
   * @param {string} modelName
   * @param {string} select
   * @param {Boolean} isShow_id : true显示 false 不显示,默认不显示
   * @returns 仅返回指定字段的数据
   */
  findSelect(modelName, select, isShow_id) {
    return new Promise(async function (resolve, reject) {
      // 从模型库中查找是否有对象
      let model = await mongo.getModel(modelName);
      // 默认不显示id
      const show_id = isShow_id ? {} : { _id: 0 };
      // 选择要查询的字段
      model
        .find({}, show_id)
        .select(select)
        .then((result) => {
          if (result) {
            resolve(result);
          } else {
            reject("没有查询到任何信息");
          }
        })
        .catch((err) => {
          reject(err);
        });
    });
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
    return new Promise(async function (resolve, reject) {
      try {
        if (!(options.find_size && (options.page_No || options.last_id))) {
          return reject("分页查询不满足条件");
        }
        const model = await mongo.getModel(modelName);
        // 获得数据总量
        const count = await model.countDocuments(rule);
        //  查询选项
        let data;
        // 分页查询的方式
        if (options.last_id) {
          data = await model
            .find({ _id: { $lt: options.last_id } })
            .limit(parseInt(options.find_size))
            .sort({ _id: -1 });
        } else {
          data = await model
            .find(rule)
            .skip((options.page_No - 1) * options.find_size)
            .limit(parseInt(options.find_size))
            .sort({ _id: -1 });
        }
        if (data) {
          resolve({
            db_length: count,
            db_pageSize: options.find_size,
            last_id: options.last_id,
            db_No: options.page_No,
            db_data: data,
          });
        } else {
          reject("查询没有结果");
        }
      } catch (error) {
        reject(error);
      }
    });
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
    return new Promise(async function (resolve, reject) {
      try {
        if (!(options.find_size && options.page_No)) {
          return reject("分页查询不满足条件");
        }
        // 从模型库中查找是否有对象
        let model = await mongo.getModel(modelName);
        // 获得数据总量
        const count = await model.countDocuments(rule);
        // 返回数据
        const data = await model
          .find(rule)
          .sort(sort)
          .skip((options.page_No - 1) * options.find_size)
          .limit(parseInt(options.find_size) || 20);
        const result = {
          db_length: count,
          db_pageSize: options.find_size,
          db_No: options.page_No,
          db_data: data,
        };
        if (result) {
          resolve(result);
        } else {
          reject("查询没有结果");
        }
      } catch (error) {
        reject(error);
      }
    });
  },
};
