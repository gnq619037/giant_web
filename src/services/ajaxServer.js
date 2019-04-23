import { postJs, post, get } from '../utils/eccomfetch';

export function getData(url, params) {
  return postJs(url, params);
}

// 用于选择框获取远程数据
export function getOptions(url, params) {
  return post(url, params);
}

// 树形控件获取远程数据
export function getTreeNodes(url, params) {
  return postJs(url, params);
}

// get test
export function getTempData(url) {
  return get(url);
}

// 级联选择获取远程数据 type：get/post
export function getCasacderData(url, params, type) {
  if (type === 'get') {
    return get(url);
  } else {
    return post(url, params);
  }
}
