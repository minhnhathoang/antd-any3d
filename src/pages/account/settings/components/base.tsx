import { UploadOutlined } from '@ant-design/icons';
import {
  ProForm,
  ProFormDependency,
  ProFormFieldSet,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import { useRequest } from '@umijs/max';
import { Button, Input, message, Upload } from 'antd';
import React from 'react';
import { queryCity, queryCurrent, queryProvince } from '../service';
import useStyles from './index.style';

const validatorPhone = (rule: any, value: string[], callback: (message?: string) => void) => {
  if (!value[0]) {
    callback('Please input your area code!');
  }
  if (!value[1]) {
    callback('Please input your phone number!');
  }
  callback();
};

const BaseView: React.FC = () => {
  const { styles } = useStyles();
  const AvatarView = ({ avatar }: { avatar: string }) => (
    <>
      <div className={styles.avatar_title}>头像</div>
      <div className={styles.avatar}>
        <img src={avatar} alt="avatar" />
      </div>
      <Upload showUploadList={false}>
        <div className={styles.button_view}>
          <Button>
            <UploadOutlined />
            Change avatar
          </Button>
        </div>
      </Upload>
    </>
  );
  const { data: currentUser, loading } = useRequest(() => {
    return queryCurrent();
  });
  const getAvatarURL = () => {
    if (currentUser) {
      if (currentUser.avatar) {
        return currentUser.avatar;
      }
      const url = 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png';
      return url;
    }
    return '';
  };
  const handleFinish = async () => {
    message.success('Update basic information successfully');
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
                  submitText: 'Update basic information',
                },
                render: (_, dom) => dom[1],
              }}
              initialValues={{
                ...currentUser,
                phone: currentUser?.phone.split('-'),
              }}
              hideRequiredMark
            >
              <ProFormText
                width="md"
                name="username"
                label="Username"
                readonly
              />
              <ProFormText
                width="md"
                name="email"
                label="Email"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your email!',
                  },
                ]}
              />
              <ProFormText
                width="md"
                name="name"
                label="Name"
                rules={[
                  {
                    required: true,
                    message: 'Please enter your nickname!',
                  },
                ]}
              />
              <ProFormTextArea
                name="about"
                label="About"
                placeholder="Say somthing"
              />
              <ProFormSelect
                width="sm"
                name="country"
                label="Country/Region"
                options={[
                  {
                    label: 'vn',
                    value: 'Vietnam',
                  },
                ]}
              />

              <ProForm.Group title="Province and City" size={8}>
                <ProFormSelect
                  rules={[
                    {
                      required: false,
                    },
                  ]}
                  width="sm"
                  fieldProps={{
                    labelInValue: true,
                  }}
                  name="province"
                  className={styles.item}
                  request={async () => {
                    return queryProvince().then(({ data }) => {
                      return data.map((item) => {
                        return {
                          label: item.name,
                          value: item.id,
                        };
                      });
                    });
                  }}
                />
                <ProFormDependency name={['province']}>
                  {({ province }) => {
                    return (
                      <ProFormSelect
                        params={{
                          key: province?.value,
                        }}
                        name="city"
                        width="sm"
                        disabled={!province}
                        className={styles.item}
                        request={async () => {
                          if (!province?.key) {
                            return [];
                          }
                          return queryCity(province.key || '').then(({ data }) => {
                            return data.map((item) => {
                              return {
                                label: item.name,
                                value: item.id,
                              };
                            });
                          });
                        }}
                      />
                    );
                  }}
                </ProFormDependency>
              </ProForm.Group>
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
              <ProFormFieldSet
                name="phone"
                label="Phone"
                rules={[
                  {
                    required: false,
                  },
                  {
                    validator: validatorPhone,
                  },
                ]}
              >
                <Input className={styles.area_code} />
                <Input className={styles.phone_number} />
              </ProFormFieldSet>
            </ProForm>
          </div>
          <div className={styles.right}>
            <AvatarView avatar={getAvatarURL()} />
          </div>
        </>
      )}
    </div>
  );
};
export default BaseView;
