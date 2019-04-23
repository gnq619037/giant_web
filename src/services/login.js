import { post } from '../utils/eccomfetch';

export function login(params) {
  return post('/user/login', params);
}
