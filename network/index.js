const Network = require('./network.js');
// 示例
export const signIn = (data) => Network.get('/signIn', data);
export const signOut = (data) => Network.post('/auth/signOut', data);
// 不使用根路径配置
export const payCombo = (data) => Network.post('https://api.mch.weixin.qq.com/pay/unifiedorder', data);