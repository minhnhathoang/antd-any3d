import {PageContainer} from '@ant-design/pro-components';
import {useModel} from '@umijs/max';
import {Card, theme} from 'antd';
import React from 'react';

import {EditOutlined, EllipsisOutlined, SettingOutlined} from '@ant-design/icons';
import {Avatar} from 'antd';
import AssetCard from './components/AssetCard';
import {Canvas} from "@react-three/fiber";
import {Preload, View} from "@react-three/drei";

const {Meta} = Card;

const Asset: React.FC = () => {
  const {token} = theme.useToken();
  const {initialState} = useModel('@@initialState');
  return (
    <PageContainer>
      <Card
        style={{
          borderRadius: 8,
        }}
        bodyStyle={{
          backgroundImage:
            initialState?.settings?.navTheme === 'realDark'
              ? 'background-image: linear-gradient(75deg, #1A1B1F 0%, #191C1F 100%)'
              : 'background-image: linear-gradient(75deg, #FBFDFF 0%, #F5F7FF 100%)',
        }}
      >
        <div
          style={{
            backgroundPosition: '100% -30%',
            backgroundRepeat: 'no-repeat',
            backgroundSize: '274px auto',
            backgroundImage:
              "url('https://gw.alipayobjects.com/mdn/rms_a9745b/afts/img/A*BuFmQqsB2iAAAAAAAAAAAAAAARQnAQ')",
          }}
        >
          <div
            style={{
              fontSize: '20px',
              color: token.colorTextHeading,
            }}
          >
            欢迎使用 Ant Design Pro
          </div>
          <p
            style={{
              fontSize: '14px',
              color: token.colorTextSecondary,
              lineHeight: '22px',
              marginTop: 16,
              marginBottom: 32,
              width: '65%',
            }}
          >
            Ant Design Pro 是一个整合了 umi，Ant Design 和 ProComponents
            的脚手架方案。致力于在设计规范和基础组件的基础上，继续向上构建，提炼出典型模板/业务组件/配套设计资源，进一步提升企业级中后台产品设计研发过程中的『用户』和『设计者』的体验。
          </p>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 16,
            }}
          >
            <AssetCard
              fileName={"test.png"}
              fileSize={'123.03 MB'}
              url={"https://picsum.photos/200/300"}
            />

            <AssetCard
              fileName={"test.png"}
              fileSize={'123.03 MB'}
              url={"https://picsum.photos/id/237/200/300"}
            />
          </div>
        </div>
      </Card>

    </PageContainer>
  );
};

export default Asset;
