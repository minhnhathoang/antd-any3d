// @ts-ignore
/* eslint-disable */

class BaseResponse<T> {
  success: boolean;
  errCode: string;
  errMessage: string;
  data?: T;
}

class PageResponse<T> extends BaseResponse<T> {
  success: boolean;
  errCode: string;
  errMessage: string;
  data?: T;
  totalCount: number;
  pageIndex: number;
  pageSize: number;
  empty: boolean;
  totalPages: number;
}

type User = {
  userId: string;
  username: string;
  email: string;
}

type UserProfile = {
  name?: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

type VuforiaKey = {
  id: string;
  projectId: string;
  accessKey: string;
  secretKey: string;
}

type Project = {
  id: string;
  owner: User;
  name: string;
  description: string;
  createdAt: string;
  contentCount: number;
  vuforiaKey: VuforiaKey;
}


type Hologram = {
  id: string;
  contentId: string;
  filename: string;
  size: number;
  url: string;
  contentType: string;
}

type ImageTarget = {
  id: string;
  contentId: string;
  filename: string;
  size: number;
  url: string;
  contentType: string;
  arSDKType: string;
  additionalData?: {}
}

type Content = {
  id: string;
  projectId: string;
  name: string;
  metadata: any;
  hologram: Hologram;
  imageTarget: ImageTarget;
  owner: User;
  createdAt: string;
  lastModifiedAt: string;
}
