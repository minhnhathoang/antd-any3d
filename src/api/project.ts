import {request} from '@umijs/max';

export async function sendCreateProject(body: ProjectAddCmd) {
  return request<BaseResponse<null>>(`/api/projects`, {
    method: 'POST',
    data: body
  });
}

export async function sendUpdateProject(id: string, body: ProjectUpdateCmd) {
  return request<BaseResponse<null>>(`/api/projects/${id}`, {
    method: 'PUT',
    data: body
  });
}

export async function sendDeleteProject(id: string) {
  return request<BaseResponse<any>>(`/api/projects/${id}`, {
    method: 'DELETE'
  });
}

export async function sendGetProjectById(id: string) {
  return request<BaseResponse<any>>(`/api/projects/${id}`, {
    method: 'GET'
  });
}

export async function sendGetProjectListByOwner() {
  return request<BaseResponse<Project[]>>(`/api/projects`, {
    method: 'GET'
  });
}

export async function sendGetProjectList() {
  return request<BaseResponse<Project[]>>(`/api/projects`, {
    method: 'GET'
  });
}

