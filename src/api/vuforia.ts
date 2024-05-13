import {request} from '@umijs/max';


export async function sendAddVuforiaKeyCmd(cmd: VuforiaAddKeyCmd) {
  return request<BaseResponse<any>>(`/api/sdk/vuforia/key`, {
    method: 'POST',
    data: cmd,
  });
}

export async function sendUpdateVuforiaKeyCmd(cmd: VuforiaUpdateKeyCmd) {
  return request<BaseResponse<any>>(`/api/sdk/vuforia/key`, {
    method: 'PUT',
    data: cmd,
  });
}
