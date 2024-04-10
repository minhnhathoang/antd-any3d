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

export async function getCurrentUser(options?: { [key: string]: any }) {
  return request<BaseResponse<UserCO>>(`/api/users/me`, {
    method: 'GET',
    ...(options || {}),
  });
}

export async function getCurrentUserProfile(options?: { [key: string]: any }) {
  return request<BaseResponse<UserProfileCO>>(`/api/user-profiles/me`, {
    method: 'GET',
    ...(options || {}),
  });
}


/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

/** 获取规则列表 GET /api/rule */
export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

/** 更新规则 PUT /api/rule */
export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'update',
      ...(options || {}),
    }
  });
}

/** 新建规则 POST /api/rule */
export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    data: {
      method: 'post',
      ...(options || {}),
    }
  });
}

/** 删除规则 DELETE /api/rule */
export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'POST',
    data: {
      method: 'delete',
      ...(options || {}),
    }
  });
}
