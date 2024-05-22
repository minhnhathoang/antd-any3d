import React from 'react';
import { ProForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import useStyles from './index.style';
import {changePassword} from "@/api/user";

const SecurityView: React.FC = () => {
  const { styles } = useStyles();

  const handleFinish = async (values: any) => {
    if (values.newPassword !== values.confirmNewPassword) {
      message.error('The new password and confirmation do not match');
      return;
    }

    try {
      const response = await changePassword(values.oldPassword, values.newPassword);
      if (response.success) {
        message.success('Password updated successfully');
      } else {
        message.error(response.errMessage || 'Failed to update password');
      }
    } catch (error) {
      message.error('Failed to update password');
    }
  };

  return (
    <div>
      <ProForm
        layout="vertical"
        onFinish={handleFinish}
        submitter={{
          searchConfig: {
            submitText: 'Change Password',
          },
          render: (_, dom) => dom[1],
        }}
      >
        <ProFormText.Password
          width="md"
          name="oldPassword"
          label="Old Password"
          rules={[
            {
              required: true,
              message: 'Please enter your old password!',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="newPassword"
          label="New Password"
          rules={[
            {
              required: true,
              message: 'Please enter your new password!',
            },
            {
              min: 8,
              message: 'New password must be at least 8 characters long!',
            },
          ]}
        />
        <ProFormText.Password
          width="md"
          name="confirmNewPassword"
          label="Confirm New Password"
          rules={[
            {
              required: true,
              message: 'Please confirm your new password!',
            },
            {
              min: 8,
              message: 'New password must be at least 8 characters long!',
            },
          ]}
        />
      </ProForm>
    </div>
  );
};

export default SecurityView;
