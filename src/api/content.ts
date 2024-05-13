import {request, useRequest} from '@umijs/max';

type ContentCreatePresignedUploadUrlCmd = {
  projectId: string;
  hologramFileName: string;
}

export async function sendCreatePresignedUploadUrl(cmd: ContentCreatePresignedUploadUrlCmd) {
  return request<BaseResponse<any>>(`/api/contents/create-presigned-url-upload-hologram`, {
    method: 'POST',
    data: cmd
  });
}

export async function uploadBinaryData(file: any, uploadPresignedUrl: string) {
  let contentType = file.type;
  if (!contentType) {
    if (file.name.endsWith('.glb')) {
      contentType = 'model/gltf-binary';
    } else if (file.name.endsWith('.gltf')) {
      contentType = 'model/gltf+json';
    }
  }
  return request<any>(uploadPresignedUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': contentType,
      'X-Amz-Meta-Is-Presigned-Url': "",
    },
    data: file,
  });
}


export async function sendUpdateContent(id: string, body: ContentUpdateCmd) {
  return request<BaseResponse<null>>(`/api/contents/${id}`, {
    method: 'PUT',
    data: body
  });
}

export async function sendDeleteContent(id: string) {
  return request<BaseResponse<any>>(`/api/contents/${id}`, {
    method: 'DELETE'
  });
}

export async function sendGetContentById(id: string) {
  return request<BaseResponse<any>>(`/api/contents/${id}`, {
    method: 'GET'
  });
}

export async function sendGetContentListByPageQry(projectId: string, pageIndex: number, pageSize: number) {
  return request<PageResponse<Content[]>>(`/api/contents`, {
    method: 'GET',
    params: {
      projectId,
      pageIndex,
      pageSize
    }
  });
}
