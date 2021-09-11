const xlsx = require('node-xlsx');
const fs = require('fs');
const n_crypto = require('../crypto');
const { time } = require('console');

module.exports = {
  // 旧数据解析
  oldDataParsing(workSheets) {
    // 用户信息
    const userinfo = [];
    // 订单详情
    const orderDetails = [];
    // 积分详情
    const integrals = [];
    let Adobe_ID = {}

    for (let i = 0; i < workSheets.length; i++) {
      const sheet = workSheets[i];
      if (!sheet) break
      const sheetData = sheet.data
      for (let i = 1; i < sheetData.length; i++) {
        // 获取到所有的 key
        const cloumTitles = sheetData[0];
        // 获取到所有的 Values
        const cloumValues = sheetData[i];
        const user = {}
        const orderDetail = {}
        const integral = {}

        for (let j = 0; j < cloumTitles.length; j++) {
          let keyText = cloumTitles[j]
          let value = cloumValues[j]

          // 1. 过滤有效时间(月)
          if (keyText === '有效时间(月)') { continue }
          /*
          2. Adobe ID user和积分在没有的情况下需要一次, 订单详情每次都需要
          */
          else if (keyText === 'Adobe ID') {
            // 订单详情增加 Adobe ID 字段
            orderDetail[keyText] = value
            // 判断 Adobe_ID 是否有过记录
            if (!Adobe_ID[value]) {
              // 添加 Adobe_ID并初始化积分为0
              user[keyText] = value
              user['积分'] = 0
              // 积分集合初始化数据
              integral[keyText] = value
              integral['积分变化'] = '+0'
              integral['变化时间'] = new Date() + 8
              integral['剩余积分'] = 0
              integral['变化原因'] = '积分初始化'

              // 记录 adobe_id
              Adobe_ID[value] = true
            }
          }/*
            1. 当前计划+1的情况进行处理
            2. 用户信息添加字典
            3. 订单详情变更字段名称并添加值
          */
          else if (keyText == '当前计划') {
            // 判断是否有 +1 ,有则进行积分变更,
            if (value.indexOf('+') != -1) {
              const strArray = value.split('+')
              // 订单详情,增加商品名称字段
              orderDetail['商品名称'] = strArray[0]
              // user的当前计划 修改为数组 0
              user[keyText] = strArray[0]
              // 积分 数组1 *12
              const number = parseInt(strArray[1])
              integral['积分变化'] = '+' + number * 12
              integral['剩余积分'] = number * 12
              user['积分'] = number * 12
            } else {
              // 订单详情,增加商品名称属性
              orderDetail['商品名称'] = value
              // user的当前计划 修改为数组 0
              user[keyText] = value;
            }

          }
          // 添加订单详情
          else if (
            keyText === '订单编号'
            || keyText === '金额'
            || keyText === '充值时间'
            || keyText === '数量') {
            if (keyText === '充值时间') {
              let time = new Date(value)
              time.setHours(time.getHours() + 10)
              value = time
            }
            orderDetail[keyText] = value
          }
          else {
            if (keyText === '微信' && typeof (value) == 'string') {
              value = value.trim()
              value = n_crypto.cipherTextByAES(value, 'OiLFWVbFZdrhdtHm')
            }
            if (keyText === '到期时间' && value instanceof Date) {
              let time = new Date(value)
              time.setHours(time.getHours() + 10)
              value = time
            } else if (keyText === '到期时间' && !(value instanceof Date)) {
              time = new Date('1970-1-1')
              time.setHours(time.getHours() + 10)
              value = time
            }
            user[keyText] = value;
          }
        }

        if (orderDetail['Adobe ID']) {
          orderDetails.push(orderDetail)
        }
        if (integral['Adobe ID']) {
          integrals.push(integral)
        }
        // 没有 Adobe Id 的信息不予添加
        if (user['Adobe ID']) {
          userinfo.push(user)
        }
      }
    }
    return {
      // 用户信息
      userInfo: userinfo,
      // 订单详情
      orderDetails: orderDetails,
      // 积分
      integrals: integrals
    }
  },
  // 新数据解析
  newDataParsing(workSheets) {
    const userInfoData = workSheets[0].data
    const orderDetailsData = workSheets[1].data
    const integralsData = workSheets[2].data
    const db_UserInfo = []
    const db_OrderDetails = []
    const db_Integrals = []
    //解析用户详情
    for (let i = 1; i < userInfoData.length; i++) {
      const keys = userInfoData[0];
      const values = userInfoData[i];
      const user = {}
      for (let j = 0; j < keys.length; j++) {
        const keyText = keys[j];
        let value = values[j];
        if (keyText === '微信' && typeof (value) == 'string') {
          value = value.trim()
          value = n_crypto.cipherTextByAES(value, 'OiLFWVbFZdrhdtHm')
        }

        if (keyText !== '_id' && keyText !== '__v') {
          user[keyText] = value;
        }
      }
      db_UserInfo.push(user)
    }
    // 解析订单详情
    for (let i = 1; i < orderDetailsData.length; i++) {
      const keys = orderDetailsData[0];
      const values = orderDetailsData[i];
      const user = {}
      for (let j = 0; j < keys.length; j++) {
        const keyText = keys[j];
        const value = values[j];
        if (keyText !== '_id' && keyText !== '__v') {
          user[keyText] = value;
        }
      }
      db_OrderDetails.push(user)
    }
    // 解析 积分详情
    for (let i = 1; i < integralsData.length; i++) {
      const keys = integralsData[0];
      const values = integralsData[i];
      const user = {}
      for (let j = 0; j < keys.length; j++) {
        const keyText = keys[j];
        const value = values[j];
        if (keyText !== '_id' && keyText !== '__v') {
          user[keyText] = value;
        }
      }
      db_Integrals.push(user)
    }
    return {
      // 用户信息
      userInfo: db_UserInfo,
      // 订单详情
      orderDetails: db_OrderDetails,
      // 积分
      integrals: db_Integrals
    }
  },
  /**
   * > 解析 Excel 表格
   * @path: 表格存放位置
   * @返回 数组格式的 JSON 数据
   */
  parseExcel(path) {
    // 解析 xlsx 文件 返回一个数组, 参数: 时间转换取消
    const workSheets = xlsx.parse(fs.readFileSync(path), { cellDates: true });
    if (!workSheets.length) { throw new Error('表格没有数据') }
    // 判断新旧数据 分开解析

    if (workSheets[0].name == 'userInfo'
      && workSheets[1].name == 'orderDetails'
      && workSheets[2].name == 'integrals') {
      return this.newDataParsing(workSheets)
    } else {
      return this.oldDataParsing(workSheets)
    }
  },

  /**
   * > 导出数据到 Excel 表格 
   * #
   */
  exportExcel(data) {
    const userInfo = data.userInfo
    const orderDetails = data.orderDetails
    const integrals = data.integrals
    // 获得全部的 key
    const userInfoKeys = Object.keys(userInfo[0]['_doc'])
    const orderDetailsKeys = Object.keys(orderDetails[0]['_doc'])
    const integralsKeys = Object.keys(integrals[0]['_doc'])
    // 创建存放数据的容器
    const userInfoData = []
    const orderDetailsData = []
    const integralsData = []
    // 第一行
    userInfoData.push(userInfoKeys)
    orderDetailsData.push(orderDetailsKeys)
    integralsData.push(integralsKeys)

    userInfo.forEach(item => {
      item = item['_doc']
      const temp = []
      userInfoKeys.forEach(key => {
        if (key === '微信' && item[key] != undefined && item['微信'].length >= 20) {
          // 微信号解密
          item[key] = n_crypto.clearTextByAES(item[key], 'OiLFWVbFZdrhdtHm')
        }
        temp.push(item[key])
      });
      userInfoData.push(temp)
    });
    orderDetails.forEach(item => {
      item = item['_doc']
      const temp = []
      orderDetailsKeys.forEach(key => {

        temp.push(item[key])

      });
      orderDetailsData.push(temp)
    });
    integrals.forEach(item => {
      item = item['_doc']
      const temp = []
      integralsKeys.forEach(key => {

        temp.push(item[key])

      });
      integralsData.push(temp)
    });

    return xlsx.build([
      { name: 'userInfo', data: userInfoData },
      { name: 'orderDetails', data: orderDetailsData },
      { name: 'integrals', data: integralsData }
    ])
  }
}
