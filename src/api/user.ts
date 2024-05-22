import {request} from '@umijs/max';

export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<BaseResponse<User>>(`/api/users/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function changePassword(oldPassword: string, newPassword: string) {
  return request('/api/users/change-password', {
    method: 'PUT',
    data: {
      oldPassword,
      newPassword,
    },
  });
}
