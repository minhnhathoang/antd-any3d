import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import React from 'react';

const Footer: React.FC = () => {

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      style={{
        background: 'none',
      }}
      copyright={`2023 - ${currentYear}`}
      links={[
        {
          key: 'Any3D Portal',
          title: 'Any3D Portal',
          href: 'https://pro.ant.design',
          blankTarget: true,
        },
        {
          key: 'github',
          title: <GithubOutlined />,
          href: 'https://github.com/minhnhathoang/antd-any3d',
          blankTarget: true,
        },
        {
          key: 'nhathm',
          title: 'minhnhathoang',
          href: 'https://github.com/minhnhathoang',
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
