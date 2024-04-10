import {history, Link, useRequest} from '@umijs/max';
import {Button, Col, Divider, Form, Input, message, Popover, Progress, Row, Select, Space} from 'antd';
import type {Store} from 'antd/es/form/interface';
import React, {FC} from 'react';
import {useEffect, useState} from 'react';
import type {StateType} from './service';
import {fakeRegister} from './service';
import useStyles from './style.style';
import {useIntl} from "@@/exports";
import TitleLogo from "@/components/TitleLogo";
import {ProForm} from "@ant-design/pro-components";
import {Footer} from "@/components";
import {LockOutlined, UserOutlined, MailOutlined} from '@ant-design/icons';

const FormItem = ProForm.Item;
const {Option} = Select;

const passwordProgressMap: {
  ok: 'success';
  pass: 'normal';
  poor: 'exception';
} = {
  ok: 'success',
  pass: 'normal',
  poor: 'exception',
};
const Register: FC = () => {
  const intl = useIntl();
  const {styles} = useStyles();
  const [count, setCount]: [number, any] = useState(0);
  const [open, setVisible]: [boolean, any] = useState(false);
  const [prefix, setPrefix]: [string, any] = useState('86');
  const [popover, setPopover]: [boolean, any] = useState(false);
  const confirmDirty = false;
  let interval: number | undefined;

  const passwordStatusMap = {
    ok: (
      <div className={styles.success}>
        <span>Strength: Strong</span>
      </div>
    ),
    pass: (
      <div className={styles.warning}>
        <span>Strength: Medium</span>
      </div>
    ),
    poor: (
      <div className={styles.error}>
        <span>Strength: Too Short</span>
      </div>
    ),
  };

  const [form] = Form.useForm();
  useEffect(
    () => () => {
      clearInterval(interval);
    },
    [interval],
  );
  const onGetCaptcha = () => {
    let counts = 59;
    setCount(counts);
    interval = window.setInterval(() => {
      counts -= 1;
      setCount(counts);
      if (counts === 0) {
        clearInterval(interval);
      }
    }, 1000);
  };
  const getPasswordStatus = () => {
    const value = form.getFieldValue('password');
    if (value && value.length > 9) {
      return 'ok';
    }
    if (value && value.length > 5) {
      return 'pass';
    }
    return 'poor';
  };
  const {loading: submitting, run: register} = useRequest<{
    data: StateType;
  }>(fakeRegister, {
    manual: true,
    onSuccess: (data, params) => {
      if (data.status === 'ok') {
        message.success('Registration Successful!');
        history.push({
          pathname: `/user/register-result?account=${params[0].email}`,
        });
      }
    },
  });
  const onFinish = (values: Store) => {
    register(values);
  };
  const checkConfirm = (_: any, value: string) => {
    const promise = Promise;
    if (value && value !== form.getFieldValue('password')) {
      return promise.reject('The two passwords that you entered do not match!');
    }
    return promise.resolve();
  };
  const checkPassword = (_: any, value: string) => {
    const promise = Promise;
    // Empty case
    if (!value) {
      setVisible(!!value);
      return promise.reject('Please input your password!');
    }
    // Non-empty case
    if (!open) {
      setVisible(!!value);
    }
    setPopover(!popover);
    if (value.length < 6) {
      return promise.reject('');
    }
    if (value && confirmDirty) {
      form.validateFields(['confirm']);
    }
    return promise.resolve();
  };
  const changePrefix = (value: string) => {
    setPrefix(value);
  };
  const renderPasswordProgress = () => {
    const value = form.getFieldValue('password');
    const passwordStatus = getPasswordStatus();
    return value && value.length ? (
      <div className={styles[`progress-${passwordStatus}`]}>
        <Progress
          status={passwordProgressMap[passwordStatus]}
          strokeWidth={6}
          percent={value.length * 10 > 100 ? 100 : value.length * 10}
          showInfo={false}
        />
      </div>
    ) : null;
  };
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    }}>

      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <div style={{
          textAlign: 'center'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            lineHeight: '44px',
          }}>
            <span style={{
              width: '44px',
              height: '44px',
              marginInlineEnd: '16px',
              verticalAlign: 'top',

            }}><img
              style={{
                width: '100%'
              }}
              alt="logo" src="/logo.svg"/></span>
            <TitleLogo/>
          </div>
          <div style={{
            marginBlockStart: '12px',
            marginBlockEnd: '40px',
            fontSize: '14px',
          }}>{intl.formatMessage({id: 'pages.layouts.userLayout.title'})}</div>
        </div>

        <div style={{textAlign: 'center', marginBottom: '20px'}}>
          <h2>Create a new account</h2>
        </div>

        <ProForm form={form}
                 name="register"
                 style={{
                   width: '328px',
                   minWidth: '280px',
                   maxWidth: '75vw',
                   margin: '0 auto',
                   backgroundImage: 'inherit'
                 }}
                 onFinish={onFinish}
                 submitter={{
                   resetButtonProps: {
                     style: {
                       width: '30%'
                     },
                   },
                   submitButtonProps: {
                     style: {
                       width: '70%'
                     },
                   },

                   render: (props, doms) => {
                     console.log(props);
                     return [
                       <Button
                         key="rest"
                         onClick={() => props.form?.resetFields()}
                         size={'large'}
                         style={{width: '30%', marginRight: '10px'}}
                       >
                         Reset
                       </Button>,
                       <Button
                         key="submit"
                         onClick={() => props.form?.submit?.()}
                         type="primary"
                         size={'large'}
                         style={{width: '70%'}}
                       >
                         Submit
                       </Button>,
                     ];
                   },
                 }}
        >
          <FormItem
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input username!',
              }
            ]}
          >
            <Input size="large" placeholder="Username" prefix={<UserOutlined/>}/>
          </FormItem>

          <FormItem
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
              {
                type: 'email',
                message: 'The input is not valid email!',
              },
            ]}
          >
            <Input size="large" placeholder="Email" prefix={<MailOutlined />} />
          </FormItem>

          <Popover
            getPopupContainer={(node) => {
              if (node && node.parentNode) {
                return node.parentNode as HTMLElement;
              }
              return node;
            }}
            content={
              open && (
                <div
                  style={{
                    padding: '4px 0',
                  }}
                >
                  {passwordStatusMap[getPasswordStatus()]}
                  {renderPasswordProgress()}
                  <div
                    style={{
                      marginTop: 10,
                    }}
                  >
                    <span>Please enter at least 6 characters. Please do not use easily guessed passwords.</span>
                  </div>
                </div>
              )
            }
            overlayStyle={{
              width: 240,
            }}
            placement="right"
            open={open}
          >
            <FormItem
              name="password"
              className={
                form.getFieldValue('password') &&
                form.getFieldValue('password').length > 0 &&
                styles.password
              }
              rules={[
                {
                  validator: checkPassword,
                },
              ]}
            >
              <Input size="large" type="password" placeholder="Password" prefix={<LockOutlined />}/>
            </FormItem>
          </Popover>

          <FormItem
            name="confirm"
            rules={[
              {
                required: true,
                message: 'Please confirm your password!',
              },
              {
                validator: checkConfirm,
              },
            ]}
          >
            <Input size="large" type="password" placeholder="Confirm Password" prefix={<LockOutlined />}/>
          </FormItem>
        </ProForm>

        <FormItem style={{textAlign: 'center', marginTop: '20px'}}>
          <Link to="/auth/login">
            <span>Already have an account?</span>
          </Link>
        </FormItem>

      </div>
      <Footer/>
    </div>
  );
};
export default Register;
