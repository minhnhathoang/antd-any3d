import {Footer, Question, SelectLang, AvatarDropdown, AvatarName, ProjectSelector} from '@/components';
import {LinkOutlined} from '@ant-design/icons';
import {PageLoading, Settings as LayoutSettings} from '@ant-design/pro-components';
import {SettingDrawer} from '@ant-design/pro-components';
import {RunTimeLayoutConfig} from '@umijs/max';
import {history, Link} from '@umijs/max';
import defaultSettings from '../config/defaultSettings';
import {errorConfig} from './requestErrorConfig';
import {getCurrentUser, getCurrentUserProfile} from '@/services/ant-design-pro/api';
import React, {Suspense} from 'react';

const isDev = process.env.NODE_ENV === 'development';
const loginPath = '/auth/login';

import type {RequestConfig} from 'umi';
import {Avatar, Progress, Spin} from "antd";
import {Canvas} from "@react-three/fiber";
import {Loader, useProgress, View} from "@react-three/drei";
import AppNotification from "@/components/AppNotification";

export async function getInitialState(): Promise<{
  settings?: Partial<LayoutSettings>;
  currentUser?: UserCO;
  currentUserProfile?: UserProfileCO;
  loading?: boolean;
  fetchCurrentUser?: () => Promise<UserCO | undefined>;
  fetchCurrentUserProfile?: () => Promise<UserProfileCO | undefined>;
}> {

  const fetchCurrentUserProfile = async () => {
    try {
      const msg = await getCurrentUserProfile();
      return msg.data;
    } catch (error) {

    }
    return undefined;
  };

  const fetchCurrentUser = async () => {
    try {
      const msg = await getCurrentUser({
        skipErrorHandler: true,
      });
      return msg.data;
    } catch (error) {
      history.push(loginPath);
    }
    return undefined;
  };

  const {location} = history;
  if (![loginPath, '/auth/register', '/auth/register-result'].includes(location.pathname)) {
    const currentUser = await fetchCurrentUser();
    const currentUserProfile = await fetchCurrentUserProfile();

    return {
      fetchCurrentUser,
      fetchCurrentUserProfile,
      currentUser,
      currentUserProfile,
      settings: defaultSettings as Partial<LayoutSettings>,
    };
  }

  return {
    fetchCurrentUserProfile,
    fetchCurrentUser,
    settings: defaultSettings as Partial<LayoutSettings>,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({initialState, setInitialState}) => {

  return {
    actionsRender: () => [<ProjectSelector key="ProjectSelector"/>, <AppNotification key="Notification"/>,
      <Question key="doc"/>, <SelectLang key="SelectLang"/>],
    avatarProps: {
      src: initialState?.currentUserProfile?.avatar,
      icon: <Avatar style={{
        backgroundColor: '#fde3cf',
        color: '#d27e0e'
      }}><b>{initialState?.currentUser?.username?.charAt(0).toUpperCase()}</b></Avatar>,
      title: <AvatarName/>,
      render: (_, avatarChildren) => {
        return <AvatarDropdown>{avatarChildren}</AvatarDropdown>;
      },
    },
    footerRender: () => <Footer/>,
    onPageChange: () => {
      const {location} = history;
      if (!initialState?.currentUser && location.pathname !== loginPath) {
        history.push(loginPath);
      }
    },
    locale: 'en-US',
    bgLayoutImgList: [
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/D2LWSqNny4sAAAAAAAAAAAAAFl94AQBr',
        left: 85,
        bottom: 100,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/C2TWRpJpiC0AAAAAAAAAAAAAFl94AQBr',
        bottom: -68,
        right: -45,
        height: '303px',
      },
      {
        src: 'https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/F6vSTbj8KpYAAAAAAAAAAAAAFl94AQBr',
        bottom: 0,
        left: 0,
        width: '331px',
      },
    ],
    links: isDev
      ? [
        // <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
        //   <LinkOutlined/>
        //   <span>OpenAPI 文档</span>
        // </Link>,
      ]
      : [],
    menuHeaderRender: undefined,
    onMenuHeaderClick: () => {
    },

    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children) => {
      if (initialState?.loading) return <PageLoading/>;
      return (
        <>
          {children}
          {isDev && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}

          <Canvas
            frameloop="always"
            gl={{alpha: true}}
            style={{position: 'fixed', top: 0, bottom: 0, left: 0, right: 0}}
            eventSource={document.getElementsByTagName("body")[0]}>
            <Suspense fallback={null}>
              <View.Port/>
            </Suspense>

          </Canvas>
          <Loader/>
        </>
      );
    },
    ...initialState?.settings,
  };
};

export const request: RequestConfig = {
  ...errorConfig
};
