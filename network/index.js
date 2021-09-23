
import Network from './network';
// 示例
export const signIn = (data) => Network.get('/signIn', data);
export const signOut = (data) => Network.post('/auth/signOut', data);