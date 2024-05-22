import {AntDesignOutlined, LoadingOutlined, PlusOutlined, UploadOutlined} from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import {useRequest} from '@umijs/max';
import {Alert, Button, GetProp, Input, message, Upload, UploadFile, UploadProps} from 'antd';
import React, {useState} from 'react';
import useStyles from './index.style';
import {getCurrentUserProfile, updateUserProfile, updateUserProfilePicture} from "@/api/userprofile";
import {useModel} from "@@/exports";
import ImgCrop from 'antd-img-crop';
import {Avatar} from 'antd/lib';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const BaseView: React.FC = () => {
  const {styles} = useStyles();
  const {initialState, setInitialState} = useModel('@@initialState');
  const {currentUser, currentUserProfile: currUserProfile} = initialState || {};

  const [loadingAvatar, setLoadingAvatar] = useState(false);
  const [imageUrl, setImageUrl] = useState<string>(currUserProfile?.avatar || "");
  const [invalidAvatarMsg, setInvalidAvatarMsg] = useState<string>("");

  const onChange: UploadProps['onChange'] = (info) => {
    if (info.file.status === 'uploading') {
      setLoadingAvatar(true);
      return;
    }
    if (info.file.status === 'done') {
      getBase64(info.file.originFileObj as FileType, (url) => {
        setLoadingAvatar(false);
        setImageUrl(url);
      });
    }
  };

  const customRequest = async ({ file, onSuccess, onError }: any) => {
    try {
      const formData = new FormData();
      formData.append('avatarFile', file);
      const response = await updateUserProfilePicture({
        avatarFile: file,
      });

      if (response.success) {
        message.success('Upload avatar successfully');
        onSuccess(response.data, file);
      } else {
        message.error('Upload avatar failed');
        onError(response.errMessage);
      }
    } catch (error) {
      message.error('Upload avatar failed');
    }
  };

  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as FileType);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);

    console.log("onPreview", file);
  };

  const beforeUpload = (file: FileType) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      setInvalidAvatarMsg('We only support PNG or JPG pictures!');
      message.error('We only support PNG or JPG pictures!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      setInvalidAvatarMsg('Image must smaller than 2MB!');
      message.error('Image must smaller than 2MB!');
      return false;
    }
    setInvalidAvatarMsg("")
    return isJpgOrPng && isLt2M;
  };

  const {data: currentUserProfile, loading} = useRequest(() => {
    return getCurrentUserProfile();
  });

  const handleFinish = async (values: any) => {
    console.log('handleFinish', values);
    console.log('handleFinish', JSON.stringify(values));
    try {
      const response = await updateUserProfile(values);
      if (response.success) {
        message.success('Profile updated successfully');

        setInitialState((prevState) => ({
          ...prevState,
          currentUserProfile: {
            ...prevState?.currentUserProfile,
            ...values,
          },
        }));
      } else {
        message.error('Failed to update profile');
      }
    } catch (error) {
      message.error('Failed to update profile');
    }
  };

  return (
    <div className={styles.baseView}>
      {loading ? null : (
        <>
          <div className={styles.left}>
            <ProForm
              layout="vertical"
              onFinish={handleFinish}
              submitter={{
                searchConfig: {
                  submitText: 'Save',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                username: currentUser?.username,
                email: currentUser?.email,
                name: currentUserProfile?.name,
                address: currentUserProfile?.address,
                phone: currentUserProfile?.phone,
              }}
              requiredMark={false}
            >

              <ProFormText
                width="md"
                name="username"
                label="Username"
                disabled={true}
              />
              <ProFormText
                width="md"
                name="email"
                label="Email"
                disabled={true}
              />
              <ProFormText
                width="md"
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your name!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="address"
                label="Address"
                rules={[
                  {
                    required: false,
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: false,
                  }
                ]}
              >
              </ProFormText>
            </ProForm>
          </div>
          <div className={styles.right}>
            <div className={styles.avatar_title}>Avatar</div>
            <div>
              {invalidAvatarMsg.length > 0 &&
                <Alert
                  style={{
                    marginBottom: 24,
                    width: 'max-content',
                  }}
                  message={invalidAvatarMsg}
                  type="error"
                  showIcon
                />
              }

              <Avatar
                className={styles.avatar}
                src={imageUrl}
                style={{
                  backgroundColor: '#fde3cf',
                  color: '#d27e0e'
                }}
              >
                <b style={{fontSize: '64px'}}>{initialState?.currentUser?.username?.charAt(0).toUpperCase()}</b>
              </Avatar>
            </div>
            <ImgCrop
              beforeCrop={beforeUpload}
              rotationSlider>
              <Upload
                listType="text"
                showUploadList={false}
                onChange={onChange}
                beforeUpload={beforeUpload}
                onPreview={onPreview}
                customRequest={customRequest}
              >
                <div className={styles.button_view}>
                  <Button className={styles.button_view}>
                    <UploadOutlined/>
                    Change avatar
                  </Button>
                </div>
              </Upload>
            </ImgCrop>
          </div>
        </>
      )}
    </div>
  );
};

export default BaseView;
