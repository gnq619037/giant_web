import { notification } from 'antd';
import { get, post, deleteData } from '../utils/eccomfetch';

export function saveAd(params) {
  return post('/system/saveAd', params);
}

export function getAd() {
  return get('/system/getAd');
}

export function showTip({ type, tip }) {
  notification[type]({
    message: type,
    description: tip,
  });
}

export function deleteStrategy(params) {
  return deleteData('/system/deleteStrategy', params);
}

export function getallMenus() {
  return get('/system/getMenus');
}

export function createOrUpdateStrategy(params) {
  return post('/system/createOrUpdateStrategy', params);
}

export function createOrUpdateGroup(params) {
  return post('/system/createOrUpdateGroup', params);
}

export function deleteGroup(params) {
  return deleteData('/system/deleteGroup', params);
}

export function getAllStrategys() {
  return get('/system/getAllStrategys');
}

export function updateGroupStrategy(params) {
  return post('/system/updateGroupStrategy', params);
}

export function getAllGroupUsers(params) {
  return post('/system/getAllGroupUsers', params);
}

export function updateGroupUser(params) {
  return post('/system/updateGroupUser', params);
}

export function getGroupById(params) {
  return post('/system/getGroupById', params);
}

export function getGroupUsers(params) {
  return post('/system/getGroupUsers', params);
}

export function deleteUser(params) {
  return deleteData('/system/deleteUser', params);
}

export function createOrUpdateUser(params) {
  return post('/system/createOrUpdateUser', params);
}

export function updateUserStrategy(params) {
  return post('/system/updateUserStrategy', params);
}

export function getAllGroups() {
  return get('/system/getAllGroups');
}

export function updateUserGroup(params) {
  return post('/system/updateUserGroup', params);
}

export function getUserById(params) {
  return post('/system/getUserById', params);
}

export function getOverview() {
  return get('/system/getOverview');
}

// 修改密码
export function editPassword(params) {
  return post('/system/editPassword', params);
}

export function getLdapTree(params) {
  return post('/ad/getLdapTree', params);
}

export function updateLdapInfos(params) {
  return post('/ad/updateLdapInfos', params);
}
