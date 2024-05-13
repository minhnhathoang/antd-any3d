import {request} from "@umijs/max";

type ImageTargetAddCmd = {
  contentId: string;
  arSdkType: "VUFORIA";
  imageFile: string;
}

export async function sendAddImageTargetCmd(cmd: ImageTargetAddCmd) {
  const formData = new FormData();
  formData.append('contentId', cmd.contentId);
  formData.append('arSdkType', cmd.arSdkType);
  formData.append('imageFile', cmd.imageFile);

  return request<BaseResponse<any>>(`/api/image-targets`, {
    method: 'POST',
    data: formData
  });
}
