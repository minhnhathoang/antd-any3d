import {AlipayOutlined, DingdingOutlined, InboxOutlined, TaobaoOutlined} from '@ant-design/icons';
import {Alert, Badge, Col, List, message, Rate, Row, Spin, type UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';

import {Upload} from 'antd';
import {PageContainer} from "@ant-design/pro-components";
import {sendCreatePresignedUploadUrl, sendGetContentById, uploadBinaryData} from "@/api/content";
import {sendAddImageTargetCmd} from "@/api/imagetarget";
import {Canvas} from "@react-three/fiber";
import {EnvironmentColor} from "@/utils/r3fUtils";
import {OrbitControls} from "@react-three/drei";
import {formatBytes} from "@/utils/fileUtils";

const {Dragger} = Upload;

type VuforiaTargetInfo = {
  result_code: string;
  target_record: any;
}

const ImageTargetView: React.FC<{
  content: Content;
}> = ({content}) => {

  const [contentDetail, setContentDetail] = useState<Content>();
  const [vuforiaTargetInfo, setVuforiaTargetInfo] = useState<VuforiaTargetInfo>();
  const [imageTarget, setImageTarget] = useState<ImageTarget | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const getContentById = async (id: string) => {
    setIsLoading(true); // Start loading
    const res = await sendGetContentById(id);
    if (res.success) {
      setContentDetail(res.data);
      if (res.data?.imageTarget !== null) {
        setVuforiaTargetInfo(JSON.parse(res.data.imageTarget.additionalData) as VuforiaTargetInfo);
        console.log(JSON.parse(res.data.imageTarget.additionalData) as VuforiaTargetInfo);
        setImageTarget(res.data.imageTarget);
      }
    }
    setIsLoading(false); // Stop loading
  }


  useEffect(() => {
    getContentById(content.id);
    setImageTarget(content.imageTarget);
  }, []);

  const props: UploadProps = {
    multiple: false,
    beforeUpload: async (file) => {
      console.log("beforeUpload" + file.name);
      if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
        message.error('File must be JPG or PNG!');
        return Upload.LIST_IGNORE;
      }
      if (file.size > 2 * 1024 * 1024) {
        message.error('File must smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async (options: any) => {
      const {onSuccess, onError, file} = options;
      try {
        const response = await sendAddImageTargetCmd({
          contentId: content.id,
          arSdkType: "VUFORIA",
          imageFile: options.file
        });
        if (response.success) {
          onSuccess(null, file);
          await getContentById(content.id);
        }
      } catch (error) {
        console.error(error);
        onError(null, file);
      }
    },
    onChange(info) {
      const {status} = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  return (
    <>
      <Spin spinning={isLoading} tip="Loading...">
        <PageContainer
          title="Vuforia Engine"
          content={<Alert message={
            <span>
            Refer to the{' '}
              <a href="https://developer.vuforia.com/library/objects/image-targets" target="_blank"
                 rel="noopener noreferrer">
              Image Target API Overview
            </a>
              {' '}for more information.
          </span>} type="info" showIcon/>
          }
        >

          <div style={{display: "flex"}}>
            <div style={{
              width: "50%",
              display: 'flex',
            }}>
              {imageTarget === null && (
                <Dragger {...props} style={{width: '100%'}}>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined/>
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    .jpg or .png (max file 2mb)
                  </p>
                </Dragger>
              )}

              {imageTarget !== null && (
                <img
                  src={imageTarget.url}
                  style={{width: "70%", maxHeight: "100%", objectFit: "contain"}}
                />
              )}
            </div>

            {imageTarget !== null && (
              <div style={{width: "70%", overflow: "hidden"}}>
                <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
                  <Col span={8}><b>Vuforia Target ID</b></Col>
                  <Col span={16}>{imageTarget.id}</Col>
                </Row>

                <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
                  <Col span={8}><b>Status</b></Col>
                  <Col span={16}>{vuforiaTargetInfo?.target_record?.active_flag ?
                    <Badge size="default" status="success" text="Active"/> :
                    <Badge status="processing" text="Process"/>}</Col>
                </Row>

                <Row gutter={[12, 48]} style={{marginBottom: "12px"}}>
                  <Col span={8}><b>Augmentable</b></Col>
                  <Col span={16}> <Rate allowHalf disabled
                                        value={vuforiaTargetInfo?.target_record.tracking_rating}/></Col>
                </Row>
              </div>
            )}
          </div>

        </PageContainer>
      </Spin>
    </>
  );
};

export default ImageTargetView;
