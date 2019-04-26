import request from '@/utils/request';
import { stringify } from 'qs';

export async function accountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}
export async function query(params) {
  return request(`/api/user/getUsers?${stringify(params)}`, {
    method: 'POST',
    body: params,
  });
}
export async function add(params) {
  return request('/api/user/add', {
    method: 'POST',
    body: params,
  });
}
export async function update(params) {
  return request('/api/user/update', {
    method: 'POST',
    ...params,
  });
}
export async function remove(params) {
  return request('/api/user/remove', {
    method: 'POST',
    body: params,
  });
}
export async function queryCurrent() {
  return request('/api/user/getCurrentUser');
}
