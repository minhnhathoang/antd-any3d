
type ContentUpdateCmd = {
  name?: string;
  metadata?: string;
}

type VuforiaAddKeyCmd = {
  projectId: string;
  accessKey: string;
  secretKey: string;
}

type VuforiaUpdateKeyCmd = {
  id: string;
  accessKey: string;
  secretKey: string;
}
