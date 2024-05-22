import {request} from '@umijs/max';

export async function login(body: AuthLoginQry, options?: { [key: string]: any }) {
  return request<BaseResponse<AuthLoginCO>>('/api/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  }).then((response) => {
    if (response.success && response.data) {
      localStorage.clear();
      localStorage.setItem('accessToken', response.data.accessToken.value);
    }
    return response;
  });
}

export async function logout(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/auth/logout', {
    method: 'POST',
    ...(options || {}),
  }).finally(() => {
    localStorage.clear();
  });
}
