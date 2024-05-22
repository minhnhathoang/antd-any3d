import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Alert, Button, Flex, Input, Modal, Pagination, Spin} from 'antd';
import React, {Suspense, useEffect, useState} from 'react';
import {FileAddOutlined, InboxOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {sendCreatePresignedUploadUrl, uploadBinaryData} from "@/api/content";

import CardContent from './components/CardContent';
import {AlertProps} from "antd/es/alert/Alert";

const {Dragger} = Upload;

const Content: React.FC = () => {
  const {selectedProject} = useModel('project')

  const {
    getContentListByPage,
    searchContent,
    pageContent,
    setPageContent
  } = useModel('content');

  const [alertProps, setAlertProps] = useState<AlertProps>({type: 'info', message: 'Please upload hologram to create new content.'})

  const props: UploadProps = {
    multiple: true,
    beforeUpload: async (file, fileList) => {
      const projectId = selectedProject?.id;
      if (projectId === null || projectId === undefined) {
        setAlertProps({type: 'warning', message: 'Please select a project to upload content.'})
        return false;
      }
      if (fileList.length > 5) {
        setAlertProps({type: 'warning', message: 'You can only upload 5 files at a time.'})
        return false;
      }
      return true;
    },
    customRequest: async (options: any) => {
      const {onSuccess, onError, file} = options;

      try {
        const projectId = selectedProject?.id;
        if (projectId === null || projectId === undefined) {
          onError(null, file);
          return;
        }
        const response = await sendCreatePresignedUploadUrl({
          projectId: projectId,
          hologramFileName: file.name
        });
        if (response.success) {
          await uploadBinaryData(file, response.data.presignedUrl);
          onSuccess(null, file);
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
    showUploadList: {
      showDownloadIcon: true,
      downloadIcon: 'Download',
      showRemoveIcon: true,
    },
  };

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [pageIndex, setPageIndex] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const showModal = () => {
    setOpen(true);
  };

  const onChangePageIndex = (page: number, pageSize: number) => {
    setPageIndex(page);
    setPageSize(pageSize);
    getContentListByPage(selectedProject?.id as string, page, pageSize)
  }

  const { notifications, addNotification, removeNotification } = useModel('noti');

  useEffect(() => {
    if (selectedProject?.id) {
      getContentListByPage(selectedProject.id, pageIndex, pageSize)
    }
  }, [selectedProject, notifications]);

  useEffect(() => {

  }, [pageContent]);

  useEffect(() => {

  }, [notifications]);

  const handleFormSubmit = (value: string) => {
    searchContent(selectedProject?.id as string, pageIndex, pageSize, value);
  };

  const handleUpdateContent = (updatedContent: any) => {
    setPageContent(prevPageContent => {
      const updatedData = (prevPageContent?.data || []).map(content =>
        {
          if (content.id === updatedContent.id) {
            return updatedContent;
          }
          return content;
        }
      );
      return {
        ...prevPageContent,
        data: updatedData
      };
    });
  };

  return (
    <PageContainer
      content={
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20}}>
          <Button type="primary" onClick={showModal} icon={<FileAddOutlined/>} size="large">
            New Content
          </Button>
          <div style={{flexGrow: 1, marginLeft: 10, display: 'flex', justifyContent: 'center'}}>
            <Input.Search
              placeholder="Search content"
              enterButton="Search"
              size="large"
              onSearch={handleFormSubmit}
              style={{maxWidth: 400, width: '100%'}}
            />
          </div>
        </div>
      }
    >

      <div
        style={{
          borderRadius: 8,
        }}
      >
        <Modal
          title="Upload Hologram to create new Content"
          open={open}
          confirmLoading={confirmLoading}
          footer={null}
          onOk={() => setOpen(false)}
          onCancel={() => setOpen(false)}
        >
          <Dragger maxCount={5} {...props} style={{width: '100%'}}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for multiple uploads
            </p>
          </Dragger>
        </Modal>
      </div>

      {pageContent?.data?.length > 0 ? (<Suspense fallback={<Spin tip="Loading..." size="large"/>}>
        <Flex wrap="wrap" gap="large" style={{marginTop: 16}}>
          {pageContent?.data?.map((content, index) => (
            <CardContent content={content} key={index} onUpdateContent={handleUpdateContent}/>
          ))}
        </Flex>
      </Suspense>) : (
        <>
          <Alert showIcon={true} type={alertProps.type} message={alertProps.message}/>
          <Dragger maxCount={5} {...props} style={{width: '100%', height: '100%', marginTop: 20}}>
            <p className="ant-upload-drag-icon">
              <InboxOutlined/>
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">
              Support for multiple uploads
            </p>
          </Dragger>
        </>
      )}


      <Pagination
        style={{marginTop: 16, textAlign: 'center'}}
        current={pageIndex}
        total={pageContent?.totalCount}
        showSizeChanger={true}
        showQuickJumper={true}
        onChange={(page, pageSize) => onChangePageIndex(page, pageSize)}
        defaultPageSize={5}
        pageSizeOptions={['5', '10', '15', '20']}
      />

    </PageContainer>
  );
};

export default Content;
