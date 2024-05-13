import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Button, Flex, Input, Modal, Pagination, Spin} from 'antd';
import React, {Suspense, useEffect, useState} from 'react';
import {FileAddOutlined, InboxOutlined} from '@ant-design/icons';
import type {UploadProps} from 'antd';
import {message, Upload} from 'antd';
import {sendCreatePresignedUploadUrl, uploadBinaryData} from "@/api/content";

import CardContent from './components/CardContent';

const {Dragger} = Upload;

const Content: React.FC = () => {
  const {selectedProject} = useModel('project')

  const {
    getContentListByPage,
    pageContent,
  } = useModel('content');

  const props: UploadProps = {
    multiple: true,
    beforeUpload: async (file, fileList) => {
      console.log("beforeUpload" + file.name);
      const totalFiles = fileList.length + (pageContent?.data?.length || 0);
      if (totalFiles > 5) {
        message.error("You can only upload a maximum of 5 files.");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    customRequest: async (options: any) => {
      const {onSuccess, onError, file} = options;
      const projectId = selectedProject?.id;
      if (!projectId) {
        message.error("Please select a project first");
        onError(null, file);
        return;
      }

      try {
        const response = await sendCreatePresignedUploadUrl({
          projectId: selectedProject.id,
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
    console.log("onChangePageIndex: " + page + " " + pageSize);
    setPageIndex(page);
    setPageSize(pageSize);
    getContentListByPage(selectedProject?.id as string, page, pageSize)
  }

  useEffect(() => {
    if (selectedProject?.id) {
      console.log("selectedProject.id: " + selectedProject.id);
      getContentListByPage(selectedProject.id, pageIndex, pageSize)
    }
  }, [selectedProject?.id]);

  const handleFormSubmit = (value: string) => {
    console.log(value);
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
              Support for a single upload
            </p>
          </Dragger>
        </Modal>
      </div>

      {pageContent?.data?.length > 0 ? (<Suspense fallback={<Spin tip="Loading..." size="large"/>}>
        <Flex wrap="wrap" gap="large" style={{marginTop: 16}}>
          {pageContent?.data?.map((content, index) => (
            <CardContent content={content} key={index}/>
          ))}
        </Flex>
      </Suspense>) : (
        <Dragger maxCount={5} {...props} style={{width: '100%', height: '100%'}}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined/>
          </p>
          <p className="ant-upload-text">Click or drag file to this area to upload</p>
          <p className="ant-upload-hint">
            Support for a single upload
          </p>
        </Dragger>
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
        hideOnSinglePage
      />

    </PageContainer>
  );
};

export default Content;
