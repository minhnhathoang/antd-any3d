import {request} from '@umijs/max';

export async function getCurrentUserProfile(options?: { [key: string]: any }) {
  return request<BaseResponse<UserProfile>>(`/api/user-profiles/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function updateUserProfilePicture(body: any) {
  return request<BaseResponse<any>>(`/api/user-profiles/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: body,
  });
}

export async function updateUserProfile(body: any) {
  return request<BaseResponse<any>>(`/api/user-profiles/me`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    data: body,
  });
}
