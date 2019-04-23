import { message, notification } from 'antd';
import { get, post } from '../utils/eccomfetch';

export function checkSession() {
  return get('/user/checkSession');
}

export function getUserRelateInfos() {
  return get('/user/getUserRelateInfos');
}

export function logout() {
  return get('/user/logout');
}

export function serverError() {
  message.error('服务器已无法连接，请联系管理员');
}

// 修改密码
export function editPassword(params) {
  return post('/system/editPassword', params);
}

// 气泡弹出框
export function showTip({ type, tip }) {
  notification[type]({
    message: type,
    description: tip,
  });
}
