/**
 * ^ 查询数据库的信息
 * # 1.判断是否有此用户
 * # 2.比较新旧密码是否一致
 * # 3.根据用户名查询用户信息(用户名不区分大小写)
 * # 4.查询指定集合的数据
 * # 5.查询指定集合的指定字段中的数据
 * # 6.查询一条数据数据
 */
 const mongo = require('./model.js');

 module.exports = {
   /**
    * > 判断是否有符合条件的信息
    * @data:需要的数据 {查询字段:'查询字段的值'}
    * @返回: true 表示存在; false 表示不存在
    */
   isThisInfoExist(modelName, rule) {
     /*
    {_id:id 值} 或 {name:neal} 或 {phone:手机号}或 {email:邮箱}
    */
     return new Promise(async (resolve, reject) => {
       try {
         const model = await mongo.getModel(modelName);
         const result = await model.findOne(rule);
         if (result) {
           return resolve(true);
         } else {
           return reject('信息不存在');
         }
       } catch (error) {
         return reject(error);
       }
     });
   },
   /**
    * > 判断是否有符合条件的信息
    * @data:需要的数据 {查询字段:'查询字段的值'}
    * @返回: true 表示存在; false 表示不存在
    */
   isThisInfoExistNotByError(modelName, rule) {
     return new Promise(async (resolve, reject) => {
       try {
         const model = await mongo.getModel(modelName);
         const result = await model.findOne(rule);
         if (result) {
           return resolve(true);
         } else {
           return resolve(false);
         }
       } catch (error) {
         return reject(error);
       }
     });
   },
   /**
    * > 此用户的密码是否和传入密码一致
    * @user_id: 用户id
    * @password: 用户密码(请提前加密哦)
    * @返回: true 表示一致; false 表示不同
    */
   comparePasswordSameById(user_id, password) {
     return new Promise(async (resolve, reject) => {
       try {
         const model = await mongo.getModel('user');
         const result = await model.findOne({ _id: user_id });
         if (result.password === password) return resolve(true);
         return resolve(false);
       } catch (error) {
         reject(error);
       }
     });
   },
   /**
   * >  获取用户信息
   */
   getUserInfoById(user_id) {
     return new Promise(async function (resolve, reject) {
       try {
         const model = await mongo.getModel('user');
         const result = await model.findOne({ _id: user_id });
         if (result) {
           result.password = null; // 用户密码过滤
           return resolve({ result: true, data: result });
         }
         return resolve({ result: false, data: null });
       } catch (error) {
         reject({ result: false, data: error });
       }
     });
   },
 
   /**
   * > 查询指定集合的数据, 分页增加可选项
   * @modelName : 集合名字
   * @rule: 查询数据的条件
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
           reject('查询没有结果' + result);
         }
       } catch (error) {
         reject(error);
       }
     });
   },
   /**
   * > 查询指定集合的数据, 分页增加可选项
   * @modelName : 集合名字
   * @rule: 查询数据的条件
   * @sort: {'字段名':-1} -1 降序, 1升序
   */
   findBySort(modelName, rule, sort) {
     return new Promise(async function (resolve, reject) {
       try {
         // 从模型库中查找是否有对象
         let model = await mongo.getModel(modelName);
         const result = await model.find(rule).sort(sort);
         if (result) {
           resolve(result);
         } else {
           reject('查询没有结果' + result);
         }
       } catch (error) {
         reject(error);
       }
     });
   },
   /**
   * > 查询指定集合的数据, 分页增加可选项
   * @modelName : 集合名字
   * @rule: 查询数据的条件
   * @options: 查询选项: {
    * @   find_size: 50; 一次查询50条数据;默认 20条
    * @   page_No: 4; 查看第几页: 必须传最小值 1,
    * @   last_id: 4; 当前页的最后一个数据 id
    * @ }
   */
   findAndOptions(modelName, rule, options) {
     return new Promise(async function (resolve, reject) {
       try {
         // 从模型库中查找是否有对象
         let model = await mongo.getModel(modelName);
         //  查询选项
         let result;
         // 是否分页
         if (options.last_id) {
           const count = await model.countDocuments(rule);
           const data = await model.find({ '_id': { "$lt": options.last_id } })
             .limit(parseInt(options.find_size) || 20)
             .sort({ '_id': -1 });
           result = {
             db_length: count,
             db_pageSize: options.find_size ? options.find_size : 20,
             last_id: options.last_id,
             db_data: data
           };
         }
         else if (options.page_No) {
           // 获得数据总量
           const count = await model.countDocuments(rule);
           // 返回数据
           const data = await model.find(rule)
             .skip((options.page_No - 1) * options.find_size)
             .limit(parseInt(options.find_size) || 20)
             .sort({ '_id': -1 });
           result = {
             db_length: count,
             db_pageSize: options.find_size ? options.find_size : 20,
             db_No: options.page_No,
             db_data: data
           };
         } else {
           result = await model.find(rule).sort({ '_id': -1 });
         }
         if (result) {
           resolve(result);
         } else {
           reject('查询没有结果' + result);
         }
       } catch (error) {
         reject(error);
       }
     });
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
     return new Promise(async function (resolve, reject) {
       try {
         // 从模型库中查找是否有对象
         let model = await mongo.getModel(modelName);
         //  查询选项
 
         // 获得数据总量
         const count = await model.countDocuments(rule);
         // 返回数据
         const data = await model.find(rule)
           .sort(sort)
           .skip((options.page_No - 1) * options.find_size)
           .limit(parseInt(options.find_size) || 20);
         const result = {
           db_length: count,
           db_pageSize: options.find_size ? options.find_size : 20,
           db_No: options.page_No,
           db_data: data
         };
         if (result) {
           resolve(result);
         } else {
           reject('查询没有结果' + result);
         }
       } catch (error) {
         reject(error);
       }
     });
   },
 
   /**
   * > 查询指定集合的指定字段中的数据
   * @ modelName : 模型名字
   * @ rule 查询条件
   * @ select 指定字段形式 {'字段1':1, "字段2":1}
   * @ isShow_id 是否显示id字段,默认不显示 布尔值
   */
   findSelect(modelName, rule, select, isShow_id) {
     return new Promise(async function (resolve, reject) {
       // 从模型库中查找是否有对象
       let model = await mongo.getModel(modelName);
       // 默认不显示id
       const show_id = isShow_id ? { ...select } : { _id: 0, ...select };
       // 选择要查询的字段
       model.find(rule, show_id)
         .then(result => {
           console.log(result);
           resolve(result);
         }).catch(err => {
           reject(err);
         });
     });
   },
   /**
   * > 查询一条指定集合的指定字段中的数据
   * @ modelName : 模型名字
   * @ rule 查询条件
   * @ select 指定字段形式 {'字段1':1, "字段2":1}
   * @ isShow_id 是否显示id字段,默认不显示 布尔值
   */
   findOneSelect(modelName, rule, select, isShow_id) {
     return new Promise(async function (resolve, reject) {
       // 从模型库中查找是否有对象
       let model = await mongo.getModel(modelName);
       // 默认不显示id
       const show_id = isShow_id ? { ...select } : { _id: 0, ...select };
       // 选择要查询的字段
       model.findOne(rule, show_id)
         .then(result => {
           console.log(result);
           resolve(result);
         }).catch(err => {
           reject(err);
         });
     });
   },
   /**
   * > 查询一条数据数据
   * @ modelName : 模型名字
   * @ 查询数据
   */
   findOne(modelName, rule) {
     return new Promise(async function (resolve, reject) {
       // 从模型库中查找是否有对象
       try {
         let model = await mongo.getModel(modelName);
         const result = await model.findOne(rule);
         if (result) return resolve(result);
         reject('没有查询到指定信息');
       } catch (error) {
         reject(error);
       }
     });
   },
   /**
    * > 查询一条数据数据,空信息不通过错误返回
    * @param {string} modelName  :集合名字
    * @param {Object} rule  :查询数据的条件 {_id:id}|{email:email}
    * @returns 成功返回一条数据, null 返回 false
    */
   findOneNullNotError(modelName, rule) {
     return new Promise(async function (resolve, reject) {
       // 从模型库中查找是否有对象
       try {
         let model = await mongo.getModel(modelName);
         const result = await model.findOne(rule);
         if (result) return resolve(result);
         resolve(false);
       } catch (error) {
         reject(error);
       }
     });
   },
 
 };