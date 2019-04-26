import request from '@/utils/request';
import { stringify } from 'qs';

export async function query(params) {
  return request(`/api/identification?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/identification', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function add(params) {
  return request('/api/identification', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function update(params = {}) {
  return request(`/api/identification?${stringify(params.query)}`, {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}
