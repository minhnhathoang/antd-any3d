import {request} from '@umijs/max';

export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<BaseResponse<UserCO>>(`/api/users/me`, {
    method: 'GET',
    ...(options || {}),
  });
}
