import {Footer} from '@/components';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import {FormattedMessage, history, SelectLang, useIntl, useModel} from '@umijs/max';
import {Alert, message, Tabs} from 'antd';
import React, { useState} from 'react';
import {flushSync} from 'react-dom';
import {createStyles} from 'antd-style';
import TitleLogo from "@/components/TitleLogo";
import {Link} from "@@/exports";
import {login} from "@/services/ant-design-pro/api";

const useStyles = createStyles(({token}) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      overflow: 'auto',
      backgroundImage:
        "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
      backgroundSize: '100% 100%',
    },
  };
});

const Lang = () => {
  const {styles} = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang/>}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({content}) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [type, setType] = useState<string>('account');
  const [status, setStatus] = useState<boolean>(true);
  const {initialState, setInitialState} = useModel('@@initialState');
  const {styles} = useStyles();
  const intl = useIntl();

  const fetchCurrentUser = async () => {
    const currentUser = await initialState?.fetchCurrentUser?.();
    if (currentUser) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: currentUser
        }));
      });
      console.log('Fetched current user:', currentUser);
    }
  };

  const fetchCurrentUserProfile = async () => {
    const currentUserProfile = await initialState?.fetchCurrentUserProfile?.();
    if (currentUserProfile) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUserProfile: currentUserProfile
        }));
      });
      console.log('Fetched current user profile:', currentUserProfile);
    }
  };

  const handleSubmit = async (values: AuthLoginQry) => {
    try {
      const msg = await login({...values});
      if (msg.success) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: 'Login success!',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchCurrentUser();
        await fetchCurrentUserProfile();
        const urlParams = new URL(window.location.href).searchParams;
        history.push(urlParams.get('redirect') || '/');
        return;
      }
    } catch (error: any) {
      setStatus(false);
    }
  };

  return (
    <div className={styles.container}>
      <Lang/>
      <div
        style={{
          flex: '1',
          padding: '32px 0',
        }}
      >
        <LoginForm
          contentStyle={{
            minWidth: 280,
            maxWidth: '75vw',
          }}
          logo={<img alt="logo" src="/logo.svg"/>}
          title={<TitleLogo/>}
          subTitle={intl.formatMessage({id: 'pages.layouts.userLayout.title'})}
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values as AuthLoginQry)
          }}
          actions={
            <ProFormText style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <p style={{display: 'inline-block', marginRight: '10px'}}>
                Don&apos;t have an account yet?
              </p>
              <Link
                to="/auth/register"
                style={{display: 'inline-block', textAlign: 'center'}}
              >
                <span>Sign up</span>
              </Link>
            </ProFormText>
          }
        >
          <Tabs
            activeKey={type}
            onChange={setType}
            centered
            items={[
              {
                key: 'account',
                label: intl.formatMessage({
                  id: 'pages.login.accountLogin.tab',
                  defaultMessage: '账户密码登录',
                }),
              }
            ]}
          />
          {status === false && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: 'Login failed, please check your username and password.',
              })}
            />
          )}

          {type === 'account' && (
            <>
              <ProFormText
                name="username"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="password"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined/>,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                ]}
              />
            </>
          )}

          <div
            style={{
              marginBottom: 24,
            }}
          >
            <ProFormCheckbox noStyle name="autoLogin">
              <FormattedMessage id="pages.login.rememberMe" defaultMessage="自动登录"/>
            </ProFormCheckbox>
            <a
              style={{
                float: 'right',
              }}
            >
              <FormattedMessage id="pages.login.forgotPassword" defaultMessage="忘记密码"/>
            </a>
          </div>
        </LoginForm>

      </div>
      <Footer/>
    </div>
  );
};

export default Login;
